let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;

chai.use(chaiHttp);
let _ = require('lodash' );

describe('Comments', function (){
    describe('GET /comment',  () => {
        it('should return all the donations in an array', function(done) {
            chai.request(server)
                .get('/comment')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    done();
                });
        });
    });
    describe('PUT /comment',()=>{
       it('')
    });
});