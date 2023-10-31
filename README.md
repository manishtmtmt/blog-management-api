# Blog Management Backend Service

This Node.js project is a backend service for a Blog Management Platform, providing essential functionalities for user management and blog post management. It utilizes Express.js, Bcryptjs, Jsonwebtoken, and Mongoose for efficient development.

Base url: https://blog-management-api-nwkl.onrender.com/

## Functionalities

#### 1. User Management:

- Sign up a new account
- Sign in with username and password
- Get specific user details

#### 2. Blog Post Management:

- Create a new blog post
- Get all blog posts
- Get a specific blog post
- Update a specific blog post
- Delete a specific blog post

## API Endpoints

#### User Management

| Methods | Urls                | Actions                               |
| ------- | ------------------- | ------------------------------------- |
| POST    | /api/auth/sign-up   | Sign up a new user account.           |
| POST    | /api/auth/sign-in:  | Sign in with a username and password. |
| GET     | /api/auth/{userId}: | Get specific user details.            |

#### Blog Post Management

| Methods | Urls                 | Actions                      |
| ------- | -------------------- | ---------------------------- |
| POST    | /api/posts:          | Create a new blog post.      |
| GET     | /api/posts:          | Get all blog posts.          |
| GET     | /api/posts/{postId}: | Get a specific blog post.    |
| PATCH   | /api/posts/{postId}: | Update a specific blog post. |
| DELETE  | /api/posts/{postId}: | Delete a specific blog post. |

## Technology Stack

- Express.js: A web application framework for Node.js.
- Bcryptjs: A library for hashing and salting passwords.
- Jsonwebtoken: A library for creating JSON Web Tokens for user authentication.
- Mongoose: An ODM (Object Data Modeling) library for MongoDB.

## How to Run

Follow these steps to run the project locally:

#### 1. Clone this repository.

```bash
git clone https://github.com/manishtmtmt/blog-management-api.git
```
#### 2. Navigate to the project folder using your command line interface.

```bash
cd blog-management-api
```

#### 3. Install the project dependencies by running the following command:

```bash
npm install
```

#### 4. Start the development server with:

```bash
npm run dev
```
## Documentation

The project is documented with Swagger, providing detailed information about the available endpoints and their usage. You can access the Swagger documentation by visiting `/api-docs` when the server is running.

Additionally, a Postman collection is provided, allowing you to test the API endpoints easily.

## Using the Postman Collection

- Click [here](https://api.postman.com/collections/21798262-d12c3290-b7b4-444f-ad0f-367638562082?access_key=PMAT-01HE21GH9WKZXG831BGPW50CVK) to access the Postman collection.

1. Make sure you have [Postman](https://www.postman.com/) installed and registered.
2. Click the Postman collection link above to open it in Postman.
3. In Postman, click the "Import" button to add the collection to your workspace.

#### Signup a new user account [POST - /api/auth/sign-up]

![Screenshot (73)](https://github.com/manishtmtmt/pesto/assets/46663132/a1e29c53-0a8a-48ff-9956-c63b74ed49a0)

#### Sign in with a username and password [POST - /api/auth/login]

![Screenshot (76)](https://github.com/manishtmtmt/pesto/assets/46663132/7f869828-e6f5-48dc-ae3f-0db7a86d4b72)

#### Get specific user details [GET - /api/auth/{userID}]

![Screenshot (79)](https://github.com/manishtmtmt/pesto/assets/46663132/0cbfef20-3c63-49c2-b7ae-9120c407123b)

#### Create a new blog post [POST - /api/posts]

![Screenshot (81)](https://github.com/manishtmtmt/pesto/assets/46663132/9aa3db5d-17fc-4701-9fae-9f9579d449cc)

#### Get all blog posts [GET - /api/posts]

![Screenshot (84)](https://github.com/manishtmtmt/pesto/assets/46663132/ef138e4b-6120-4688-aa5a-7df9442b1941)

#### Get specific blog post [GET - /api/post/{postId}]

![Screenshot (85)](https://github.com/manishtmtmt/pesto/assets/46663132/befd0c29-f0f2-46ca-bb95-20a2463c183a)

#### Update a specific blog post [PATCH - /api/posts/{postId}]

![Screenshot (88)](https://github.com/manishtmtmt/pesto/assets/46663132/5c0c19b3-24b3-4e90-9c72-8cb466c811a3)

#### Delete a specific blog post [DELETE - /api/posts/{postId}]

![Screenshot (89)](https://github.com/manishtmtmt/pesto/assets/46663132/150705b1-b525-4135-b975-eac53c78ab14)

## Endpoint Usage

For detailed usage and examples of each API endpoint, please refer to the Swagger documentation or the Postman collection provided with this project.
