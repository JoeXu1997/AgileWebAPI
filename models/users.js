let mongoose = require('mongoose');
// db.userdb.insert({
//     username: "admin",
//     password: "admin",
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
        actions:{
            upvotefor:String,
            comment:{
                commentfor:[],         //default: new Array()
                content:[]
            }
        }
    },
    { collection: 'userdb' });
module.exports = mongoose.model('User', UserSchema);