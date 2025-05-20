const { Op, where } = require("sequelize");
const db = require("../models");

const getStoreFromPost = (postId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let storeCount = await db.Store.count({
                where: {
                    post_id: postId
                }
            });
            let stores = [];
            if (storeCount > 0) {
                stores = await db.Store.findAll({
                    where: {
                        post_id: postId
                    },
                });
            }
            resolve(stores);
        } catch (e) {
            reject(e);
        }
    })
}


const getStoreFromUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let storeCount = await db.Store.count({
                where: {
                    user_id: userId
                }
            });
            let stores = [];
            if (storeCount > 0) {
                stores = await db.Store.findAll({
                    where: {
                        user_id: userId
                    },
                    include: [
                        {
                            model: db.Post,
                            attributes: ["caption", "image_url"],
                            include: [
                                {
                                    model: db.User,
                                    attributes: ["username", "profile_picture_url"]
                                }
                            ]
                        },
                    ]
                });
            }
            resolve(stores);
        } catch (e) {
            reject(e);
        }
    })
}

const checkStore = (postId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let store = await db.Store.findOne({
                where: {
                    post_id: postId,
                    user_id: userId
                },
            });
            if (store) {
                resolve(true)
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

const addStore = (postId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            await db.Store.create({
                post_id: postId,
                user_id: userId
            });
            let store = await db.Store.findOne({
                where: {
                    post_id: postId,
                    user_id: userId
                },
            });
            resolve({
                store,
                errCode: 0,
                errMessage: 'Tạo store thành công'
            });


        } catch (e) {
            reject(e);
        }
    })
}

const deleteStore = (postId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Store.destroy({
                where: {
                    post_id: postId,
                    user_id: userId
                },

            });
            resolve({
                errCode: 0,
                message: 'Delete Store'
            })

        } catch (e) {
            reject(e);
        }
    })
}



module.exports = {
    getStoreFromPost: getStoreFromPost,
    getStoreFromUser: getStoreFromUser,
    checkStore: checkStore,
    addStore: addStore,
    deleteStore: deleteStore,
}