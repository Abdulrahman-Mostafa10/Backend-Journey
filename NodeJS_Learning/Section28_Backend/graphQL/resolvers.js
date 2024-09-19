const fs = require("fs");
const path = require("path");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = require("../models/user");
const Post = require("../models/post");
const createError = require("../utils/error").createError;

module.exports = {
    createUser: async function ({ userData }, req) {
        // ****************** 1. VALIDATE INPUT DATA ******************
        const errors = [];
        if (validator.isEmpty(userData.email)) {
            errors.push("Email can not be empty");
        }

        userData.email = validator.normalizeEmail(userData.email);

        if (!validator.isEmail(userData.email)) {
            errors.push("Invalid email");
        }

        if (
            !validator.isLength(userData.password, {
                min: 4,
            })
        ) {
            errors.push("Invalid password");
        }

        if (errors.length > 0) {
            const error = createError("Invalid input", errors, 422);
            throw error;
        }

        // ****************** 2. CREATE USER ASYNCHRONOUSLY ******************
        try {
            const existingUser = await User.findOne({
                email: userData.email,
            });
            if (existingUser) {
                const error = createError("User already exists", 422);
                throw error;
            }

            const hashedPassword = await bcrypt.hash(userData.password, 12);
            if (!hashedPassword) {
                const error = createError("Password hashing failed", 500);
                throw error;
            }

            const novelUser = new User({
                email: userData.email,
                name: userData.name,
                password: hashedPassword,
            });

            const createdUser = await novelUser.save();
            if (!createdUser) {
                const error = createError("User creation failed", 500);
                throw error;
            }
            return {
                ...createdUser._doc,
                _id: createdUser._id.toString(),
            };
        } catch (err) {
            throw err;
        }
    },
    getPosts: async function ({ currentPage }, req) {
        const page = currentPage || 1;
        const perPage = 2;

        try {
            const totalPosts = await Post.find().countDocuments();
            const posts = await Post.find().sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage).populate("creator");
            if (!posts) {
                const error = createError("Posts not found", 404);
                throw error;
            }

            return {
                posts: posts.map((post) => {
                    return {
                        ...post._doc,
                        _id: post._id.toString(),
                        createdAt: post.createdAt.toISOString(),
                        updatedAt: post.updatedAt.toISOString(),
                    };
                }),
                totalPosts: totalPosts,
            };

        } catch (err) {
            throw err;
        }
    }
    ,
    createPost: async function ({ postData }, req) {
        // ****************** 1. AUTHENTICATE USER ******************
        if (!req.isAuth) {
            const error = createError("Not authenticated", [], 401);
            throw error;
        }

        // ****************** 2. VALIDATE INPUT DATA ******************
        const errors = [];
        if (
            validator.isEmpty(postData.title) ||
            !validator.isLength(postData.title, { min: 4, })
        ) {
            errors.push("Title is invalid");
        }
        if (
            validator.isEmpty(postData.content) ||
            !validator.isLength(postData.content, { min: 5, })
        ) {
            errors.push("Content is invalid");
        }
        if (errors.length > 0) {
            const error = createError("Invalid input", errors, 422);
            throw error;
        }

        // ****************** 3. CREATE POST ASYNCHRONOUSLY ******************
        const user = await User.findById(req.userId);
        if (!user) {
            const error = createError("User not found", 404);
            throw error;
        }

        try {
            const post = new Post({
                title: postData.title,
                imageUrl: postData.imageUrl,
                content: postData.content,
                creator: user,
            });

            user.posts.push(post);
            await user.save();

            const createdPost = await post.save();
            if (!createdPost) {
                const error = createError("Post creation failed", 500);
                throw error;
            }

            return { ...createdPost._doc, _id: createdPost._id.toString(), createdAt: createdPost.createdAt.toISOString(), updatedAt: createdPost.updatedAt.toISOString() };
        } catch (err) {
            throw err;
        }
    },
    login: async function ({ email, password }, req) {
        // ****************** 1. VALIDATE INPUT DATA ******************
        const errors = [];
        if (validator.isEmpty(email)) {
            errors.push("Email can not be empty");
        }

        email = validator.normalizeEmail(email);

        if (!validator.isEmail(email)) {
            errors.push("Invalid email");
        }

        if (
            !validator.isLength(password, {
                min: 4,
            })
        ) {
            errors.push("Invalid password");
        }

        if (errors.length > 0) {
            const error = createError("Invalid input", errors, 422);
            throw error;
        }

        // ****************** 2. LOGIN USER ASYNCHRONOUSLY ******************
        try {
            const existingUser = await User.findOne({
                email: email,
            });
            if (!existingUser) {
                const error = createError("User not found", 401);
                throw error;
            }

            const isEqual = await bcrypt.compare(password, existingUser.password);
            if (!isEqual) {
                const error = createError("Password is incorrect", 401);
                throw error;
            }

            // ****************** 3. CREATE TOKEN ******************
            const token = jwt.sign(
                {
                    userId: existingUser._id.toString(),
                    email: existingUser.email,
                },
                `thIs iS mY seCReT`,
                {
                    expiresIn: "1h",
                }
            );
            return {
                token: token,
                userId: existingUser._id.toString(),
                email: existingUser.email,
            };
        } catch (err) {
            throw err;
        }
    },
    post: async function ({ id }, req) {
        if (!req.isAuth) {
            const error = createError("Not authenticated", [], 401);
            throw error;
        }

        const post = await Post.findById(id).populate("creator");
        if (!post) {
            const error = createError("Post not found", 404);
            throw error;
        }

        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
        }
    },
    updatePost: async function ({ id, postData }, req) {
        if (!req.isAuth) {
            const error = createError("Not authenticated", [], 401);
            throw error;
        }
        try {
            const post = await Post.findById(id).populate("creator");
            if (!post) {
                const error = createError("Post not found", 404);
                throw error;
            }

            if (post.creator._id.toString() !== req.userId) {
                const error = createError("Not authorized", [], 403);
                throw error;
            }

            const errors = [];
            if (
                validator.isEmpty(postData.title) ||
                !validator.isLength(postData.title, { min: 4, })
            ) {
                errors.push("Title is invalid");
            }
            if (
                validator.isEmpty(postData.content) ||
                !validator.isLength(postData.content, { min: 5, })
            ) {
                errors.push("Content is invalid");
            }
            if (errors.length > 0) {
                const error = createError("Invalid input", errors, 422);
                throw error;
            }

            post.title = postData.title;
            post.content = postData.content;
            if (postData.imageUrl !== "undefined") {
                const filePath = path.join(__dirname, `..`, post.imageUrl);
                fs.unlink(filePath, (err) => console.log(err));
                post.imageUrl = postData.imageUrl;
            }

            const updatedPost = await post.save();
            if (!updatedPost) {
                const error = createError("Post update failed", 500);
                throw error;
            }
            return {
                ...updatedPost._doc,
                _id: updatedPost._id.toString(),
                createdAt: updatedPost.createdAt.toISOString(),
                updatedAt: updatedPost.updatedAt.toISOString(),
            }
        }
        catch (err) {
            throw err;
        }
    },
    deletePost: async function ({ id }, req) {
        if (!req.isAuth) {
            const error = createError("Not authenticated", [], 401);
            throw error;
        }
        try {
            const post = await Post.findById(id).populate("creator");
            if (!post) {
                const error = createError("Post not found", 404);
                throw error;
            }

            if (post.creator._id.toString() !== req.userId) {
                const error = createError("Not authorized", [], 403);
                throw error;
            }

            const user = await User.findById(req.userId);
            user.posts.pull(id);

            const updatedUser = await user.save();
            if (!updatedUser) {
                const error = createError("User update failed", 500);
                throw error;
            }
            filePath = path.join(__dirname, `..`, post.imageUrl);
            fs.unlink(filePath, (err) => console.log(err));
            const deletedPost = await Post.deleteOne({ _id: id });

            if (!deletedPost) {
                const error = createError("Post deletion failed", 500);
                throw error;
            }
            return true;
        }
        catch (err) {
            throw err;
        }
    },
    user: async function (args, req) {
        if (!req.isAuth) {
            const error = createError("Not authenticated", [], 401);
            throw error;
        }
        try {
            const user = await User.findById(req.userId).populate("posts");
            if (!user) {
                const error = createError("User not found", 404);
                throw error;
            }

            return {
                ...user._doc,
                _id: user._id.toString(),
            }
        }
        catch (err) {
            throw err;
        }
    },
    updateStatus: async function ({ status }, req) {
        if (!req.isAuth) {
            const error = createError("Not authenticated", [], 401);
            throw error;
        }

        const user = await User.findById(req.userId);
        if (!user) {
            const error = createError("User not found", 404);
            throw error;
        }

        user.status = status;
        const updatedUser = await user.save();
        if (!updatedUser) {
            const error = createError("User update failed", 500);
            throw error;
        }

        return {
            ...updatedUser._doc,
            _id: updatedUser._id.toString(),
        }
    }

};
