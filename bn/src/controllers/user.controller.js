import UserService from "../services/users/user.service.js";

class userController {
  // Authentication Controllers
  async register(req, res) {
    try {
      const user = await UserService.register(req.body);
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
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

  // User CRUD Controllers
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const users = await UserService.getAllUsers(filters, { page, limit });
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  // Password Management Controllers
  async changePassword(req, res) {
    try {
      const result = await UserService.changePassword(req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: result.message,
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
      const result = await UserService.resetPassword(req.body.email);
      res.status(200).json({
        success: true,
        message: result.message,
        data: { resetToken: result.resetToken },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Profile Management Controllers
  async updateProfile(req, res) {
    try {
      const user = await UserService.updateProfile(req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Search Controllers
  async searchUsers(req, res) {
    try {
      const users = await UserService.searchUsers(req.query.q);
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Activity Controllers
  async getUserActivity(req, res) {
    try {
      const activity = await UserService.getUserActivity(req.params.id);
      res.status(200).json({
        success: true,
        data: activity,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logActivity(req, res) {
    try {
      await UserService.logUserActivity(req.user.id, req.body.activity);
      res.status(200).json({
        success: true,
        message: "Activity logged successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new userController();
