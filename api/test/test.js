import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app.js";
import productTests from "./product-test.js";
import userTests from "./user-test.js";

const should = chai.should();

chai.use(chaiHttp);

describe("Testing GET Method", () => {
      
    it("GET health check", (done) => { //Test case for getting health check
      chai
        .request(app)
        .get("/healthz")
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
});

// userTests();
// productTests();

