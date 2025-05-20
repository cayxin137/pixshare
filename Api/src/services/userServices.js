const { Op, where } = require("sequelize");
const db = require("../models");
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const handleUserLogin = (userLogin, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(userLogin);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['id', 'email', 'number', 'username', 'password_hash'],
                    where: {
                        [Op.or]: [{ email: userLogin }, { number: userLogin }, { username: userLogin }],
                    },
                    raw: true
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password_hash);

                    if (check) {
                        userData.errCode = 0;
                        userData.message = 'oke';

                        delete user.password_hash;

                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.message = "Mật khẩu của bạn bị sai";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errCode = "User not found"
                }
            } else {
                userData.errCode = 1;
                userData.message = 'Tài khoản của bạn bị sai';

            }
            resolve(userData)
        } catch (e) {
            reject(e);
        }
    })
}

const comparePassword = (password) => {
    return new Promise((resolve, reject) => {
        try {

        } catch (e) {
            reject(e);
        }
    })
}

const checkUserEmail = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    [Op.or]: [{ email: userLogin }, { number: userLogin }, { username: userLogin }],
                },
            });
            if (user) {
                resolve(true)
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

const checkUserUsername = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    [Op.or]: [{ username: username }]
                },
            });
            if (user) {
                resolve(true)
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

const getAllUsers = (userID) => {
    return new Promise(async (resolve, reject) => {
        try {

            let users = '';
            if (userID === 'ALL') {
                users = db.User.findAll({
                    attributes: {
                        exclude: ['password_hash']
                    }
                })
            } if (userID && userID !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userID }
                })
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

const getRecommendUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = db.User.findAll({
                attributes: {
                    exclude: ['password_hash']
                }
            })
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}


const getUserByUsername = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findOne({
                where: { username: username }
            })
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

const createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkEmail = await checkUserEmail(data.email);
            let checkUsername = await checkUserUsername(data.username)
            if (checkEmail === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email đã được sử dụng'
                })

            } else if (checkUsername === true) {
                resolve({
                    errCode: 2,
                    errMessage: 'Tên tài khoản đã tồn tại'
                })
            }
            else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    username: data.username,
                    full_name: data.fullname,
                    password_hash: hashPasswordFromBcrypt
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Tạo tài khoản thành công'
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

const searchUser = (search) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                where: {
                    [Op.or]: [
                        { username: { [Op.like]: `%${search}%` } },
                        { full_name: { [Op.like]: `%${search}%` } },
                    ]
                }
            })
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

const editUser = (userId, userData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let updatedUser = await db.User.update(userData, {
                where: {
                    id: userId
                }
            });
            resolve(updatedUser);
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    getUserByUsername: getUserByUsername,
    searchUser: searchUser,
    editUser: editUser,
    getRecommendUsers: getRecommendUsers
}