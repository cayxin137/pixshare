const db = require("../models");
const storeServices = require("../services/storeServices");

let handleGetStoreFromPost = async (req, res) => {
    let postId = req.body.postId;
    let stores = await storeServices.getStoreFromPost(postId);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        stores
    })
}


let handleGetStoreFromUser = async (req, res) => {
    let userId = req.body.userId;
    let stores = await storeServices.getStoreFromUser(userId);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        stores
    })
}

let handleAddStore = async (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;
    if (!postId || !userId) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu Id"
        })
    }
    let store = await storeServices.addStore(postId, userId);
    return res.status(200).json({
        store
    })
}


let handleDeleteStore = async (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;
    if (!postId || !userId) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu Id"
        })
    }
    let store = await storeServices.deleteStore(postId, userId);
    return res.status(200).json({
        store
    })
}

let handlecheckStore = async (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;
    if (!postId || !userId) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu Id"
        })
    }
    let store = await storeServices.checkStore(postId, userId);
    return res.status(200).json({
        store
    })
}


module.exports = {
    handleGetStoreFromPost: handleGetStoreFromPost,
    handlecheckStore: handlecheckStore,
    handleGetStoreFromUser: handleGetStoreFromUser,
    handleAddStore: handleAddStore,
    handleDeleteStore: handleDeleteStore,
}