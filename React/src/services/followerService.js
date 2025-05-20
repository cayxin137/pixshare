import axios from 'axios'

let URL = process.env.REACT_APP_BACKEND_URL;

const followUser = (userId, followerUserId) => {
    return axios.post(URL + '/api/follow-user', { userId, followerUserId });
}
const unfollowUser = (userId, followerUserId) => {
    return axios.post(URL + '/api/unfollow-user', { userId, followerUserId });
}

const getFollower = (userId) => {
    return axios.post(URL + '/api/get-follower', { userId });
}

const getFollowing = (followerUserId) => {
    return axios.post(URL + '/api/get-following', { followerUserId });
}

const checkFollower = (userId, followerUserId) => {
    return axios.post(URL + '/api/check-follower', { userId, followerUserId });
}


export { followUser, unfollowUser, getFollower, getFollowing, checkFollower };