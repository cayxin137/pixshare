import axios from 'axios'

let URL = process.env.REACT_APP_BACKEND_URL;

const handleLogin = (userLogin, password) => {
    return axios.post(URL + '/api/login', { userLogin, password });
}

const createNewUser = (data) => {
    return axios.post(URL + '/api/register', data);
}

const getUser = (id) => {
    return axios.post(URL + '/api/get_all_user', { id });
}

const getRecommendUser = () => {
    return axios.get(URL + '/api/get_recommend_user');
}

const getUserByUsername = (username) => {
    return axios.post(URL + '/api/get_user_by_username', { username });
}

const searchUser = (search) => {
    return axios.post(URL + '/api/search', { search });
}

const editUser = (userId, username, email, bio, profileImage) => {
    return axios.put(URL + '/api/edit_user', {
        userId,
        username,
        email,
        bio,
        profileImage
    });
}

export { handleLogin, createNewUser, getUser, getUserByUsername, searchUser, editUser, getRecommendUser };