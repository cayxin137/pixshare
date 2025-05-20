import axios from 'axios'

let URL = process.env.REACT_APP_BACKEND_URL;

const getLikeFromPost = (postId) => {
    return axios.post(URL + '/api/like', { postId });
}

const checkLike = (postId, userId) => {
    return axios.post(URL + '/api/check-like', { postId, userId });
}

const userLike = (postId, userId) => {
    return axios.post(URL + '/api/user-like', { postId, userId });
}


const deleteLike = (postId, userId) => {
    return axios.delete(URL + '/api/delete-like', {
        data: {
            postId: postId,
            userId: userId
        }
    });
}



const addLike = (postId, userId) => {
    return axios.post(URL + '/api/create-like', { postId, userId });
}


export { getLikeFromPost, checkLike, addLike, deleteLike, userLike };