let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
let Comment = require('../../models/comment');
chai.use(chaiHttp);
let _ = require('lodash' );
chai.use(require('chai-things'));

describe('Comments', function (){
    beforeEach(function () {
        while(Comment.length > 0) {
            Comment.pop();
        }
        datastore.push(
            {username:"joe",commentfor:"Inception",content:"Nice film"}
        );
        datastore.push(
            {username:"test",commentfor:"Roman Holiday",content:"Good film"}
        );
    });
    describe('GET /comment',  () => {
        it('should return all the comments in an array', function(done) {
            chai.request(server)
                .get('/comment')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);//according to collection comment
                    done();
                });
        });
    });
    describe('POST /donations', function () {
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