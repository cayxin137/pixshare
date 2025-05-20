const db = require("../models");
const likeServices = require("../services/likeServices");


let handleGetLikeFromPost = async (req, res) => {
    let postId = req.body.postId;
    let likes = await likeServices.getLikeFromPost(postId);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        likes
    })
}

let handleAddLike = async (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;
    if (!postId || !userId) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu Id"
        })
    }
    let like = await likeServices.addLike(postId, userId);
    return res.status(200).json({
        like
    })
}


let handleDeleteLike = async (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;
    if (!postId || !userId) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu Id"
        })
    }
    let like = await likeServices.deleteLike(postId, userId);
    return res.status(200).json({
        like
    })
}

let handlecheckLike = async (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;
    if (!postId || !userId) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu Id"
        })
    }
    let like = await likeServices.checkLike(postId, userId);
    return res.status(200).json({
        like
    })
}

let handleUserLike = async (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;
    if (!postId || !userId) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu Id"
        })
    }
    let like = await likeServices.userLike(postId, userId);
    return res.status(200).json({
        like
    })
}


module.exports = {
    handlecheckLike: handlecheckLike,
    handleGetLikeFromPost: handleGetLikeFromPost,
    handleAddLike: handleAddLike,
    handleDeleteLike: handleDeleteLike,
    handleUserLike: handleUserLike
}