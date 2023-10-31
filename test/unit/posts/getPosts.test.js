require("dotenv").config();
const chai = require("chai");
const express = require("express");
const request = require("supertest");

const PostModel = require("../../../models/posts-model");
const { getAllPosts } = require("../../../controller/blog-controller");

const app = express();
const expect = chai.expect;
app.use(express.json());
app.use("/posts", getAllPosts);

describe("Get All Posts", () => {
  it("should return all posts", (done) => {
    const testPosts = [
      { title: "Post 1", description: "Description 1", category: "Category 1" },
      { title: "Post 2", description: "Description 2", category: "Category 2" },
    ];

    // Mock the PostModel.find function
    PostModel.find = async () => testPosts;

    request(app)
      .get("/posts")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).to.be.true;
        expect(res.body.posts).to.deep.equal(testPosts);

        done();
      });
  });

  it("should handle internal server error", (done) => {
    // Mock the PostModel.find function to throw an error
    PostModel.find = async () => {
      throw new Error("Internal Server Error");
    };

    request(app)
      .get("/posts")
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("Internal Server Error");

        done();
      });
  });
});
