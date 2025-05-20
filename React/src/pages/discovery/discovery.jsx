import React from "react";
import Header from "../../components/header/header";
import Navigation from "../../components/navigation/navigation";
import Story from "../../components/story/story";
import Recommend from "../../components/recommend/recommend";
import post2_image from "../../assets/images/post2.png";
import avatar2 from "../../assets/images/avatar2.png";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./discovery.scss";

import { store } from "../../redux/store";
import { pathDetect } from "../../redux/slices/pathSlice";
import { connect } from "react-redux";

import { withNavigation } from "../../utils/navigate";
import { getAllPost } from "../../services/postService";
import { addLike, checkLike, deleteLike, getLikeFromPost } from "../../services/likeService";
import { getCommentFromPost } from "../../services/commentService";
import { Link, Outlet } from "react-router-dom";

import blank_avatar from '../../assets/images/blank_avatar.png'
import { removeUser } from "../../redux/slices/chatSlice";

class Discovery extends React.Component {
    state = {
        listPost: [],
        listLike: [],
        listComment: [],
    }

    componentDidMount() {
        if (this.props.user === null) {
            this.props.navigate('/login', { replace: true });
            window.location.reload();

        }
        this.fetchPostData();
        this.props.removeUser();
    }

    fetchPostData = async () => {
        this.setState({
            listLike: [],
            listComment: [],
            likeDetail: []
        })
        let postData = await getAllPost().then(res => {
            return res.data.posts
        });
        this.setState({
            listPost: postData ? postData : [],
        })
        Object.keys(postData).forEach(id => {
            this.handleGetLikeFromPost(postData[id].id);
            this.handleGetCommentFromPost(postData[id].id)
        });
        this.setState({
            loading: false
        })
    }

    handleGetLikeFromPost = async (postId) => {

        let data = await getLikeFromPost(postId).then(res => {
            return res.data;
        });
        let copyState = [];
        copyState = this.state.listLike;
        Object.keys(data.likes).forEach(id => {
            copyState.push(data.likes[id])
        });
        this.setState({
            listLike: copyState
        })

    }

    handleGetLikeDetailFromPost = async (postId) => {
        try {
            let data = await getLikeFromPost(postId).then(res => {
                return res.data.likes;
            });
            console.log(data)

            this.setState({
                likeDetail: data ? data : []
            })
        } catch (e) {
            console.log(e)
        }

    }

    handleGetCommentFromPost = async (postId) => {

        let data = await getCommentFromPost(postId).then(res => {
            return res.data;
        });
        let copyState = [];
        copyState = this.state.listComment;
        Object.keys(data.comments).forEach(id => {
            copyState.push(data.comments[id])
        });
        this.setState({
            listComment: copyState
        })
    }

    handleOpenPostDetail = () => {
        this.setState({
            postDetailStatus: true
        })
        document.body.style.overflow = 'hidden';
    }

    handleClosePostDetail = () => {
        this.setState({
            postDetailStatus: false
        })
        document.body.style.overflow = '';
    }



    render() {
        let { listPost, listLike, listComment } = this.state;
        let { user } = this.props;

        const contextValue = {
            fetchPostData: this.fetchPostData
        };
        return (
            <div>
                <Header userId={user.userId} fetchPostData={this.fetchPostData} />
                <Navigation userId={user.userId} page={this.state.page} />
                <Story />
                <Recommend />
                <Outlet context={contextValue} />

                <div className="discovery">
                    <span className="discovery_title">Bài viết</span>
                    <div className="small_post_container">
                        {listPost.map((post, index) => {
                            const filteredLikes = listLike.filter(like => like.post_id === post.id);
                            const filteredComments = listComment.filter(comment => comment.post_id === post.id);
                            const userLike = listLike.filter(like => like.post_id === post.id && like.user_id === this.props.user.userId)
                            return (
                                <div className="small_post_item">
                                    <Link onClick={() => this.handleOpenPostDetail()} to={'/discovery/post/' + post.id.toString()}><img src={post.image_url} className="small_post_image" alt="" /></Link>
                                    <div className="small_post_info">
                                        <div className="small_post_user">

                                            <div className="user_image_container">
                                                {post.User.profile_picture_url === null
                                                    ? <img src={blank_avatar} />
                                                    : <img src={post.User.profile_picture_url} alt="" />
                                                }


                                            </div>
                                            <span>{post.User.username}</span>
                                        </div>
                                        <div className="interact_container">
                                            <div className="interact_item">
                                                {
                                                    userLike[0]
                                                        ? <FontAwesomeIcon style={{ color: 'red' }} icon={['fas', 'heart']} />
                                                        : <FontAwesomeIcon icon={['far', 'heart']} />
                                                }
                                                <span>{filteredLikes.length}</span>
                                            </div>
                                            <div className="interact_item">
                                                <FontAwesomeIcon icon={faComment} />
                                                <span>{filteredComments.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}


                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loggedIn: store.getState().userReducer.loggedIn,
    user: store.getState().userReducer.user,
    homeLocation: store.getState().homeReducer.homeLocation
});

const mapDispatchToProps = {
    pathDetect,
    removeUser
};


export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Discovery));
