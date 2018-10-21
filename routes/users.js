let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var User = require('../models/users');
var mongodbUri ='mongodb://joe:a123456@ds149479.mlab.com:49479/moviedb';    //necessary
mongoose.connect(mongodbUri);
//mongoose.connect('mongodb://localhost:27017/moviedb');
let db = mongoose.connection;
db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

/* GET users listing. */
router.getusers = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    User.find(function(err, users) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(users,null,5));
    });
};
router.getUserWithUpvotefor = (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.params.upvotefor);
    User.findOne({ "actions.upvotefor" : req.params.upvotefor },function(err, user) {
        if (err)
            res.send({ message: 'No Users Vote for this Movie!', errmsg : err });
        else
            res.send(JSON.stringify(user,null,5));
    });

};
router.getUserWithCommentfor = (req,res) =>{
    res.setHeader('Content-Type', 'application/json');

    User.find({ "actions.comment.commentfor" : req.params.commentfor},function(err, user) {
        if (err)
            res.send({ message: 'No Users Comment this Movie!', errmsg : err });
        else
            res.send(JSON.stringify(user,null,5));
    });
};
router.changepw = (req,res) =>{
    User.findOne({"username":req.body.username}, function(err,user) {//{username:xx,newpassword:xxx}
        if (err)
            res.json({message:"User Not Found",errmsg:err});
        else {
            user.password = req.body.password;
            user.save(function (err) {
                if (err)
                    res.json({message:"Change failed",errmsg:err});
                else
                    res.json({message:"Change Successful",data:user});
            });
        }
    });
};

router.removeOneUser = (req,res) =>{
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({message:"Delete Failed",errmsg:err})
        else
            res.json({message:"Delete Successful"})
    });
};

//{"username": "joe",    "password": "joe123",    "actions": {       "upvotefor": "Roman Holiday",       "comment":{         "commentfor":["Roman Holiday"],        "content":["great romance movie"]     }   } }
router.addUser = (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.actions.upvotefor = req.body.actions.upvotefor;
    user.actions.comment.commentfor = req.body.actions.comment.commentfor;
    user.actions.comment.content = req.body.actions.comment.content;

    user.save(function(err) {
        if (err)
            res.json({ message: 'Movie Add Failed!', errmsg : err });
        else
            res.json({ message: 'Movie Add Successful!',data:user});
    });
};


// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
// });

module.exports = router;
