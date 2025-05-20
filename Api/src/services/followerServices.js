const { Op, where } = require("sequelize");
const db = require("../models");

const followUser = (userId, followerUserId) => {
    return new Promise(async (resolve, reject) => {
        try {

            await db.Follower.create({
                user_id: userId,
                follower_user_id: followerUserId
            });

            let follower = await db.Follower.findOne({
                where: {
                    user_id: userId,
                    follower_user_id: followerUserId
                },
            });
            resolve({
                follower,
                errCode: 0,
                errMessage: 'Tạo follower thành công'
            });


        } catch (e) {
            reject(e);
        }
    })
}

const unfollowUser = (userId, followerUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Follower.destroy({
                where: {
                    user_id: userId,
                    follower_user_id: followerUserId
                },

            });
            resolve({
                errCode: 0,
                message: 'Unfollow'
            })

        } catch (e) {
            reject(e);
        }
    })
}

const getFollower = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let followers = await db.Follower.findAll({
                where: {
                    user_id: userId
                },
                include: { model: db.User, attributes: ["username", "profile_picture_url", "full_name"] }
            });

            resolve(followers);
        } catch (e) {
            reject(e);
        }
    })
}

const getFollowing = (followerUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let followers = await db.Follower.findAll({
                where: {
                    follower_user_id: followerUserId
                },
                include: { model: db.User, attributes: ["username", "profile_picture_url", "full_name"] }
            });

            resolve(followers);
        } catch (e) {
            reject(e);
        }
    })
}

const checkFollower = (userId, followerUserId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let follower = await db.Follower.findOne({
                where: {
                    user_id: userId,
                    follower_user_id: followerUserId
                },
            });
            if (follower) {
                resolve(true)
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    followUser: followUser,
    getFollower: getFollower,
    getFollowing: getFollowing,
    checkFollower: checkFollower,
    unfollowUser: unfollowUser
}