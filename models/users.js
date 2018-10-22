let mongoose = require('mongoose');
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
let UserSchema = new mongoose.Schema({
        username: String,
        password: String,
        usertype: String,
        actions:{
            upvotefor:{type:String,default:""},
            comment:{
                commentfor:[],         //default: new Array()
                content:[]
            }
        }
    },
    { collection: 'userdb' });
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});
module.exports = mongoose.model('User', UserSchema);