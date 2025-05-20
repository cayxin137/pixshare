import express from "express";
import storeController from "../controllers/storeController";

let router = express.Router();

let storeRoute = (app) => {

    router.post('/api/store-user', storeController.handleGetStoreFromUser);
    router.post('/api/store', storeController.handleGetStoreFromPost);
    router.post('/api/check-store', storeController.handlecheckStore);
    router.post('/api/create-store', storeController.handleAddStore);
    router.delete('/api/delete-store', storeController.handleDeleteStore);

    return app.use("/", router);
}

module.exports = storeRoute;