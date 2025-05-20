import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCrudPage);


    router.post('/api/login', userController.handleLogin);

    router.get('/api/get_all_user', userController.handleGetAllUsers);
    router.post('/api/register', userController.handleCreateNewUser);

    return app.use("/", router);
}

module.exports = initWebRoutes;