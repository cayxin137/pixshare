const db = require("../models");
const userServices = require("../services/userServices");


let handleLogin = async (req, res) => {
    let userLogin = req.body.userLogin;
    let number = req.body.number;
    let password = req.body.password;

    if (!userLogin || !password) {
        return res.status(401).json({
            errCode: 1,
            message: 'Vui lòng điền đầy đủ thông tin đăng nhập'
        })
    }

    let userData = await userServices.handleUserLogin(userLogin, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.message,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.body.id;
    if (!id) {
        return res.status(403).json({
            errCode: 1,
            errMessage: 'Thiếu id',
            users: []
        })
    }
    let users = await userServices.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })
}


let handleGetReommendUser = async (req, res) => {
    let users = await userServices.getRecommendUsers();
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })
}


let handleGetUserByUsername = async (req, res) => {
    let username = req.body.username;
    if (!username) {
        return res.status(403).json({
            errCode: 1,
            errMessage: 'Thiếu username',
            users: []
        })
    }
    let users = await userServices.getUserByUsername(username);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userServices.createNewUser(req.body);
    return res.status(200).json(message);
}

let handleSearchUser = async (req, res) => {
    let search = req.body.search;
    if (!search) {
        return res.status(403).json({
            errCode: 1,
            errMessage: 'Thiếu search',
            users: []
        })
    }
    let users = await userServices.searchUser(search);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })
}

let handleEditUser = async (req, res) => {
    const { userId, username, email, bio, profileImage } = req.body;

    console.log(req.body)

    try {
        let updatedUser = await userServices.editUser(userId, {
            username: username,
            email: email,
            bio: bio,
            profile_picture_url: profileImage
        });

        return res.status(200).json({
            errCode: 0,
            errMessage: 'User updated successfully',
            updatedUser
        });
    } catch (e) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Error updating user',
            error: e.message
        });
    }
};
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleGetUserByUsername: handleGetUserByUsername,
    handleSearchUser: handleSearchUser,
    handleEditUser: handleEditUser,
    handleGetReommendUser: handleGetReommendUser
}