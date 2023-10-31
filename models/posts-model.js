const { Schema, model, Types } = require("mongoose");

const PostsSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    createdBy: { type: Types.ObjectId, required: true },
    updatedBy: { type: Types.ObjectId },
  },
  { timestamps: true }
);

const PostModel = model("post", PostsSchema);

module.exports = PostModel;
