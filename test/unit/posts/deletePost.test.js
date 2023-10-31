require("dotenv").config();
const chai = require("chai");
const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const { authenticate } = require("../../../middleware/authenticate");
const PostModel = require("../../../models/posts-model");
const { deletePost } = require("../../../controller/blog-controller");

const jwtSecret = process.env.JWT_SECRET;

const app = express();
const expect = chai.expect;
app.use(express.json());
app.use("/posts/:postId", authenticate, deletePost)

const testToken = jwt.sign({ userId: "testUserId" }, jwtSecret);

describe("Delete Post", () => {
  it("should delete a post", (done) => {
    const testPost = { _id: "testPostId" };

    // Mock the PostModel.findByIdAndDelete function to return the test post
    PostModel.findByIdAndDelete = async (postId) => {
      expect(postId).to.equal("testPostId");
      return testPost;
    };

    request(app)
      .delete("/posts/testPostId")
      .set("x-access-token", testToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal("Post deleted successfully.");

        done();
      });
  });

  it("should return 403 status on missing token", function (done) {
    request(app)
      .delete("/posts/testPostId")
      .expect(403, done);
  });

  it("should handle a not-found post", (done) => {
    // Mock the PostModel.findByIdAndDelete function to return null (post not found)
    PostModel.findByIdAndDelete = async () => null;

    request(app)
      .delete("/posts/nonexistentPostId")
      .set("x-access-token", testToken)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("No post found");

        done();
      });
  });

  it("should handle internal server error", (done) => {
    // Mock the PostModel.findByIdAndDelete function to throw an error
    PostModel.findByIdAndDelete = async () => {
      throw new Error("Internal Server Error");
    };

    request(app)
      .delete("/posts/testPostId")
      .set("x-access-token", testToken)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("Internal Server Error");

        done();
      });
  });
});
