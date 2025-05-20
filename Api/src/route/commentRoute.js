import express from "express";
import commentController from "../controllers/commentController";

let router = express.Router();

let commentRoute = (app) => {
    router.post('/api/comment', commentController.handleGetCommentFromPost);
    router.post('/api/add-comment', commentController.handleAddComment);
    return app.use("/", router);
}

module.exports = commentRoute;