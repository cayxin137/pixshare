import express from "express";
import userController from "../controllers/userController";

let router = express.Router();

let userRoute = (app) => {
    router.get('/api/get_recommend_user', userController.handleGetReommendUser);
    router.post('/api/login', userController.handleLogin);
    router.post('/api/get_all_user', userController.handleGetAllUsers);
    router.post('/api/get_user_by_username', userController.handleGetUserByUsername);
    router.post('/api/register', userController.handleCreateNewUser);
    router.post('/api/search', userController.handleSearchUser);
    router.put('/api/edit_user', userController.handleEditUser);

    return app.use("/", router);
}

module.exports = userRoute;