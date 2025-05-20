import React, { useEffect } from "react";
import Header from "../../components/header/header";
import Navigation from "../../components/navigation/navigation";
import Story from "../../components/story/story";
import blank_avatar from "../../assets/images/blank_avatar.png"
import { store } from "../../redux/store";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { far, faHeart, faComment, faShareFromSquare, faBookmark, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import './home.scss';
import Recommend from "../../components/recommend/recommend";
import { getAllPost } from "../../services/postService";
import { addLike, checkLike, deleteLike, getLikeFromPost } from "../../services/likeService";
import { addComment, getCommentFromPost } from "../../services/commentService";

import { connect } from 'react-redux';
import { withNavigation } from "../../utils/navigate";
import Like from "../../components/like/like";
import Post from "../../components/post/post";
import { Link, Outlet } from "react-router-dom";
import withRouter from "../../utils/with-router";

import { format } from "date-fns"

import { locationDetect } from "../../redux/slices/homeSlice";
import Share from "../../components/share/share";
import { removeUser } from "../../redux/slices/chatSlice";
import { addStore, checkStore, deleteStore, getStoreFromPost } from "../../services/storeService";
library.add(fas, far);

class Home extends React.Component {
    state = {
        homeloaded: false,
        loading: true,
        style: 'comment_container',
        listPost: [],
        listLike: [],
        listComment: [],
        listStore: [],
        likeDetailStatus: false,
        postDetailStatus: false,
        likeDetail: [],
        scrollPositions: {},
        commentText: '',
        shareStatus: false,
        choosePost: null,
        choosePostImage: null
    }


    changeFocus = () => {
        this.setState({
            style: 'comment_container focus'
        })
    }

    changeNotFocus = () => {
        this.setState({
            style: 'comment_container'
        })
    }


    componentDidMount() {
        this.setState({
            homeloaded: true
        })
        this.fetchPostData();
        this.props.removeUser();

    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.homeloaded !== this.state.homeloaded) {

            if (this.props.user === null) {
                this.props.navigate('/login', { replace: true });

            }
        }
    }

    // componentWillUnmount() {
    //     const scrollPosition = {
    //         x: window.scrollX,
    //         y: window.scrollY,
    //     };

    //     this.props.locationDetect(scrollPosition);
    // }

    fetchPostData = async () => {
        this.setState({
            listLike: [],
            listComment: [],
            likeDetail: [],
            listStore: []
        })
        let postData = await getAllPost().then(res => {
            return res.data.posts
        });
        const dataWithTimeDiff = postData.map(post => {
            const daysSinceCreation = Math.floor((new Date() - new Date(post.createdAt)) / (1000 * 60 * 60 * 24));
            const hoursSinceCreation = Math.floor((new Date() - new Date(post.createdAt)) / (1000 * 60 * 60));
            const minutesSinceCreation = Math.floor((new Date() - new Date(post.createdAt)) / (1000 * 60));
            let timeSinceCreation = null;
            if (daysSinceCreation < 1) {
                if (hoursSinceCreation < 1) {
                    if (minutesSinceCreation < 1) {
                        timeSinceCreation = 'Vài giây';
                    } else {
                        timeSinceCreation = `${minutesSinceCreation} phút`;
                    }
                } else {
                    timeSinceCreation = `${hoursSinceCreation} giờ`;
                }
            } else if (daysSinceCreation > 7) {
                timeSinceCreation = format(new Date(post.createdAt), "d 'tháng' M");
            } else if (daysSinceCreation > 365) {
                timeSinceCreation = format(new Date(post.createdAt), "YYYY");
            }

            else {
                timeSinceCreation = `${daysSinceCreation} ngày`;
            }

            return {
                ...post,
                timeSinceCreation: timeSinceCreation
            };

        });

        const dataWithTime = dataWithTimeDiff.map(post => {
            const secondsSinceCreation = Math.floor((new Date() - new Date(post.createdAt)) / (1000));
            return {
                ...post,
                time_count: secondsSinceCreation
            };
        })
        this.setState({
            listPost: dataWithTime ? dataWithTime : [],
        })
        Object.keys(postData).forEach(id => {
            this.handleGetLikeFromPost(postData[id].id);
            this.handleGetStoreFromPost(postData[id].id);
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

    handleGetStoreFromPost = async (postId) => {

        let data = await getStoreFromPost(postId).then(res => {
            return res.data;
        });
        let copyState = [];
        copyState = this.state.listStore;
        Object.keys(data.stores).forEach(id => {
            copyState.push(data.stores[id])
        });
        this.setState({
            listStore: copyState
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

    handleClickLike = async (postId) => {
        try {
            let user = this.props.user.userId;
            const check = await checkLike(postId, user).then(res => {
                return res.data.like
            });
            if (check === true) {
                await deleteLike(postId, user);
                let currentLikes = this.state.listLike;
                currentLikes = currentLikes.filter(item => item.post_id !== postId || item.user_id !== user);
                this.setState({
                    listLike: currentLikes
                })
            } else {
                const newLike = await addLike(postId, user).then(res => {
                    return res.data.like.like
                })
                this.setState({
                    listLike: [...this.state.listLike, newLike]
                })

            }

        } catch (e) {
            console.log(e)
        }
    }

    handleClickStore = async (postId) => {
        try {
            let user = this.props.user.userId;
            const check = await checkStore(postId, user).then(res => {
                return res.data.store
            });
            if (check === true) {
                await deleteStore(postId, user);
                let currentStores = this.state.listStore;
                currentStores = currentStores.filter(item => item.post_id !== postId || item.user_id !== user);
                this.setState({
                    listStore: currentStores
                })
            } else {
                const newStore = await addStore(postId, user).then(res => {
                    return res.data.store.store
                })
                this.setState({
                    listStore: [...this.state.listStore, newStore]
                })

            }

        } catch (e) {
            console.log(e)
        }
    }

    handleOpenLikeDetail = (postId) => {
        this.handleGetLikeDetailFromPost(postId)
        this.setState({
            likeDetailStatus: true
        })
        document.body.style.overflow = 'hidden';
    }

    handleCloseLikeDetail = () => {
        this.setState({
            likeDetailStatus: false,
            postId: null
        })
        document.body.style.overflow = '';
    }

    handleOpenShare = (postId, postImage) => {
        this.setState({
            shareStatus: true,
            choosePost: postId,
            choosePostImage: postImage
        })
        document.body.style.overflow = 'hidden';
    }

    handleCloseShare = () => {
        this.setState({
            shareStatus: false,
            choosePost: null,
            choosePostImage: null
        })
        document.body.style.overflow = '';
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

    handleInputComment = (event) => {
        this.setState({
            commentText: event.target.value
        })
    }

    handleAddComment = async (caption, postId) => {
        try {
            let userId = this.props.user.userId;


            const newComment = await addComment(postId, userId, caption).then(res => {
                return res.data.comment.comment
            })

            this.setState({
                listComment: [...this.state.listComment, newComment],
                commentText: ''
            })
        } catch (e) {
            console.log(e)
        }
    }




    render() {
        let { style, listPost, listLike, listComment, listStore, likeDetailStatus, postDetailStatus, commentText, shareStatus } = this.state;
        let { user } = this.props;
        if (this.props.loggedIn === true) {
            user = user.userId;
        }
        const contextValue = {
            fetchPostData: this.fetchPostData
        };
        const sortedPosts = listPost.sort((a, b) => a.time_count - b.time_count);
        return (
            <div>
                <Header userId={user} fetchPostData={this.fetchPostData} />
                <Navigation userId={user} />
                <Story />
                <Recommend />
                <Outlet context={contextValue} />

                <div className="home">
                    {likeDetailStatus === true && <div className="background_darken_home"></div>}
                    {shareStatus === true && <div className="background_darken_home"></div>}
                    <div className="post_container">
                        {sortedPosts && sortedPosts.length > 0 &&
                            sortedPosts.map((post, index) => {
                                const filteredLikes = listLike.filter(like => like.post_id === post.id);
                                const userLike = listLike.filter(like => like.post_id === post.id && like.user_id === this.props.user.userId)
                                const userStore = listStore.filter(store => store.post_id === post.id && store.user_id === this.props.user.userId)
                                const filteredComments = listComment.filter(comment => comment.post_id === post.id);
                                console.log(userStore)
                                return (

                                    <div className="post_content" key={post.id}>

                                        {
                                            likeDetailStatus === true && <Like likeDetail={this.state.likeDetail} handleCloseLikeDetail={this.handleCloseLikeDetail} />
                                        }

                                        {
                                            shareStatus === true && <Share postImage={this.state.choosePostImage} postId={this.state.choosePost} handleCloseShare={this.handleCloseShare} />
                                        }

                                        <Link to={'/' + post.User.username} className="info_container">
                                            <img src={post.User.profile_picture_url ? post.User.profile_picture_url : blank_avatar} />
                                            <span>{post.User.username} • </span>
                                            <span className="post_time">
                                                {post.timeSinceCreation !== null &&
                                                    <p>{post.timeSinceCreation}</p>
                                                }
                                            </span>
                                        </Link>
                                        <Link onClick={() => this.handleOpenPostDetail()} to={'/post/' + post.id.toString()}><img src={post.image_url} className="post_image" alt="" /></Link>
                                        <div className="interact_container">
                                            <div className="interact_item"
                                                id={userLike[0] ? 'liked' : 'unliked'}
                                                onClick={() => this.handleClickLike(post.id)}>
                                                {
                                                    userLike[0]
                                                        ? <FontAwesomeIcon icon={['fas', 'heart']} />
                                                        : <FontAwesomeIcon icon={['far', 'heart']} />
                                                }
                                                Thích
                                            </div>
                                            <Link onClick={() => this.handleOpenPostDetail()} to={'/post/' + post.id.toString()} className="interact_item">
                                                <FontAwesomeIcon icon={faComment} />
                                                Bình luận
                                            </Link>
                                            <div className="interact_item" onClick={() => this.handleOpenShare(post.id, post.image_url)}>
                                                <FontAwesomeIcon icon={faShareFromSquare} />
                                                Chia sẻ
                                            </div>
                                            <div className="interact_item mark"
                                                onClick={() => this.handleClickStore(post.id)}>
                                                {
                                                    userStore[0]
                                                        ? <FontAwesomeIcon icon={['fas', 'bookmark']} />
                                                        : <FontAwesomeIcon icon={['far', 'bookmark']} />
                                                }

                                                {
                                                    userStore[0]
                                                        ? 'Đã lưu'
                                                        : 'Lưu'
                                                }
                                            </div>
                                        </div>
                                        <div className="user_like" onClick={() => this.handleOpenLikeDetail(post.id)}>
                                            {filteredLikes.length > 1
                                                ? filteredLikes.slice(0, 1).map((like) => (
                                                    <span className="user_like_content" key={like.id}>
                                                        <span className="bold_item">{like.User.username}</span>
                                                        và
                                                        <span className="bold_item">những người khác</span>
                                                        thích
                                                    </span>
                                                ))
                                                : filteredLikes.map((like) => (
                                                    <span className="user_like_content" key={like.id}><span className="bold_item">{like.User.username}</span> đã thích</span>
                                                ))
                                            }
                                        </div>
                                        <span className="description_container"><span className="user_name">{post.User.username}</span> <span>{post.caption}</span></span>
                                        {filteredComments.length > 0 &&
                                            <Link onClick={() => this.handleOpenPostDetail()} to={'/post/' + post.id.toString()} className="comment_count">Xem tất cả {filteredComments.length} bình luận</Link>
                                        }
                                        <div className={style}>
                                            <input
                                                value={commentText}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        event.preventDefault();
                                                        this.handleAddComment(commentText, post.id);
                                                    }
                                                }}
                                                placeholder="Thêm bình luận..."
                                                onChange={(event) => this.handleInputComment(event)} onBlur={() => this.changeNotFocus()}
                                                onMouseDown={() => this.changeFocus()}></input>
                                            <span onClick={() => this.handleAddComment(commentText, post.id)} className="send_comment"><FontAwesomeIcon icon={faPaperPlane} /></span>
                                        </div>
                                    </div>
                                )

                            })

                        }
                    </div>
                </div>
            </div >
        )
    }


}



const mapStateToProps = (state) => ({
    loggedIn: store.getState().userReducer.loggedIn,
    user: store.getState().userReducer.user,
    homeLocation: store.getState().homeReducer.homeLocation,
    chatUser: store.getState().chatReducer.chatUser
});

const mapDispatchToProps = {
    locationDetect,
    removeUser
};


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withNavigation(Home)));
