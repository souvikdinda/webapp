import chai from "chai";
import app from "../app.js";

const productTests = () => {

    describe("Testing GET Method", () => {
      
        it("GET product details", (done) => { //Test case for getting product details
          chai
            .request(app)
            .get("/v1/product/5000")
            .end((err, res) => {
              res.should.have.status(404);
              done();
            });
        });
    });

    describe("Testing POST Method", () => {
        it("Sending POST request without credentials", (done) => { //Test cases for posting product
          let user = {};
          chai
            .request(app)
            .post("/v1/product")
            .send(user)
            .end((err, res) => {
              res.should.have.status(401);
              done();
            });
        });
    });

    describe("Testing PUT Method", () => {
        it("Sending PUT request without credentials", (done) => { //Test cases for updating product
          let user = {};
          chai
            .request(app)
            .put("/v1/product/1")
            .send(user)
            .end((err, res) => {
              res.should.have.status(401);
              done();
            });
        });
    });

    describe("Testing PATCH Method", () => {
        it("Sending PATCH request without credentials", (done) => { //Test cases for patch method to update product
          let user = {};
          chai
            .request(app)
            .patch("/v1/product/1")
            .send(user)
            .end((err, res) => {
              res.should.have.status(401);
              done();
            });
        });
    });

    describe("Testing DELETE Method", () => {
        it("Sending DELETE request without credentials", (done) => { //Test case to delete product
          let user = {};
          chai
            .request(app)
            .delete("/v1/product/1")
            .send(user)
            .end((err, res) => {
              res.should.have.status(401);
              done();
            });
        });
    });

}

export default productTests;