const { expect } = require("chai");

const UserModel = require("../../../models/users-model");
const { registration } = require("../../../controller/users-controller");

describe("User Registration", () => {
  it("should register a user with valid input", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      },
    };

    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).to.equal(201);
          expect(data.success).to.be.true;
          expect(data.message).to.equal("Users successfully registered.");
        },
      }),
    };

    UserModel.create = async () => Promise.resolve();

    await registration(req, res);
  });

  it("should handle validation errors", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "invalid-email",
        password: "short",
      },
    };

    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).to.equal(400);
          expect(data.success).to.be.false;
          expect(data.message).to.equal("Validation errors");
          expect(data.errors).to.deep.equal({
            email: "Invalid email address",
            password: "Password must be at least 8 characters",
          });
        },
      }),
    };

    await registration(req, res);
  });

  it("should handle duplicate email error", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "duplicate@example.com",
        password: "password123",
      },
    };

    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).to.equal(400);
          expect(data.success).to.be.false;
          expect(data.message).to.equal("email already exists.");
        },
      }),
    };

    // Mock the UserModel.create function to throw a duplicate error
    UserModel.create = async () => {
      throw { code: 11000, keyPattern: { email: 1 } };
    };

    await registration(req, res);
  });

  it("should handle internal server error", async () => {
    const req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      },
    };

    const res = {
      status: (code) => ({
        json: (data) => {
          expect(code).to.equal(500);
          expect(data.success).to.be.false;
          expect(data.message).to.equal(
            "Failed to register, Internal Server Error"
          );
        },
      }),
    };

    // Mock the UserModel.create function to throw an unexpected error
    UserModel.create = async () => {
      throw new Error("Internal Server Error");
    };

    await registration(req, res);
  });
});
