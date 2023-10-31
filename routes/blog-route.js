const { Router } = require("express");

const {
  createPost,
  getAllPosts,
  getSpecificPost,
  updatePost,
  deletePost,
} = require("../controller/blog-controller");
const { authenticate } = require("../middleware/authenticate");
const { limit } = require("../middleware/api-limit");

const router = Router();

/**
 * @swagger
 * definitions:
 *   Post:
 *     type: object
 *     properties:
 *       _id:
 *          type: string
 *          description: The id of the blog post.
 *       title:
 *         type: string
 *         description: The title of the blog post.
 *       description:
 *         type: string
 *         description: The description of the blog post.
 *       category:
 *         type: string
 *         description: The category of the blog post.
 *       createdBy:
 *         type: string
 *         description: The ID of the user who created the post.
 *       updatedBy:
 *         type: string
 *         description: The ID of the user who last updated the post.
 *       createdAt:
 *          type: string
 *          description: The creation date of the blog post.
 *       updatedAt:
 *          type: string
 *          description: The updation date of the blog post.
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new blog post
 *     description: Create a new blog post with authentication.
 *     tags:
 *       - Blog Posts
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog post.
 *               description:
 *                 type: string
 *                 description: The description of the blog post.
 *               category:
 *                 type: string
 *                 description: The category of the blog post.
 *     responses:
 *       201:
 *         description: Blog post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful.
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 post:
 *                   $ref: '#/definitions/Post'  # Reference to the Post schema
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that the request is unauthorized.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating unauthorized access.
 *       403:
 *         description: Forbidden. No token provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that no token was provided.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating the absence of a token.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates an internal server error.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating an internal server error.
 */
router.post("/", authenticate, limit, createPost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all blog posts
 *     description: Retrieve a list of all blog posts.
 *     tags:
 *       - Blog Posts
 *     responses:
 *       200:
 *         description: List of blog posts retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful.
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Post'  # Reference to the Post schema
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates an internal server error.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating an internal server error.
 */
router.get("/", getAllPosts);

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get a specific blog post by ID
 *     description: Retrieve a specific blog post by its ID.
 *     tags:
 *       - Blog Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         type: string
 *         description: The ID of the blog post to retrieve.
 *     responses:
 *       200:
 *         description: Blog post retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful.
 *                 post:
 *                   $ref: '#/definitions/Post'  # Reference to the Post schema
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       404:
 *         description: Blog post not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that the post was not found.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the post was not found.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates an internal server error.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating an internal server error.
 */
router.get("/:postId", getSpecificPost);

/**
 * @swagger
 * /api/posts/{postId}:
 *   patch:
 *     summary: Update a specific blog post by ID
 *     description: Update a specific blog post identified by its ID.
 *     tags:
 *       - Blog Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         type: string
 *         description: The ID of the blog post to update.
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authentication.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the blog post.
 *               description:
 *                 type: string
 *                 description: The updated description of the blog post.
 *               category:
 *                 type: string
 *                 description: The updated category of the blog post.
 *     responses:
 *       201:
 *         description: Blog post updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful.
 *                 message:
 *                   type: string
 *                   description: A success message indicating the post was updated successfully.
 *                 post:
 *                   $ref: '#/definitions/Post'  # Reference to the Post schema
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that the request is unauthorized.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating unauthorized access.
 *       403:
 *         description: Forbidden. No token provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that no token was provided.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating the absence of a token.
 *       404:
 *         description: Blog post not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that the post was not found.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the post was not found.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates an internal server error.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating an internal server error.
 */
router.patch("/:postId", authenticate, limit, updatePost);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a specific blog post by ID
 *     description: Delete a specific blog post identified by its ID.
 *     tags:
 *       - Blog Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         type: string
 *         description: The ID of the blog post to delete.
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authentication.
 *     responses:
 *       200:
 *         description: Blog post deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the operation was successful.
 *                 message:
 *                   type: string
 *                   description: A success message indicating the post was deleted successfully.
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized. Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that the request is unauthorized.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating unauthorized access.
 *       403:
 *         description: Forbidden. No token provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that no token was provided.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating the absence of a token.
 *       404:
 *         description: Blog post not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that the post was not found.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating that the post was not found.
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates an internal server error.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: An error message indicating an internal server error.
 */
router.delete("/:postId", authenticate, deletePost);

module.exports = router;
