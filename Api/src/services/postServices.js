const { Op, where } = require("sequelize");
const db = require("../models");

const getAllPost = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let posts = await db.Post.findAll({
                include: { model: db.User, attributes: ["username", "profile_picture_url"] }
            });
            resolve(posts);
        } catch (e) {
            reject(e);
        }
    })
}

const getPostById = (postId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let posts = await db.Post.findOne({
                where: {
                    id: postId
                },
                include: { model: db.User, attributes: ["full_name", "username", "profile_picture_url"] }
            });
            resolve(posts);
        } catch (e) {
            reject(e);
        }
    })
}

const createPost = (userId, caption, imageUrl) => {
    return new Promise(async (resolve, reject) => {
        try {

            await db.Post.create({
                user_id: userId,
                caption: caption,
                image_url: imageUrl
            });
            let post = await db.Post.findOne({
                where: {
                    user_id: userId,
                    caption: caption,
                    image_url: imageUrl
                },
            });
            resolve({
                post,
                errCode: 0,
                message: 'Tạo Post thành công'
            });


        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    getAllPost: getAllPost,
    getPostById: getPostById,
    createPost: createPost
}