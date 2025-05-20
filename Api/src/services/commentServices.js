const { Op, where } = require("sequelize");
const db = require("../models");

const getCommentFromPost = (postId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let comments = await db.Comment.findAll({
                where: {
                    post_id: postId
                },
                include: { model: db.User, attributes: ["username", "profile_picture_url"] }
            });
            resolve(comments);
        } catch (e) {
            reject(e);
        }
    })
}

const addComment = (postId, userId, caption) => {
    return new Promise(async (resolve, reject) => {
        try {

            await db.Comment.create({
                post_id: postId,
                user_id: userId,
                comment_text: caption
            });

            let comment = await db.Comment.findOne({
                where: {
                    post_id: postId,
                    user_id: userId,
                    comment_text: caption
                },
                include: { model: db.User, attributes: ["username", "profile_picture_url", "full_name"] }
            });
            resolve({
                comment,
                errCode: 0,
                errMessage: 'Tạo like thành công'
            });

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getCommentFromPost: getCommentFromPost,
    addComment: addComment
}