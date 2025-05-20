const { Op, where } = require("sequelize");
const db = require("../models");

const getLikeFromPost = (postId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let likeCount = await db.Like.count({
                where: {
                    post_id: postId
                }
            });
            let likes = [];
            if (likeCount > 0) {
                likes = await db.Like.findAll({
                    where: {
                        post_id: postId
                    },
                    include: { model: db.User, attributes: ["username", "profile_picture_url", "full_name"] }
                });
            }
            resolve(likes);
        } catch (e) {
            reject(e);
        }
    })
}

const checkLike = (postId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let like = await db.Like.findOne({
                where: {
                    post_id: postId,
                    user_id: userId
                },
            });
            if (like) {
                resolve(true)
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

const addLike = (postId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            await db.Like.create({
                post_id: postId,
                user_id: userId
            });
            let like = await db.Like.findOne({
                where: {
                    post_id: postId,
                    user_id: userId
                },
                include: { model: db.User, attributes: ["username", "profile_picture_url", "full_name"] }
            });
            resolve({
                like,
                errCode: 0,
                errMessage: 'Tạo like thành công'
            });


        } catch (e) {
            reject(e);
        }
    })
}

const deleteLike = (postId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Like.destroy({
                where: {
                    post_id: postId,
                    user_id: userId
                },

            });
            resolve({
                errCode: 0,
                message: 'Delete like'
            })

        } catch (e) {
            reject(e);
        }
    })
}

const userLike = (postId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let like = await db.Like.findOne({
                where: {
                    post_id: postId,
                    user_id: userId
                },

            });
            resolve({
                errCode: 0,
                message: 'success',
                like
            })

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getLikeFromPost: getLikeFromPost,
    checkLike: checkLike,
    addLike: addLike,
    deleteLike: deleteLike,
    userLike: userLike
}