import Post from "../../models/post.js";

class PostService {
  // Create post
  async createPost(userId, postData) {
    try {
      const post = new Post({
        ...postData,
        author: userId,
      });
      await post.save();
      return await post.populate("author", "username avatar");
    } catch (error) {
      throw new Error(`Error creating post: ${error.message}`);
    }
  }

  // Get all posts with pagination and filters
  async getPosts(filters = {}, pagination = { page: 1, limit: 10 }) {
    try {
      console.log("INSIDE");
      const posts = await Post.find(filters)
        .populate("author", "username avatar")
        .sort({ createdAt: -1 })
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit);

      const total = await Post.countDocuments(filters);

      return {
        posts,
        pagination: {
          total,
          page: pagination.page,
          limit: pagination.limit,
          pages: Math.ceil(total / pagination.limit),
        },
      };
    } catch (error) {
      throw new Error(`Error fetching posts: ${error.message}`);
    }
  }

  // Get single post by ID
  async getPostById(postId) {
    try {
      const post = await Post.findById(postId)
        .populate("author", "username avatar")
        .populate("comments.author", "username avatar");

      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    } catch (error) {
      throw new Error(`Error fetching post: ${error.message}`);
    }
  }

  // Update post
  async updatePost(postId, userId, updateData) {
    try {
      const post = await Post.findOneAndUpdate(
        { _id: postId, author: userId },
        { $set: updateData },
        { new: true }
      ).populate("author", "username avatar");

      if (!post) {
        throw new Error("Post not found or unauthorized");
      }

      return post;
    } catch (error) {
      throw new Error(`Error updating post: ${error.message}`);
    }
  }

  // Delete post
  async deletePost(postId, userId) {
    try {
      const post = await Post.findOneAndDelete({
        _id: postId,
        author: userId,
      });

      if (!post) {
        throw new Error("Post not found or unauthorized");
      }

      return { message: "Post deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting post: ${error.message}`);
    }
  }

  // Like/Unlike post
  async toggleLike(postId, userId) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      const likeIndex = post.likes.indexOf(userId);
      if (likeIndex > -1) {
        post.likes.splice(likeIndex, 1); // Unlike
      } else {
        post.likes.push(userId); // Like
      }

      await post.save();
      return post;
    } catch (error) {
      throw new Error(`Error toggling like: ${error.message}`);
    }
  }

  // Add comment
  async addComment(postId, userId, content) {
    try {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $push: {
            comments: {
              content,
              author: userId,
            },
          },
        },
        { new: true }
      ).populate("comments.author", "username avatar");

      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    } catch (error) {
      throw new Error(`Error adding comment: ${error.message}`);
    }
  }

  // Remove comment
  async removeComment(postId, commentId, userId) {
    try {
      const post = await Post.findOneAndUpdate(
        { _id: postId, "comments._id": commentId, "comments.author": userId },
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      );

      if (!post) {
        throw new Error("Comment not found or unauthorized");
      }

      return post;
    } catch (error) {
      throw new Error(`Error removing comment: ${error.message}`);
    }
  }

  // Search posts
  async searchPosts(query) {
    try {
      const searchRegex = new RegExp(query, "i");
      return await Post.find({
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { tags: searchRegex },
        ],
      }).populate("author", "username avatar");
    } catch (error) {
      throw new Error(`Error searching posts: ${error.message}`);
    }
  }
}
export default new PostService();
