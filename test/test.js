process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let MESSAGE = require("../src/modal/messages.modal.js");

//Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/index.js");
const should = chai.should();
const expect = require("chai").expect;

chai.use(chaiHttp);

describe("API TEST", () => {
  let messages = [];
  before(done => {
    MESSAGE.find()
      .lean()
      .then(data => {
        messages = data;
        done();
      });
  });

  it("it should GET all the messages", done => {
    chai
      .request(server)
      .get("/messages")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a("array");
        done();
      });
  });
  it("it should GET single message by ID", done => {
    const testId = messages[Math.floor(Math.random() * Math.floor(5))].id;

    chai
      .request(server)
      .get(`/messages/${testId}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a("object");
        expect(res.body.error).to.be.false;
        done();
      });
  });
  it("it should DELETE single message by ID", done => {
    const testId = messages[Math.floor(Math.random() * Math.floor(5))].id;
    chai
      .request(server)
      .delete(`/messages/${testId}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a("object");
        expect(res.body.error).to.be.false;
        done();
      });
  });
});
