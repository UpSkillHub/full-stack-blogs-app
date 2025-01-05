import User from "../../models/user.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  // Authentication Services
  async register(userData) {
    try {
      const { username, email, password } = userData;

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // Create new user
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });

      const savedUser = await user.save();
      return this.sanitizeUser(savedUser);
    } catch (error) {
      throw new Error(`Registration error: ${error.message}`);
    }
  }

  async login(credentials) {
    try {
      const { email, password } = credentials;

      // Find user
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        throw new Error("User not found");
      }
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      // Generate token
      const token = this.generateToken(user._id);

      return {
        token,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      throw new Error(`Login error: ${error.message}`);
    }
  }

  // User CRUD Operations
  async getAllUsers(filters = {}, pagination = { page: 1, limit: 10 }) {
    try {
      const users = await User.find(filters)
        .select("-password")
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(filters);

      return {
        users,
        pagination: {
          total,
          page: pagination.page,
          limit: pagination.limit,
          pages: Math.ceil(total / pagination.limit),
        },
      };
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  async updateUser(userId, updateData) {
    try {
      // If password is being updated, hash it
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select("-password");

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return { message: "User deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // Password Management
  async changePassword(userId, { currentPassword, newPassword }) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        throw new Error("Current password is incorrect");
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      user.password = hashedPassword;
      await user.save();

      return { message: "Password changed successfully" };
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
  }

  async resetPassword(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      // Generate reset token
      const resetToken = this.generateToken(user._id, "1h");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      return {
        message: "Password reset token generated",
        resetToken,
      };
    } catch (error) {
      throw new Error(`Error resetting password: ${error.message}`);
    }
  }

  // Profile Management
  async updateProfile(userId, profileData) {
    try {
      const allowedUpdates = ["username", "email", "avatar", "bio"];
      const updates = Object.keys(profileData)
        .filter((key) => allowedUpdates.includes(key))
        .reduce((obj, key) => {
          obj[key] = profileData[key];
          return obj;
        }, {});

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      ).select("-password");

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }
  }

  // Search and Filter
  async searchUsers(query) {
    try {
      const searchRegex = new RegExp(query, "i");
      return await User.find({
        $or: [{ username: searchRegex }, { email: searchRegex }],
      }).select("-password");
    } catch (error) {
      throw new Error(`Error searching users: ${error.message}`);
    }
  }

  // Utility Methods
  generateToken(userId, expiresIn = "1d") {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
  }

  sanitizeUser(user) {
    const sanitized = user.toObject();
    delete sanitized.password;
    return sanitized;
  }

  // Activity Tracking
  async getUserActivity(userId) {
    try {
      const user = await User.findById(userId)
        .select("lastLogin loginHistory activityLog")
        .populate("activityLog");

      if (!user) {
        throw new Error("User not found");
      }

      return {
        lastLogin: user.lastLogin,
        loginHistory: user.loginHistory,
        activityLog: user.activityLog,
      };
    } catch (error) {
      throw new Error(`Error fetching user activity: ${error.message}`);
    }
  }

  async logUserActivity(userId, activity) {
    try {
      await User.findByIdAndUpdate(userId, {
        $push: {
          activityLog: {
            action: activity,
            timestamp: new Date(),
          },
        },
      });
    } catch (error) {
      throw new Error(`Error logging user activity: ${error.message}`);
    }
  }
}

export default new UserService();
