const express = require('express');
const {
    body
} = require('express-validator');

const isAuth = require(`../middlewares/is-Auth`);

const feedController = require('../controllers/feed');

const router = express.Router();

// ************************* GET Requests ************************* // 

router.get(`/posts`, isAuth, feedController.getPosts);
router.get(`/post/:postId`, isAuth, feedController.getPost);

// ************************* POST Requests ************************* // 

router.post(`/post`, isAuth, [body('title').trim().isLength({
    min: 5
}), body('content').trim().isLength({
    min: 5
})], feedController.createPost);

// ************************* PUT Requests ************************* // 

router.put(`/post/:postId`, isAuth, [body('title').trim().isLength({
    min: 5
}), body('content').trim().isLength({
    min: 5
})], feedController.updatePost);

// ************************* DELETE Requests ************************* //

router.delete(`/post/:postId`, isAuth, feedController.deletePost);
module.exports = router;