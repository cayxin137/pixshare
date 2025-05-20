import express from "express";
import messageController from "../controllers/messageController";

let router = express.Router();

let messageRoute = (app) => {
    router.post('/api/message', messageController.handleGetMessages);
    router.get('/api/allmessage', messageController.handleGetAllMessages);
    router.post('/api/add-message', messageController.handleAddMessage);
    router.post('/api/add-message-picture', messageController.handleAddMessagePicture);
    return app.use("/", router);
}

module.exports = messageRoute;