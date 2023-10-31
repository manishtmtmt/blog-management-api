require("dotenv").config();
const chai = require("chai");
const express = require("express");
const request = require("supertest");

const PostModel = require("../../../models/posts-model");
const { getSpecificPost } = require("../../../controller/blog-controller");

const app = express();
const expect = chai.expect;
app.use(express.json());
app.use("/posts/:postId", getSpecificPost)

describe("Get Specific Post", () => {
  it("should return a specific post", (done) => {
    const testPost = {
      _id: "testPostId",
      title: "Test Post",
      description: "Test Description",
      category: "Category"
    };

    // Mock the PostModel.findById function
    PostModel.findById = async (postId) => {
      expect(postId).to.equal("testPostId");
      return testPost;
    };

    request(app)
      .get("/posts/testPostId")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).to.be.true;
        expect(res.body.post).to.deep.equal(testPost);

        done();
      });
  });

  it("should handle a not-found post", (done) => {
    // Mock the PostModel.findById function to return null (post not found)
    PostModel.findById = async () => null;

    request(app)
      .get("/posts/nonexistentPostId")
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
      .get("/posts/testPostId")
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("Internal Server Error");

        done();
      });
  });
});
