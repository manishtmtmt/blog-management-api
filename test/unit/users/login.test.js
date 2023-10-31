const { expect } = require("chai");
const bcrypt = require("bcryptjs");

const UserModel = require("../../../models/users-model");
const { login } = require("../../../controller/users-controller");

describe("User Login", () => {
  it("should successfully log in with valid credentials", async () => {
    const req = {
      body: {
        username: "testuser",
        password: "password123",
      },
    };

    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).to.equal(200);
          expect(data.success).to.be.true;
          expect(data.message).to.equal("Login Successful!");
          expect(data).to.have.property("token");
          expect(data).to.have.property("userId");
        },
      }),
    };

    // Mock the UserModel.findOne function to return a user
    UserModel.findOne = async () => ({
      _id: "user_id",
      username: "testuser",
      password: bcrypt.hashSync("password123", 10), // Mock the hashed password
    });

    await login(req, res);
  });

  it("should handle missing username and password", async () => {
    const req = {
      body: {},
    };

    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).to.equal(400);
          expect(data.success).to.be.false;
          expect(data.message).to.equal("Username and password are required.");
        },
      }),
    };

    await login(req, res);
  });

  it("should handle invalid credentials", async () => {
    const req = {
      body: {
        username: "testuser",
        password: "invalidpassword",
      },
    };

    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).to.equal(404);
          expect(data.success).to.be.false;
          expect(data.message).to.equal("Invalid Credentials");
        },
      }),
    };

    // Mock the UserModel.findOne function to return null (user not found)
    UserModel.findOne = async () => null;

    await login(req, res);
  });

  it("should handle invalid password", async () => {
    const req = {
      body: {
        username: "testuser",
        password: "incorrectpassword",
      },
    };

    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).to.equal(404);
          expect(data.success).to.be.false;
          expect(data.message).to.equal("Invalid Credentials");
        },
      }),
    };

    // Mock the UserModel.findOne function to return a user with a different password
    UserModel.findOne = async () => ({
      _id: "user_id",
      username: "testuser",
      password: bcrypt.hashSync("correctpassword", 10), // Mock a different hashed password
    });

    await login(req, res);
  });

  it("should handle internal server error", async () => {
    const req = {
      body: {
        username: "testuser",
        password: "password123",
      },
    };

    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).to.equal(500);
          expect(data.success).to.be.false;
          expect(data.message).to.equal(
            "Failed to login, Internal Server Error"
          );
        },
      }),
    };

    // Mock the UserModel.findOne function to throw an error
    UserModel.findOne = async () => {
      throw new Error("Internal Server Error");
    };

    await login(req, res);
  });
});
