let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
let User = require('../../models/users');
let Movie = require('../../models/movies');
chai.use(chaiHttp);
let _ = require('lodash' );
chai.use(require('chai-things'));
var id;
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
    describe("GET functions",function () {
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
        describe('POST /usr', function () {
            it('should return success message and update database(add a new user)', function(done) {
                let user = {
                    username: "test" ,
                    password: "123456",
                    usertype: "common"
                };
                chai.request(server)
                    .post('/usr')
                    .send(user)
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('User Add Successful!');
                        done();
                    });
            });
            afterEach(function  (done) {
                chai.request(server)
                    .get('/usr')
                    .send({"operator":"xu"})
                    .end(function(err, res) {
                        let result = _.map(res.body, (user) => {
                            return { username: user.username,
                                usertype: user.usertype };
                        }  );
                        expect(result[1]).to.include( { username: "test", usertype: "common"  } );
                        done();
                    });
            });  // end-after
        });
    });
    describe('PUT functions',function () {
        beforeEach(function (done) {
            var newUser = new User({
                username: "yue",
                password: "123456",
                usertype: "common"
            });
            newUser.save(function(err) {
                done();
            });
        });
        describe('PUT /usr/pw', () => {
            it('should return success message and user password should be different with before', function(done) {
                chai.request(server)
                    .put('/usr/pw')
                    .send({"operator":"xu","newpw":"newone"})
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal("Change Successfully");
                        let user = res.body.data ;
                        expect(user).to.have.property('password').equal("newone");
                        done();
                    });
            });
            it('should failed message if the operator doesnot exist', function(done) {
                chai.request(server)
                    .put('/usr/pw')
                    .send({"operator":"xus","newpw":"newone"})
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal("Change Failed! No Such User!");
                        done();
                    });
            });
        });
        describe('PUT /usr/vote',function () {
            beforeEach(function (done) {
                var movie = new Movie({
                    name:"Inception",
                    movietype: 'ScienceFiction',
                    Directedby:"Christopher Nolan",
                    mainActor:"Leonardo DiCaprio"});

                movie.save(function(err) {
                    done();
                });
            });
            afterEach(function (done) {
                Movie.collection.drop();
                done();
            })
            it('should return success message and user should voted for one movie after this', function(done) {
                chai.request(server)
                    .put('/usr/vote')
                    .send({"operator":"yue","votefor":"Inception"})
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('Vote Successful!');
                        expect(res.body.data).to.have.property('username').equal('yue');
                        expect(res.body.data.actions).to.have.property('upvotefor').equal('Inception');
                        done();
                    });
            });
            it('should return failed message if the user had already vote for other movies', function(done) {
                chai.request(server)
                    .put('/usr/vote')
                    .send({"operator":"xu","votefor":"Inception"})
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal("Each user could vote for only one movie");
                        done();
                    });
            });
        })
    });
    describe('DELETE /usr/:id',() => {
        beforeEach(function (done) {
            User.find(function (err,users) {
                id =users[0]._id;
                done();
            })
        })
        it('should return a message and delete a user record', function (done) {
            chai.request(server)
                .delete('/usr/'+id)
                .send({"operator":"xu"})
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message',  "Delete Successful");
                    let user = res.body.data;
                    expect(user.username).is.to.equal("xu");
                    done();
                });
        });
    });
});