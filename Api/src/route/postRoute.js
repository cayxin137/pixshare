import express from "express";
import postController from "../controllers/postController";

let router = express.Router();

let postRoute = (app) => {

    router.get('/api/post', postController.handleGetAllPosts);
    router.get('/api/post/:id', postController.handlePostById);
    router.post('/api/create-post', postController.handleCreatePost);

    return app.use("/", router);
}

module.exports = postRoute;