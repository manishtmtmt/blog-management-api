require("dotenv").config();
const chai = require("chai");
const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const { authenticate } = require("../../../middleware/authenticate");
const PostModel = require("../../../models/posts-model");
const { updatePost } = require("../../../controller/blog-controller");

const jwtSecret = process.env.JWT_SECRET;

const app = express();
const expect = chai.expect;
app.use(express.json());
app.use("/posts/:postId", authenticate, updatePost);

const token = jwt.sign({ userId: "testUserId" }, jwtSecret);

describe("Update Post", () => {
  // Mock the rate limit middleware
  app.use(
    "/posts",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: "Too many requests from this IP, please try again later.",
    })
  );

  it("should update a post", (done) => {
    const testPost = {
      _id: "testPostId",
      title: "Test Post",
      description: "Test Description",
      category: "Test Category",
      updatedBy: "testUserId",
    };

    // Mock the PostModel.findById function to return the test post
    PostModel.findById = async (postId) => testPost;

    // Mock the PostModel.findByIdAndUpdate function to update the post
    PostModel.findByIdAndUpdate = async (postId, updatedPostData) => {
      expect(postId).to.equal("testPostId");
      expect(updatedPostData.title).to.equal("Updated Title");
      expect(updatedPostData.description).to.equal("Updated Description");
      expect(updatedPostData.category).to.equal("Updated Category");
    };

    request(app)
      .patch("/posts/testPostId")
      .set("x-access-token", token)
      .send({
        title: "Updated Title",
        description: "Updated Description",
        category: "Updated Category",
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal("Post updated successfully!");
        expect(res.body.post).to.deep.equal(testPost);

        done();
      });
  });

  it("should return 403 status on missing token", function (done) {
    request(app)
      .patch("/posts/testPostId")
      .send({
        title: "Updated Title",
        description: "Updated Description",
        category: "Updated Category",
      })
      .expect(403, done);
  });

  it("should handle a not-found post", (done) => {
    // Mock the PostModel.findById function to return null (post not found)
    PostModel.findById = async () => null;

    request(app)
      .patch("/posts/nonexistentPostId")
      .set("x-access-token", token)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("No post found");

        done();
      });
  });

  it("should handle internal server error", (done) => {
    // Mock the PostModel.findById function to throw an error
    PostModel.findById = async () => {
      throw new Error("Internal Server Error");
    };

    request(app)
      .patch("/posts/testPostId")
      .set("x-access-token", token)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("Internal Server Error");

        done();
      });
  });
});
