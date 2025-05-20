const db = require("../models");
const followerServices = require("../services/followerServices");

let handleFollowUser = async (req, res) => {
    let userId = req.body.userId;
    let followerUserId = req.body.followerUserId;

    if (!userId || !followerUserId) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu thong tin"
        })
    }
    let follower = await followerServices.followUser(userId, followerUserId);
    return res.status(200).json({
        follower
    })
}

let handleUnfollowUser = async (req, res) => {
    let userId = req.body.userId;
    let followerUserId = req.body.followerUserId;

    if (!userId || !followerUserId) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu thong tin"
        })
    }
    let follower = await followerServices.unfollowUser(userId, followerUserId);
    return res.status(200).json({
        follower
    })
}

let handleGetFollower = async (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu Id"
        })
    }
    let followers = await followerServices.getFollower(userId);
    return res.status(200).json({
        followers
    })
}

let handleGetFollowing = async (req, res) => {
    let followerUserId = req.body.followerUserId;
    if (!followerUserId) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu Id"
        })
    }
    let followers = await followerServices.getFollowing(followerUserId);
    return res.status(200).json({
        followers
    })
}

let handlecheckFollower = async (req, res) => {
    let userId = req.body.userId;
    let followerUserId = req.body.followerUserId
    if (!userId || !followerUserId) {
        return res.status(403).json({
            errCode: 1,
            message: "Thieu Id"
        })
    }
    let follow = await followerServices.checkFollower(userId, followerUserId);
    return res.status(200).json({
        follow
    })
}

module.exports = {
    handleFollowUser: handleFollowUser,
    handleGetFollower: handleGetFollower,
    handleGetFollowing: handleGetFollowing,
    handlecheckFollower: handlecheckFollower,
    handleUnfollowUser: handleUnfollowUser
}