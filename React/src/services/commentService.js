import axios from 'axios'

let URL = process.env.REACT_APP_BACKEND_URL;

const getCommentFromPost = (postId) => {
    return axios.post(URL + '/api/comment', { postId });
}

const addComment = (postId, userId, caption) => {
    return axios.post(URL + '/api/add-comment', { postId, userId, caption });
}

export { getCommentFromPost, addComment };