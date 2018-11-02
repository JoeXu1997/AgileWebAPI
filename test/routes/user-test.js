let chai = require('chai');
let chaiHttp = require('chai-http');
var mongoose = require("mongoose");
let server = require('../../bin/www');
let expect = chai.expect;
let User = require('../../models/users');
chai.use(chaiHttp);
let _ = require('lodash' );
chai.use(require('chai-things'));

describe('User API', function (){
    User.collection.drop();
    beforeEach(function(done){
        var newUser = new User({
            username: 'xu',
            password: '123456',
            usertype: 'admin',
            actions:{
                upvotefor:"Inception",
                comment:{
                    commentfor:["Inception"],
                    content:["Good Film"]
                }
            }
        });
        newUser.save(function(err) {
            done();
        });
    });
    afterEach(function(done){
        User.collection.drop();
        done();
    });
    describe.only("GET functions",function () {
        describe('GET /usr',  function(){
            beforeEach(function (done) {
                var newUser = new User({
                    username: "yue",
                    password: "123456",
                    usertype: "common",
                    actions:{
                        upvotefor:"Roman Holiday",
                        comment:{
                            commentfor:["Roman Holiday"],
                            content:["Nice Film"]
                        }
                    }
                });
                newUser.save(function(err) {
                    done();
                });
            })
            it('should return all the user with an array if the operator is an admin', function(done) {
                chai.request(server)
                    .get('/usr')
                    .send({"operator":"xu"})
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(2);//according to collection comment
                        done();
                    });
            });
            it('should return wrong message if operator is not an admin', function(done) {
                chai.request(server)
                    .get('/usr')
                    .send({"operator":"yue"})
                    .end((err, res) => {
                        expect(res.body).to.have.property('message',"You donnot have right to do this operation!") ;
                        done();
                    });

            });
        });
        describe('GET /usr/myself',function () {
            it('should return only one user ', function(done) {
                chai.request(server)
                    .get('/usr/myself')
                    .send({"operator":"xu"})
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property("username").equal("xu");
                        done();
                    });
            });
            it('should return null if username doesnot exist ', function(done) {
                chai.request(server)
                    .get('/usr/myself')
                    .send({"operator":"made"})
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).equal(null) ;
                        done();
                    });
            });
        });
        describe('/usr/upvote/:upvotefor',function () {
            it('should return one user who upvote for specific movie', function(done) {
                chai.request(server)
                    .get('/usr/upvote/Inception')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body[0]).to.have.property("username").equal("xu");
                        done();
                    });
            });
            it('should return empty array if the voted-movie doesnot exist ', function(done) {
                chai.request(server)
                    .get('/usr/upvote/asd')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(0);
                        done();
                    });
            });
        });
        describe('/usr/comment/:commentfor',function () {
            it('should return users who comment on a specific movie', function(done) {
                chai.request(server)
                    .get('/usr/comment/Inception')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        let result = _.map(res.body, (user) => {
                            return { username: user.username,
                                commentfor: user.actions.comment.commentfor[0],
                                content: user.actions.comment.content[0]};
                        }  );
                        expect(result[0]).to.include( { username: "xu", commentfor: "Inception" ,content:"Good Film" } );
                        done();
                    });
            });
            it('should return empty array if the commented-movie doesnot exist ', function(done) {
                chai.request(server)
                    .get('/usr/upvote/asd')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(0);
                        done();
                    });
            });
        });
    });
    describe('POST functions',function () {
        describe('POST /comment', function () {
            it('should return confirmation message and update database(add a new comment)', function(done) {
                let comment = {
                    username: 'xu' ,
                    commentfor: "Dangal",
                    content: "nice movie"
                };
                chai.request(server)
                    .post('/comment')
                    .send(comment)
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('Comment Add Successful!' );
                        done();
                    });
            });
        });
    });
    describe('PUT /comment/:id', () => {
        it('should return a comment and the comment content should be different with before', function(done) {
            chai.request(server)
                .put('/comment/5bd1c916f6bf492830ff24ec')
                .send({commentfor:"Inception",content:"new nice flim"})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let donation = res.body.data ;
                    expect(donation).to.include( { _id: "5bd1c916f6bf492830ff24ec", content: "new nice flim"  } );//depends on existing comments
                    done();
                });
        });
    });
    describe('DELETE /comment/:id',() => {
        it('should return a message and delete a donation record', function (done) {
            chai.request(server)
                .delete('/comment/5bd1f7c2329ef129b6b54d0a')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Delete Successful');
                    let comment = res.body.data;
                    expect(comment.commentfor).is.to.equal("Roman Holiday");
                    expect(comment.content).is.to.equal("Nice film");
                    done();
                });
        });
    });
});