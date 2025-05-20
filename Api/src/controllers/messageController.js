const db = require("../models");
const messageServices = require("../services/messageServices");


let handleGetMessages = async (req, res) => {
    let receiverId = req.body.receiverId;
    let senderId = req.body.senderId;
    let messages = await messageServices.getMessages(receiverId, senderId);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        messages
    })
}

let handleGetAllMessages = async (req, res) => {
    let messages = await messageServices.getAllMessages();
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        messages
    })
}

let handleAddMessage = async (req, res) => {
    let receiverId = req.body.receiverId;
    let senderId = req.body.senderId;
    let messageText = req.body.messageText;
    if (!receiverId || !senderId || !messageText) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu thong tin"
        })
    }
    let message = await messageServices.addMessage(receiverId, senderId, messageText);
    return res.status(200).json({
        message
    })
}

let handleAddMessagePicture = async (req, res) => {
    let receiverId = req.body.receiverId;
    let senderId = req.body.senderId;
    let messageText = req.body.messageText;
    let messagePicture = req.body.messagePicture;
    if (!receiverId || !senderId || !messageText || !messagePicture) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu thong tin"
        })
    }
    let message = await messageServices.addMessagePicture(receiverId, senderId, messageText, messagePicture);
    return res.status(200).json({
        message
    })
}



module.exports = {
    handleGetMessages: handleGetMessages,
    handleGetAllMessages: handleGetAllMessages,
    handleAddMessage: handleAddMessage,
    handleAddMessagePicture: handleAddMessagePicture
}