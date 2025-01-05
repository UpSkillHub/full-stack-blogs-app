import PostService from "../services/posts/post.service.js";

class PostController {
  async createPost(req, res) {
    try {
      const post = await PostService.createPost(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPosts(req, res) {
    console.log("INSIDE");
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const posts = await PostService.getPosts(filters, { page, limit });
      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPost(req, res) {
    try {
      const post = await PostService.getPostById(req.params.id);
      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updatePost(req, res) {
    try {
      const post = await PostService.updatePost(
        req.params.id,
        req.user.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: post,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deletePost(req, res) {
    try {
      await PostService.deletePost(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async toggleLike(req, res) {
    try {
      const post = await PostService.toggleLike(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: "Post like toggled successfully",
        data: post,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addComment(req, res) {
    try {
      const post = await PostService.addComment(
        req.params.id,
        req.user.id,
        req.body.content
      );
      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: post,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async removeComment(req, res) {
    try {
      const post = await PostService.removeComment(
        req.params.id,
        req.params.commentId,
        req.user.id
      );
      res.status(200).json({
        success: true,
        message: "Comment removed successfully",
        data: post,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async searchPosts(req, res) {
    try {
      const posts = await PostService.searchPosts(req.query.q);
      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
export default new PostController();
