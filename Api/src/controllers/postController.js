const db = require("../models");
const postServices = require("../services/postServices");

let handleGetAllPosts = async (req, res) => {
    let posts = await postServices.getAllPost();
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        posts
    })
}

let handlePostById = async (req, res) => {
    let postId = req.params.id;
    let post = await postServices.getPostById(postId);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        post
    })
}

let handleCreatePost = async (req, res) => {
    let userId = req.body.userId;
    let caption = req.body.caption;
    let imageUrl = req.body.imageUrl;
    if (!userId || !caption || !imageUrl) {
        return res.status(403).json({
            errCode: 1,
            message: "Thiếu thông tin"
        })
    }
    let post = await postServices.createPost(userId, caption, imageUrl);
    return res.status(200).json({
        errCode: 0,
        message: post.message,
        post: post ? post.post : {}
    })
}

module.exports = {
    handleGetAllPosts: handleGetAllPosts,
    handlePostById: handlePostById,
    handleCreatePost: handleCreatePost
}