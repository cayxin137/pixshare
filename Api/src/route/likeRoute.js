import express from "express";
import likeController from "../controllers/likeController";

let router = express.Router();

let likeRoute = (app) => {

    router.post('/api/like', likeController.handleGetLikeFromPost);
    router.post('/api/check-like', likeController.handlecheckLike);
    router.post('/api/user-like', likeController.handleUserLike);
    router.post('/api/create-like', likeController.handleAddLike);
    router.delete('/api/delete-like', likeController.handleDeleteLike);

    return app.use("/", router);
}

module.exports = likeRoute;