import chai from "chai";
import chaiHttp from "chai-http";
import productTests from "./product-test.js";
import userTests from "./user-test.js";

const should = chai.should();

chai.use(chaiHttp);

userTests();
productTests();

