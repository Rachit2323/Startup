const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findByIdAndUpdate } = require("../models/post");
const Post = require("../models/post");
const User = require("../models/user.js");

const Story = require("../models/story.js");
const getDataUri = require("./dataUri.js");
const cloudinary = require("cloudinary");

exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file;

    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    const newPost = new Post({
      caption,
      image: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
      postedBy: req.userId,
    });

    await newPost.save();
    res.status(200).json({ success: true, error: "Post created succesfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "An error occurred during creatingPost" });
  }
};

// exports.createStory = async (req, res) => {
//   try {
//     const { title, description, tags } = req.body;
//     const tagsArray = tags ? tags : [];

//     const newPost = new Story({
//       title,
//       description,
//       postedBy: req.userId,
//     });

//     await newPost.save();

//     res.status(200).json({ success: true, error: "Story created succesfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       error: "An error occurred during creating Story",
//     });
//   }
// };

exports.allPost = async (req, res) => {
  try {
    const allpost = await Post.find()
      .populate("postedBy", "username createdAt profileimg")
      .populate("comments.userId", "username")
      .populate("likes.userId", "username")
      .sort({ createdAt: -1 });
    const userDetails = await User.findById(req.userId);

    res.status(200).json({
      success: true,
      allpost,
      userDetails,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching posts",
    });
  }
};

exports.myPost = async (req, res) => {
  try {
    const allpost = await Post.find({ postedBy: req.userId })
      .populate("postedBy", "username createdAt")
      .populate("comments.userId", "username")
      .populate("likes.userId", "username")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, allpost, message: "Posts fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching posts",
    });
  }
};

exports.searchPost = async (req, res) => {
  try {
    const { user } = req.body;
    const UserId = await User.find({ username: user }).select("_id");

    const allpost = await Post.find({ postedBy: UserId }).populate(
      "postedBy",
      "username createdAt profileimg"
    );

    res.status(200).json({
      success: true,
      allpost,
      message: " Search Posts fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching Search posts",
    });
  }
};

exports.mysavepost = async (req, res) => {
  try {
    const allpost = await Post.find({ SavedBy: req.userId })
      .populate("comments.userId", "username")
      .populate("likes.userId", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      allpost,
      message: "Saved Posts fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching Saved posts",
    });
  }
};

exports.comments = async (req, res) => {
  try {
    const { postId, commentText } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      userId: req.userId,
      text: commentText,
    };

    post.comments.push(newComment);
    //use push tho make comment inside the model schema
    await post.save();
    return res
      .status(200)
      .json({ success: true, comment: commentText, message: "Comment Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while commenting on post",
    });
  }
};

exports.allcomments = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching comments",
    });
  }
};

exports.userPost = async (req, res) => {
  try {
    const userPost = await Post.find({ postedBy: req.userId });
    res
      .status(200)
      .json({ success: true, userPost, message: "Posts fetched successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching posts",
    });
  }
};

exports.handlelike = async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = req.userId;
    const post = await Post.findById(postId);
    if (post.likes.includes(userId)) {
      await Post.findByIdAndUpdate(
        req.body.postId,
        {
          $pull: { likes: req.userId },
        },
        { new: true }
      ); // it is used to give  recently updated data

      res.status(200).json({ success: true, message: "Post Unliked" });
    } else {
      await Post.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { likes: req.userId },
        },
        { new: true }
      ); // it is used to give  recently updated data

      res.status(200).json({ success: true, message: "Post liked" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while liking the post",
    });
  }
};

exports.savepost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (post.SavedBy.includes(userId)) {
      await Post.findByIdAndUpdate(
        req.body.postId,
        {
          $pull: { SavedBy: userId },
        },
        { new: true }
      ); // it is used to give  recently updated data

      res
        .status(200)
        .json({ success: true, message: "Post Removed from save" });
    } else {
      await Post.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { SavedBy: userId },
        },
        { new: true }
      ); // it is used to give  recently updated data

      res.status(200).json({ success: true, message: "Post Saved" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while Saving post",
    });
  }
};

exports.comment = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.userId;

    const comment = {
      text: text,
      postedBy: userId,
    };

    const postId = req.body.PostId;

    // Update the post's comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment },
    });

    res
      .status(200)
      .json({ success: true, message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "An error occurred while adding the comment",
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.body;

    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      res.status(200).json({ success: true, message: "Post Not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Post Deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Post Not Deleted successfully",
    });
  }
};

exports.editPost = async (req, res) => {
  try {
    const { postId, finalupdate } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { caption: finalupdate },
      { new: true }
    );

    if (!updatedPost) {
      res.status(500).json({ success: true, message: "Post Not found" });
    }

    res.status(200).json({
      success: true,
      updatedPost,
      message: "Post Updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Post Not Updated successfully",
    });
  }
};

exports.profile = async (req, res) => {

  try {
    const file = req.file;

    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    const userDetails = await User.findById(req.userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    userDetails.profileimg = {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    };

    await userDetails.save();

    res.status(200).json({
      success: true,
      userDetails,
      message: "Profile image updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Profile image not updated successfully",
    });
  }
};
