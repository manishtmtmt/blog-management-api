require("dotenv").config();
const chai = require("chai");
const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const { authenticate } = require("../../../middleware/authenticate");
const { createPost } = require("../../../controller/blog-controller");
const PostModel = require("../../../models/posts-model");

const jwtSecret = process.env.JWT_SECRET;

const app = express();
const expect = chai.expect;
app.use(express.json());
app.use("/posts", authenticate, createPost);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
    process.exit();
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const token = jwt.sign({ userId: "testUserId" }, jwtSecret);

describe("Unit Tests for createPost Route", function () {
  app.use(
    "/posts",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: "Too many requests from this IP, please try again later.",
    })
  );

  it("should return 201 status and success message on successful post creation", function (done) {
    const testPost = {
      userId: "testUserId",
      title: "Test Title",
      description: "Test Description",
      category: "Test Category",
    };

    // Mock the PostModel.create function
    PostModel.create = async (postData) => {
      expect(postData.title).to.equal("Test Title");
      expect(postData.description).to.equal("Test Description");
      expect(postData.category).to.equal("Test Category");
      expect(postData.createdBy).to.equal("testUserId");
      return testPost;
    };

    request(app)
      .post("/posts")
      .set("x-access-token", token)
      .send(testPost)
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal("Post saved successfully!");
        expect(res.body.post).to.deep.equal(testPost);
        done();
      });
  });

  it("should return 400 status and an error message on missing fields", function (done) {
    // Simulate authentication by creating a valid token
    const token = jwt.sign({ userId: "user123" }, jwtSecret);

    request(app)
      .post("/posts")
      .set("x-access-token", token)
      .send({
        userId: "user123",
        title: "Test Post",
        description: "Test Description",
        // Missing category field
      })
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal(
          "UserId, title, description, and category are required fields."
        );
        done();
      });
  });

  it("should return 403 status on missing token", function (done) {
    request(app)
      .post("/posts")
      .send({
        userId: "user123",
        title: "Test Post",
        description: "Test Description",
        category: "Test Category",
      })
      .expect(403, done);
  });

  it("should return 401 status on an invalid token", function (done) {
    // Simulate an invalid token
    const token = "invalid_token";

    request(app)
      .post("/posts")
      .set("x-access-token", token)
      .send({
        userId: "user123",
        title: "Test Post",
        description: "Test Description",
        category: "Test Category",
      })
      .expect(401, done);
  });
});
