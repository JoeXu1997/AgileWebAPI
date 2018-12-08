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
describe('Movie API', function (){
    Movie.collection.drop();
    beforeEach(function(done){
        var newMovie = new Movie({
            name:"A Chinese Odyssey",
            movietype: "Comedy",
            Directedby:"ZhenWei Liu",
            mainActor:"XingChi Zhou",
            upvotes: 1
        });
        newMovie.save(function(err,data) {
            id = data._id
            done();
        });
    });
    beforeEach(function (done) {
        var movie = new Movie({
            name: "made",
            movietype: 'Comedy',
            Directedby: "Zhen me Liu",
            mainActor: "Xing me",
            upvotes: 2
        });
        movie.save(function (err) {
            done();
        });
    });
    beforeEach(function (done) {
        var newUser1 = new User({
            username: 'yue',
            password: '123456',
            usertype: 'admin',
            actions: {
                upvotefor: "",
                comment:{
                    commentfor: [],
                    content: []
                }
            }
        });
        newUser1.save(function (err) {
            done();
        });
    })
    beforeEach(function (done) {
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
        newUser.save(function (err) {
            done();
        });
    })
    afterEach(function(done){
        Movie.collection.drop();
        done();
    });
    afterEach(function (done) {
        User.collection.drop();
        done();
    })
    describe("GET functions",function () {
        describe('GET /movies',  function() {
                it('should return all the movies in an array ordered by upvotes', function (done) {
                    chai.request(server)
                        .get('/movies')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body.data).to.be.a('array');
                            expect(res.body.data.length).to.equal(2);
                            done();
                        });
                });
        });
        describe('GET /movies/actor/:mainActor', function () {
                it('should return movies which has someone as actor ', function (done) {
                    chai.request(server)
                        .get('/movies/actor/Xing')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body.length).to.equal(2);
                            expect(res.body[0]).to.have.property("name").equal("A Chinese Odyssey");
                            expect(res.body[1]).to.have.property("name").equal("made");
                            done();
                        });
                });
                it('should return empty array if there is no matching result', function (done) {
                    chai.request(server)
                        .get('/movies/actor/Audaarey')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body.length).to.equal(0);
                            done();
                        });
                });
        });
        describe('GET /movies/director/:Directedby', function () {
                it('should return movies which has someone as director', function (done) {
                    chai.request(server)
                        .get('/movies/director/Zhen')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body.length).to.equal(2);
                            expect(res.body[1]).to.have.property("name").equal("made");
                            expect(res.body[0]).to.have.property("name").equal("A Chinese Odyssey");
                            done();
                        });
                });
                it('should return empty array if there is no matching result', function (done) {
                    chai.request(server)
                        .get('/movies/director/Liuaaaa')
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body.length).to.equal(0);
                            done();
                        });
                });
        });
        describe('GET /movies/:movietype',function () {
                it('should return movies according to types ', function (done) {
                      chai.request(server)
                       .get('/movies/Comedy')
                       .end((err, res) => {
                         expect(res).to.have.status(200);
                         expect(res.body.length).to.equal(2);
                         expect(res.body[0]).to.have.property("name").equal("A Chinese Odyssey");
                         expect(res.body[1]).to.have.property("name").equal("made");
                         done();
                     });
                 });
                it('should return empty array if no matching results ', function (done) {
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
        it('should return success message and update database(add a new movie)', function(done) {
            let movie = {
                name: "test",
                movietype: "Horror",
                Directedby: "me",
                mainActor:"me",
                upvotes:0
            }
            chai.request(server)
                .post('/addmoviestest')
                .send(movie)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('Movie Add Successful!');
                        done();
                });
        });
        afterEach(function  (done) {
            console.log("in afer")
            chai.request(server)
                .get('/movies')
                .end(function(err, res) {
                    let result = res.body.data;
                    expect(result[2]).to.have.property("name").equal("test");
                    done();
                });
        });  // end-after
    });
    describe('PUT functions',function () {
        it('should return success message and add 1 to movie upvotes', function(done) {
            chai.request(server)
                .put('/movies/'+id)
                .send({"operator":"yue"})
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal("Upvote Successful");
                    let movie = res.body.data ;
                    expect(movie).to.have.property('upvotes').equal(2);
                    done();
                });
        });
        it('should failed if the operator already vote for other movies', function(done) {
            Movie.find({},function (err,movie) {
                chai.request(server)
                    .put('/movies/'+id)
                    .send({"operator":"xu"})
                    .end(function(err, res) {
                        expect(res.body).to.have.property('message').equal("Each user could only vote for one movie");
                        done();
                    });
            })
        });
    });
    describe('DELETE /movies/:id',function() {
        afterEach(function (done) {
            User.collection.drop();
            done();
        })
        it('should return success message and delete one movie', function(done) {
            var newUser1 = new User({
                username: 'test',
                password: '123456',
                usertype: "admin",
            });
            newUser1.save(function (err,data) {
                chai.request(server)
                    .delete('/movies/'+id)
                    .send({"operator":data.username})
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal("Delete Successful");
                        done();
                    });
            });
        })
        it('should failed message if the operator not an admin', function(done) {
            var newUser = new User({
                username: 'test2',
                password: '123456',
                usertype: "common",
            });
            newUser.save(function (err,data) {
                chai.request(server)
                    .delete('/movies/'+id)
                    .send({"operator":data.username})
                    .end(function(err, res) {
                        expect(res.body).to.have.property('message').equal("You donot have this authority");
                        done();
                    });
            });
        })
    });
});
