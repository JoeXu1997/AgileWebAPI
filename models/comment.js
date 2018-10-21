let mongoose = require('mongoose');
let CommentSchema = new mongoose.Schema({
        username: String,
        commentfor:String,
        content:String,
        date:{type: Date, default:Date.now}
    },
    { collection: 'comment' });
module.exports = mongoose.model('Comment', CommentSchema);