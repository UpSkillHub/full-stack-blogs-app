import UserService from "../services/users/user.service.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.js";

class AuthController {
  async register(req, res) {
    try {
      const user = await UserService.register(req.body);
      //   const token = UserService.generateToken(user._id);
      const token = generateToken(user._id);
      console.log("TOKEN", token);

      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: {
          user,
          //   token,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const result = await UserService.login(req.body);

      // Log login activity
      await UserService.logUserActivity(result.user._id, "User logged in");

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    try {
      // Log logout activity
      await UserService.logUserActivity(req.user.id, "User logged out");

      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      const result = await UserService.resetPassword(email);

      // In a real application, you would send the reset token via email
      // For development, we're returning it in the response
      res.status(200).json({
        success: true,
        message: "Password reset instructions sent to email",
        data: { resetToken: result.resetToken },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      // Verify reset token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Update password
      await UserService.updateUser(decoded.id, { password: newPassword });

      res.status(200).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("No token provided");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserService.getUserById(decoded.id);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // Generate new access token
      const newToken = UserService.generateToken(decoded.id);

      res.status(200).json({
        success: true,
        data: { token: newToken },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      await UserService.changePassword(req.user.id, {
        currentPassword,
        newPassword,
      });

      // Log password change activity
      await UserService.logUserActivity(req.user.id, "Password changed");

      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
export default new AuthController();
