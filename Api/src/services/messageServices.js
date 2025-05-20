const { Op, where } = require("sequelize");
const db = require("../models");

const getAllMessages = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let messages = await db.Message.findAll({
                include: [
                    { model: db.User, attributes: ["id", "username", "profile_picture_url", "full_name"], as: 'Receiver' },
                    { model: db.User, attributes: ["id", "username", "profile_picture_url", "full_name"], as: 'Sender' },
                ]
            });
            resolve(messages);
        } catch (e) {
            reject(e);
        }
    })
}

const getMessages = (receiverId, senderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let messages = await db.Message.findAll({
                where: {
                    receiver_id: receiverId,
                    sender_id: senderId,
                },
                include: [
                    { model: db.User, attributes: ["username", "profile_picture_url", "full_name"], as: 'Receiver' },
                    { model: db.User, attributes: ["username", "profile_picture_url", "full_name"], as: 'Sender' },
                ]
            });
            resolve(messages);
        } catch (e) {
            reject(e);
        }
    })
}

const addMessage = (receiverId, senderId, messageText) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Message.create({
                receiver_id: receiverId,
                sender_id: senderId,
                message_text: messageText
            });

            let message = await db.Message.findOne({
                where: {
                    receiver_id: receiverId,
                    sender_id: senderId,
                    message_text: messageText
                },
                include: [
                    { model: db.User, attributes: ["username", "profile_picture_url", "full_name"], as: 'Receiver' },
                    { model: db.User, attributes: ["username", "profile_picture_url", "full_name"], as: 'Sender' },
                ]
            });
            resolve({
                message,
                errCode: 0,
                errMessage: 'Tạo message thành công'
            });

        } catch (e) {
            reject(e);
        }
    })
}

const addMessagePicture = (receiverId, senderId, messageText, messagePicture) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Message.create({
                receiver_id: receiverId,
                sender_id: senderId,
                message_text: messageText,
                message_picture: messagePicture
            });

            let message = await db.Message.findOne({
                where: {
                    receiver_id: receiverId,
                    sender_id: senderId,
                    message_text: messageText,
                    message_picture: messagePicture
                },
                include: [
                    { model: db.User, attributes: ["username", "profile_picture_url", "full_name"], as: 'Receiver' },
                    { model: db.User, attributes: ["username", "profile_picture_url", "full_name"], as: 'Sender' },
                ]
            });
            resolve({
                message,
                errCode: 0,
                errMessage: 'Tạo message thành công'
            });

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getMessages: getMessages,
    addMessage: addMessage,
    addMessagePicture: addMessagePicture,
    getAllMessages: getAllMessages
}