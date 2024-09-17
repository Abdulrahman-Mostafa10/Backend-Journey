const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

const Post = require("../models/post");
const User = require(`../models/user`);

const createError = require("../utils/error").createError;
const throwError = require("../utils/error").throwError;

// ************************* Helping Functions ************************* //

const clearImage = (filePath) => {
    filePath = path.join(__dirname, `..`, filePath);
    fs.unlink(filePath, (err) => console.log(err));
};

// ************************* GET Requests ************************* //

exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        const totalItems = await Post.countDocuments();
        const posts = await Post.find().populate('creator').skip((currentPage - 1) * perPage).limit(perPage);
        res.status(200).json({
            message: `Fetched posts successfully!`,
            posts: posts,
            totalItems: totalItems,
        });
    }
    catch (err) {
        throwError(err, next);
    };
};

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = createError(`Could not find post.`, 404);
            throw error;
        }
        res.status(200).json({
            message: `Post fetched successfully!`,
            post: post,
        });
    }
    catch (err) {
        throwError(err, next);
    };
};

// ************************* POST Requests ************************* //

exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = createError(
            `Validation failed, entered data is incorrect.`,
            errors.array,
            422
        );
        throw error;
    }
    if (!req.file) {
        const error = createError(`No image provided.`, 422);
        throw error;
    }

    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.file.path.replace(`\\`, `/`),
        creator: req.userId,
    });

    try {
        const novelPost = await newPost.save();
        if (!novelPost) {
            const error = createError(`Could not create post.`, errors.array, 507);
            throw error;
        }
        const user = await User.findById(req.userId);
        user.posts.push(newPost);

        const novelUser = await user.save();
        if (!novelUser) {
            const error = createError(`Could not save user.`, errors.array, 507);
            throw error;
        }

        res.status(201).json({
            message: `Post created successfully!`,
            post: newPost,
            creator: { _id: novelUser._id, name: novelUser.name },
        });
    }
    catch (err) {
        throwError(err, next);
    };
};

// ************************* PUT Requests ************************* //

exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = createError(
            `Validation failed, entered data is incorrect.`,
            errors.array,
            422
        );
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path.replace(`\\`, `/`);
    }
    if (!imageUrl) {
        const error = createError(`No file picked.`, 422);
        throw error;
    }
    try {
        const post = await Post.findById(postId);
        if (!post) {
            const error = createError(`Could not find post.`, errors.array, 404);
            throw error;
        }

        if (req.userId !== post.creator.toString()) {
            const error = createError(`Unauthorized action`, [], 401);
            throw error;
        }

        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;

        const result = await post.save();

        res.status(200).json({
            message: `Post updated successfully!`,
            post: result,
        });
    }
    catch (err) {
        throwError(err, next);
    };
};

// ************************* DELETE Requests ************************* //

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
        const error = createError(`Could not find post.`, 404);
        throw error;
    }

    if (req.userId !== post.creator.toString()) {
        const error = createError(`Unauthorized action`, [], 401);
        throw error;
    }

    clearImage(post.imageUrl);

    try {
        const deletedPosts = await Post.deleteOne({ _id: postId });
        if (deletedPosts.deletedCount === 0) {
            const error = createError(`Could not delete post.`, [], 500);
            throw error;
        }
        const user = await User.findById(req.userId);
        user.posts.pull(postId);

        const result = await user.save();

        if (!result) {
            const error = createError(`Could not save user.`, [], 500);
            throw error;
        }

        res.status(200).json({ message: `Post deleted successfully!` });
    }
    catch (err) {
        throwError(err, next);
    };
};
