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
            movietype: 'Comedy',
            Directedby:"ZhenWei Liu",
            mainActor:"XingChi Zhou",
            upvotes: 1
        });
        var newMovie1 =  new Movie({
            name:"Roman Holiday",
            movietype: 'Romance',
            Directedby:"William Wyler",
            mainActor:"Audrey Hepburn"
        });
        newMovie1.save(function(err) {
            done();
            newMovie.save();
        });
    });
    afterEach(function(done){
        Movie.collection.drop();
        done();
    });
    describe("GET functions",function () {
        describe('GET /movies',  function(){
            it('should return all the movies in an array ordered by upvotes', function(done) {
                chai.request(server)
                    .get('/movies')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(2);
                        done();
                    });
            });
        });
        describe('GET /movies/actor/:mainActor',function () {
            it('should return movies which has someone as actor ', function(done) {
                chai.request(server)
                    .get('/movies/actor/Hepburn')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.length).to.equal(1);
                        expect(res.body[0]).to.have.property("name").equal("Roman Holiday");
                      //  expect(res.body[0]).to.have.property("name").equal("made");
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
        describe('GET /movies/director/:Directedby',function () {
            it('should return movies which has someone as director', function(done) {
                chai.request(server)
                    .get('/movies/director/Liu')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.length).to.equal(1);
                       // expect(res.body[1]).to.have.property("name").equal("made");
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
        describe('GEt /movies/:movietype',function () {
            it('should return movies according to types ', function(done) {
                chai.request(server)
                    .get('/movies/Comedy')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.length).to.equal(1);
                        expect(res.body[0]).to.have.property("name").equal("A Chinese Odyssey");
                        done();
                    });
            });
            it('should return empty array if no matching results ', function(done) {
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
    // describe('POST functions',function () {
    //     describe('POST /usr', function () {
    //         it('should return success message and update database(add a new user)', function(done) {
    //             let user = {
    //                 username: "test" ,
    //                 password: "123456",
    //                 usertype: "common"
    //             };
    //             chai.request(server)
    //                 .post('/usr')
    //                 .send(user)
    //                 .end(function(err, res) {
    //                     expect(res).to.have.status(200);
    //                     expect(res.body).to.have.property('message').equal('User Add Successful!');
    //                     done();
    //                 });
    //         });
    //         afterEach(function  (done) {
    //             chai.request(server)
    //                 .get('/usr')
    //                 .send({"operator":"xu"})
    //                 .end(function(err, res) {
    //                     let result = _.map(res.body, (user) => {
    //                         return { username: user.username,
    //                             usertype: user.usertype };
    //                     }  );
    //                     expect(result[1]).to.include( { username: "test", usertype: "common"  } );
    //                     done();
    //                 });
    //         });  // end-after
    //     });
    // });
    // describe('PUT functions',function () {
    //     beforeEach(function (done) {
    //         var newUser = new User({
    //             username: "yue",
    //             password: "123456",
    //             usertype: "common"
    //         });
    //         newUser.save(function(err) {
    //             done();
    //         });
    //     });
    //     describe('PUT /usr/pw', () => {
    //         it('should return success message and user password should be different with before', function(done) {
    //             chai.request(server)
    //                 .put('/usr/pw')
    //                 .send({"operator":"xu","newpw":"newone"})
    //                 .end(function(err, res) {
    //                     expect(res).to.have.status(200);
    //                     expect(res.body).to.have.property('message').equal("Change Successfully");
    //                     let user = res.body.data ;
    //                     expect(user).to.have.property('password').equal("newone");
    //                     done();
    //                 });
    //         });
    //         it('should failed message if the operator doesnot exist', function(done) {
    //             chai.request(server)
    //                 .put('/usr/pw')
    //                 .send({"operator":"xus","newpw":"newone"})
    //                 .end(function(err, res) {
    //                     expect(res).to.have.status(200);
    //                     expect(res.body).to.have.property('message').equal("Change Failed! No Such User!");
    //                     done();
    //                 });
    //         });
    //     });
    //     describe('PUT /usr/vote',function () {
    //         beforeEach(function (done) {
    //             var movie = new Movie({
    //                 name:"Inception",
    //                 movietype: 'ScienceFiction',
    //                 Directedby:"Christopher Nolan",
    //                 mainActor:"Leonardo DiCaprio"});
    //
    //             movie.save(function(err) {
    //                 done();
    //             });
    //         });
    //         afterEach(function (done) {
    //             Movie.collection.drop();
    //             done();
    //         })
    //         it('should return success message and user should voted for one movie after this', function(done) {
    //             chai.request(server)
    //                 .put('/usr/vote')
    //                 .send({"operator":"yue","votefor":"Inception"})
    //                 .end(function(err, res) {
    //                     expect(res).to.have.status(200);
    //                     expect(res.body).to.have.property('message').equal('Vote Successful!');
    //                     expect(res.body.data).to.have.property('username').equal('yue');
    //                     expect(res.body.data.actions).to.have.property('upvotefor').equal('Inception');
    //                     done();
    //                 });
    //         });
    //         it('should return failed message if the user had already vote for other movies', function(done) {
    //             chai.request(server)
    //                 .put('/usr/vote')
    //                 .send({"operator":"xu","votefor":"Inception"})
    //                 .end(function(err, res) {
    //                     expect(res).to.have.status(200);
    //                     expect(res.body).to.have.property('message').equal("Each user could vote for only one movie");
    //                     done();
    //                 });
    //         });
    //     })
    // });
    // describe('DELETE /usr/:id',() => {
    //     beforeEach(function (done) {
    //         User.find(function (err,users) {
    //             id =users[0]._id;
    //             done();
    //         })
    //     })
    //     it('should return a message and delete a user record', function (done) {
    //         chai.request(server)
    //             .delete('/usr/'+id)
    //             .send({"operator":"xu"})
    //             .end(function (err, res) {
    //                 expect(res).to.have.status(200);
    //                 expect(res.body).to.have.property('message',  "Delete Successful");
    //                 let user = res.body.data;
    //                 expect(user.username).is.to.equal("xu");
    //                 done();
    //             });
    //     });
    // });
});