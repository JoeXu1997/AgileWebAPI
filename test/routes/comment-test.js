let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;

chai.use(chaiHttp);
let _ = require('lodash' );

describe('Comments', function (){
    // describe('GET /comment',  () => {
    //     it('should return all the comments in an array', function(done) {
    //         chai.request(server)
    //             .get('/comment')
    //             .end((err, res) => {
    //                 expect(res).to.have.status(200);
    //                 expect(res.body).to.be.a('array');
    //                 expect(res.body.length).to.equal(1);
    //                 done();
    //             });
    //     });
    // });
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
    // describe('PUT /comment/:id', () => {
    //     it('should return a comment and the comment content should be different with before', function(done) {
    //         chai.request(server)
    //             .put('/comment/5bd1c916f6bf492830ff24ec')
    //             .send({commentfor:"Inception",content:"new nice flim"})
    //             .end(function(err, res) {
    //                 expect(res).to.have.status(200);
    //                 let donation = res.body.data ;
    //                 expect(donation).to.include( { _id: "5bd1c916f6bf492830ff24ec", content: "new nice flim"  } );
    //                 done();
    //             });
    //     });
    // });
});