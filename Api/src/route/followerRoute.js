import express from "express";
import followerController from "../controllers/followerController";

let router = express.Router();

let followerRoute = (app) => {
    router.post('/api/follow-user', followerController.handleFollowUser);
    router.post('/api/unfollow-user', followerController.handleUnfollowUser);
    router.post('/api/get-follower', followerController.handleGetFollower);
    router.post('/api/get-following', followerController.handleGetFollowing);
    router.post('/api/check-follower', followerController.handlecheckFollower);
    return app.use("/", router);
}

module.exports = followerRoute;