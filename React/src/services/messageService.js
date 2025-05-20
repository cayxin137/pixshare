import axios from 'axios'

let URL = process.env.REACT_APP_BACKEND_URL;

const getMessages = (receiverId, senderId) => {
    return axios.post(URL + '/api/message', { receiverId, senderId });
}

const getAllMessages = () => {
    return axios.get(URL + '/api/allmessage');
}

const addMessage = (receiverId, senderId, messageText) => {
    return axios.post(URL + '/api/add-message', { receiverId, senderId, messageText });
}

const addMessagePicutre = (receiverId, senderId, messageText, messagePicture) => {
    return axios.post(URL + '/api/add-message-picture', { receiverId, senderId, messageText, messagePicture });
}

export { getMessages, addMessage, getAllMessages, addMessagePicutre };