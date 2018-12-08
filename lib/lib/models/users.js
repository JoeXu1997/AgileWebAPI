'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
// db.userdb.insert({
//     username: "admin",
//     password: "admin",
//     usertype:"admin",
//     actions: {
//         upvotefor: "Inception",
//         comment:{
//             commentfor:["Inception"],
//             content:["great movie"]
//         }
//     }
// })
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    usertype: String,
    actions: {
        upvotefor: { type: String, default: "" },
        comment: {
            commentfor: [],
            content: []
        }
    }
}, { collection: 'user' });
UserSchema.pre('save', function (next) {
    //ref：https://medium.com/createdd-notes/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});
module.exports = mongoose.model('User', UserSchema);