const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');

const feedController = require('../controllers/feed');

let user;

describe(`Feed middleware`, function () {
    before(function (done) {
        mongoose
            .connect(
                `mongodb+srv://abdelrahman:bedo@cluster0.fccjy.mongodb.net/test-messages`)
            .then(() => {
                const user = new User({
                    _id: new mongoose.Types.ObjectId().toHexString(),
                    email: 'admin@admin.com',
                    password: 'admin',
                    name: 'admin',
                    posts: []
                });
                return user.save();
            })
            .then((addedUser) => {
                user = addedUser;
                done();
            })
            .catch(err => {
                console.log(err);
            });
    })

    it('Should add a created post to the posts of the creator', function (done) {
        const req = {
            body: {
                title: 'Admin Post',
                content: 'Admin Post Content'
            },
            file: {
                path: 'Admin Post Image'
            },
            userId: user._id.toString()
        };
        const res = {
            status: function () { return this; },
            json: function () { return this; }
        };

        feedController.createPost(req, res, () => { })
            .then(() => {
                return User.findById(user._id);
            })
            .then((updatedUser) => {
                expect(updatedUser).to.have.property('posts');
                expect(updatedUser.posts).to.have.length(1);
                done();
            })
    });

    after(function (done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });
});