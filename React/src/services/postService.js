import axios from 'axios'

let URL = process.env.REACT_APP_BACKEND_URL;

const getAllPost = () => {
    return axios.get(URL + '/api/post');
}
const getPostByID = (id) => {
    return axios.get(URL + `/api/post/${id}`);
}

const createPost = (userId, caption, imageUrl) => {
    return axios.post(URL + '/api/create-post', { userId, caption, imageUrl });
}



export { getAllPost, getPostByID, createPost };