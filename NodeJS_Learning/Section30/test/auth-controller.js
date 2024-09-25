const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');

const authController = require('../controllers/auth');

let user;

describe(`Auth middleware`, function () {
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

    it('Should throw an error with code 500 if accessing the database failed', function (done) {
        const req = {
            body: {
                email: 'admin@admin.com',
                password: 'admin'
            }
        }

        sinon.stub(User, 'findOne');
        User.findOne.throws();

        authController.login(req, {}, () => { })
            .then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            })
        User.findOne.restore();
    });

    it('Should return a response with a valid status for an existing user', function (done) {
        const req = { userId: user._id };
        const res = {
            statusCode: 500,
            status: null,
            status: function (code) { this.statusCode = code; return this; },
            json: function (data) { this.status = data.status; return this; },
        }
        authController.getUserStatus(req, res, () => { })
            .then(() => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.status).to.be.equal('I am new!');
                done();
            });
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
