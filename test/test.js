process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let MESSAGE = require("../src/modal/messages.modal.js");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../src/index.js");
let should = chai.should();

chai.use(chaiHttp);

describe("API TEST", () => {
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
    const testId = "u_2SyXvVA";
    chai
      .request(server)
      .get(`/messages/${testId}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a("object");
        done();
      });
  });
  it("it should DELETE single message by ID", done => {
    const testId = "u_2SyXvVA";
    chai
      .request(server)
      .delete(`/messages/${testId}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a("object");
        done();
      });
  });
});
