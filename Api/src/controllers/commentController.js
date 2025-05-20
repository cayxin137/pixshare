const db = require("../models");
const commentServices = require("../services/commentServices");


let handleGetCommentFromPost = async (req, res) => {
    let postId = req.body.postId;
    let comments = await commentServices.getCommentFromPost(postId);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        comments
    })
}

let handleAddComment = async (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;
    let caption = req.body.caption;
    console.log(postId, userId, caption)
    if (!postId || !userId || !caption) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu thong tin"
        })
    }
    let comment = await commentServices.addComment(postId, userId, caption);
    return res.status(200).json({
        comment
    })
}


module.exports = {
    handleGetCommentFromPost: handleGetCommentFromPost,
    handleAddComment: handleAddComment
}