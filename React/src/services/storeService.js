import axios from 'axios'

let URL = process.env.REACT_APP_BACKEND_URL;

const getStoreFromPost = (postId) => {
    return axios.post(URL + '/api/store', { postId });
}

const getStoreFromUser = (userId) => {
    return axios.post(URL + '/api/store-user', { userId });
}

const checkStore = (postId, userId) => {
    return axios.post(URL + '/api/check-store', { postId, userId });
}



const deleteStore = (postId, userId) => {
    return axios.delete(URL + '/api/delete-store', {
        data: {
            postId: postId,
            userId: userId
        }
    });
}

const addStore = (postId, userId) => {
    return axios.post(URL + '/api/create-store', { postId, userId });
}


export { getStoreFromUser, checkStore, addStore, deleteStore, getStoreFromPost };