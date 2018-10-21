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
                    expect(res.body.length).to.equal(18);
                    // let result = _.map(res.body, (donation) => {
                    //     return { id: donation.id,
                    //         amount: donation.amount }
                    // });
                    // expect(result).to.include( { id: 1000000, amount: 1600  } );
                    // expect(result).to.include( { id: 1000001, amount: 1100  } );
                    // done();
                    done();
                });
        });
    });
});