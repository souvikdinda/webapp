import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app.js";

const should = chai.should();

chai.use(chaiHttp);

describe("Testing GET Method", () => {
  // it("Using valid credentials", (done) => {
  //   chai
  //     .request(app)
  //     .get("/v1/user/3")
  //     .auth("neha@gmail.com", "123456")
  //     .end((err, res) => {
  //       res.should.have.status(200);
  //       res.should.be.json;
  //       res.body.should.not.have.property("password");
  //       res.body.should.have.property("first_name");
  //       res.body.should.have.property("last_name");
  //       res.body.should.have.property("username");
  //       done();
  //     });
  // });

  it("Without credentials", (done) => {
    chai
      .request(app)
      .get("/v1/user/2")
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  // it("With incorrect credentials", (done) => {
  //   chai
  //     .request(app)
  //     .get("/v1/user/3")
  //     .auth("neha@gmail.com", "1234567")
  //     .end((err, res) => {
  //       res.should.have.status(403);
  //       done();
  //     });
  // });

  // it("Wrong userId passed", (done) => {
  //   chai
  //     .request(app)
  //     .get("/v1/user/90")
  //     .auth("neha@gmail.com", "123456")
  //     .end((err, res) => {
  //       res.should.have.status(400);
  //       done();
  //     });
  // });
});

describe("Testing POST Method", () => {
  it("Sending POST request without body", (done) => {
    let user = {};
    chai
      .request(app)
      .post("/v1/user")
      .send(user)
      .end((err, res) => {
        res.should.have.status(204);
        done();
      });
  });

  it("Creating user with invalid key", (done) => {
    let user = {
      first_name: "Bill",
      last_name: "Gates",
      mobile: "123456",
      username: "bill@gmail.com",
    };
    chai
      .request(app)
      .post("/v1/user")
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});


describe("Testing PUT Method", () => {

    // it("Sending PUT request without body", (done) => {
    //     let user = {};
    //     chai
    //       .request(app)
    //       .put("/v1/user/3")
    //       .auth('neha@gmail.com', '123456')
    //       .send(user)
    //       .end((err, res) => {
    //         res.should.have.status(204);
    //         done();
    //       });
    //   });

    it("Sending PUT request without credentials", (done) => {
      let user = {};
      chai
        .request(app)
        .put("/v1/user/3")
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    // it("Updating user successfully", (done) => {
    //   let user = {
    //     first_name: "Neha"
    //   };
    //   chai
    //     .request(app)
    //     .put("/v1/user/3")
    //     .auth('neha@gmail.com', '123456')
    //     .send(user)
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       done();
    //     });
    // });

    // it("Trying to update username", (done) => {
    //     let user = {
    //       username: "Neha"
    //     };
    //     chai
    //       .request(app)
    //       .put("/v1/user/3")
    //       .auth('neha@gmail.com', '123456')
    //       .send(user)
    //       .end((err, res) => {
    //         res.should.have.status(400);
    //         done();
    //       });
    //   });

  });
