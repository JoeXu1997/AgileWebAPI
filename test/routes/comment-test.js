let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
let Comment = require('../../models/comment');
let User = require('../../models/users');
let Movie = require('../../models/movies');
chai.use(chaiHttp);
let _ = require('lodash' );
chai.use(require('chai-things'));
var commentid;
let testuser;
let testmovie;
describe('Comments API', function (){
    beforeEach(function (done) {
        var  user = new User({
          username: "xu",
          password: "123456",
          usertype: "admin",
            actions:{
                upvotefor:"",
                comment:{
                    commentfor:["Inception","Inception"],
                    content:["Nice Movie","Good Film"]
                }
            }
      })
        user.save(function (err) {
            done();
        })
    });
    beforeEach(function (done) {
        var movie = new Movie({
            name:"Inception",
            movietype: 'ScienceFiction',
            Directedby:"Christopher Nolan",
            mainActor:"Leonardo DiCaprio",
            upvotes: 2
        });
        movie.save(function (err) {
            done();
        });
    })
    beforeEach(function (done) {
        var  comment = new Comment({
            username: "xu",
            commentfor: "Inception",
            content: "Nice Movie"
        })
        comment.save(function (err,data) {
            commentid=data._id;
            done();
        })
    });
    beforeEach(function (done) {
        var  comment1 = new Comment({
            username: "xu",
            commentfor: "Inception",
            content: "Good Film"
        })
        comment1.save(function (err) {
            done();
        })
    });
    afterEach(function(done){
        Movie.collection.drop();
        done();
    });
    afterEach(function(done){
        User.collection.drop();
        done();
    });
    afterEach(function(done){
        Comment.collection.drop();
        done();
    });
    describe("GET functions",function () {
        describe('GET /comment',  () => {
            it('should return all the comments in an array', function(done) {
                chai.request(server)
                    .get('/comment')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(2);
                        done();
                    });
            });
        });
        describe('GET /comment/one/:id',function () {
            it('should return one comment with specific id', function(done) {
                chai.request(server)
                    .get('/comment/one/'+commentid)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('username').equal('xu' );
                        expect(res.body).to.have.property('commentfor').equal('Inception' );
                        expect(res.body).to.have.property('content').equal('Nice Movie' );
                        done();
                    });
            });
        });
        describe('GET /comment/movie/:commentfor',function () {
            it('should return specific movie\'s all comments ', function(done) {
                chai.request(server)
                    .get('/comment/movie/'+"Inception")
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.length).to.equal(2);
                        expect(res.body[0]).to.have.property("content").equal("Nice Movie");
                        expect(res.body[1]).to.have.property("content").equal("Good Film");
                        done();
                    });
            });
        });
        describe('GET /comment/:username',function () {
            it('should return specific user\'s all comments ', function(done) {
                chai.request(server)
                    .get('/comment/'+"xu")
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.length).to.equal(2);
                        expect(res.body[0]).to.have.property("content").equal("Nice Movie");
                        expect(res.body[1]).to.have.property("content").equal("Good Film");
                        done();
                    });
            });
        });
    })
    describe('POST /comment', function () {
        it('should return confirmation message and update database(add a new comment)', function(done) {
            let comment = {
                username: 'xu' ,
                commentfor: "Inception",
                content: "new nice movie"
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
        afterEach(function (done) {
            chai.request(server)
                .get('/usr/myself')
                .send({"operator":"xu"})
                .end(function (err,res) {
                    expect(res.body.actions.comment.commentfor[2]).is.to.equal("Inception")
                    expect(res.body.actions.comment.content[2]).is.to.equal("new nice movie")
                    done();
                })
        })
    });
    describe('PUT /comment/:id', () => {
        it('should return a comment and the comment content should be different with before', function(done) {
            chai.request(server)
                .put('/comment/'+commentid)
                .send({commentfor:"Inception",content:"new nice flim"})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let donation = res.body.data ;
                    expect(donation).to.include( { _id: commentid, content: "new nice flim"  } );//depends on existing comments
                    done();
                });
        });
    });
    describe('DELETE /comment/:id',() => {
        it('should return a message and delete a donation record', function (done) {
            chai.request(server)
                .delete('/comment/'+commentid)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Delete Successful');
                    let comment = res.body.data;
                    expect(comment.commentfor).is.to.equal("Inception");
                    expect(comment.content).is.to.equal("Nice Movie");
                    done();
                });
        });
    });
});