import React from "react";
import './post.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faXmark } from "@fortawesome/free-solid-svg-icons";
import blank_avatar from "../../assets/images/blank_avatar.png"
import withRouter from "../../utils/with-router";
import { getPostByID } from "../../services/postService";
import { addComment, getCommentFromPost } from "../../services/commentService";
import { far, faHeart, faComment, faShareFromSquare, faBookmark, faPaperPlane } from "@fortawesome/free-regular-svg-icons";

import { store } from "../../redux/store";
import { connect } from "react-redux";
import { addLike, checkLike, deleteLike, getLikeFromPost, userLike } from "../../services/likeService";

import { withOutletContext } from "../../utils/withOutletContext";
import { Link } from "react-router-dom";

import { format } from "date-fns";
import Share from "../share/share";

class Post extends React.Component {
    state = {
        postData: {},
        commentList: [],
        likeList: [],
        userLike: {},
        commentText: '',
        loaded: false,
        shareStatus: false,
        choosePost: null,
        choosePostImage: null
    }

    async componentDidMount() {
        this.setState({ loaded: true });
        this.divRef.focus();
        if (this.props.router && this.props.router.params) {
            let id = this.props.router.params.id;
            const user = this.props.user.userId;
            let data = await getPostByID(id);
            const daysSinceCreation = Math.floor((new Date() - new Date(data.data.post.createdAt)) / (1000 * 60 * 60 * 24));
            const hoursSinceCreation = Math.floor((new Date() - new Date(data.data.post.createdAt)) / (1000 * 60 * 60));
            const minutesSinceCreation = Math.floor((new Date() - new Date(data.data.post.createdAt)) / (1000 * 60));

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
                timeSinceCreation = format(new Date(data.data.post.createdAt), "d 'tháng' M");
            } else if (daysSinceCreation > 365) {
                timeSinceCreation = format(new Date(data.data.post.createdAt), "YYYY");
            }

            else {
                timeSinceCreation = `${daysSinceCreation} ngày`;
            }

            data.data.post.timeSinceCreation = timeSinceCreation;


            this.setState({
                postData: data && data.data && data.data.post ? data.data.post : {}
            })
            await this.fetchCommentData(id);
            await this.fetchLikesFromPost(id);
            await this.getUserLike(id, user);
        }
    }

    fetchLikesFromPost = async (postId) => {
        try {
            let data = await getLikeFromPost(postId).then(res => {
                return res.data.likes;
            });

            this.setState({
                likeList: data ? data : []
            })
        } catch (e) {
            console.log(e)
        }

    }

    getUserLike = async (postId, userId) => {
        try {
            let data = await userLike(postId, userId).then(res => {
                return res.data.like.like;
            });

            this.setState({
                userLike: data
            })
        } catch (e) {
            console.log(e)
        }
    }

    fetchCommentData = async (postId) => {
        let data = await getCommentFromPost(postId).then(res => {
            return res.data.comments
        });

        const dataWithTimeDiff = data.map(item => {
            const daysSinceCreation = Math.floor((new Date() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24));
            const hoursSinceCreation = Math.floor((new Date() - new Date(item.createdAt)) / (1000 * 60 * 60));
            const minutesSinceCreation = Math.floor((new Date() - new Date(item.createdAt)) / (1000 * 60));
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
            }
            else if (daysSinceCreation > 7) {
                timeSinceCreation = format(new Date(item.createdAt), "d 'tháng' M");
            } else if (daysSinceCreation > 365) {
                timeSinceCreation = format(new Date(item.createdAt), "YYYY");
            }

            else {
                timeSinceCreation = `${daysSinceCreation} ngày`;
            }

            return {
                ...item,
                timeSinceCreation: timeSinceCreation
            };

        });

        this.setState({
            commentList: dataWithTimeDiff ? dataWithTimeDiff : []
        })
    }

    handleCloseClick = () => {
        document.body.style.overflow = '';
        this.props.router.navigate(-1);
        this.props.fetchPostData();
    };


    handleClickLike = async (postId) => {
        try {
            let user = this.props.user.userId;
            const check = await checkLike(postId, user).then(res => {
                return res.data.like
            });
            if (check === true) {
                await deleteLike(postId, user);
                let currentLikes = this.state.likeList;
                currentLikes = currentLikes.filter(item => item.post_id !== postId || item.user_id !== user);
                this.setState({
                    likeList: currentLikes
                })
                this.getUserLike(postId, user);
            } else {
                const newLike = await addLike(postId, user).then(res => {
                    return res.data.like.like
                })
                this.setState({
                    likeList: [...this.state.likeList, newLike]
                })
                this.getUserLike(postId, user);
            }

        } catch (e) {
            console.log(e)
        }
    }

    handleAddComment = async (caption) => {
        try {
            let userId = this.props.user.userId;
            let postId = this.props.router.params.id;

            const newComment = await addComment(postId, userId, caption).then(res => {
                return res.data.comment.comment
            })
            console.log(newComment);
            this.setState({
                commentList: [...this.state.commentList, newComment],
                commentText: ''
            })
            await this.fetchCommentData(this.props.router.params.id);
        } catch (e) {
            console.log(e)
        }
    }

    handleInputComment = (event) => {
        this.setState({
            commentText: event.target.value
        })
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

    render() {
        let { postData, commentList, likeList, userLike, commentText, loaded, shareStatus } = this.state;
        let isEmpty = Object.keys(postData).length === 0;
        console.log(commentList)
        return (
            <div
                ref={(div) => { this.divRef = div; }}
                className='post_detail_container'
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        this.handleCloseClick();
                    }
                }}
                tabIndex="0"
            >
                {
                    shareStatus === true && <Share postImage={this.state.choosePostImage} postId={this.state.choosePost} handleCloseShare={this.handleCloseShare} />
                }
                {shareStatus === true && <div className="background_darken_home"></div>}
                <FontAwesomeIcon icon={faXmark} id="post_exit_button" onClick={() => this.handleCloseClick()} />
                <div className={`post_detail  ${loaded ? 'loaded' : ''}`}>
                    {isEmpty === false &&
                        <>
                            <img src={postData.image_url} className="post_detail_image" alt="" />
                            <div className="post_detail_content">
                                <div className="post_detail_header_container">
                                    <div className="post_detail_header">
                                        <Link className="post_detail_header_info" to={'/' + postData.User.username}>
                                            {postData.User.profile_picture_url === null
                                                ? <img src={blank_avatar} className="post_user_avatar" />
                                                : <img src={postData.User.profile_picture_url} className="post_user_avatar" />
                                            }
                                            <span className="post_user_name">{postData.User.username}</span>
                                        </Link>
                                        <FontAwesomeIcon icon={faEllipsis} />
                                    </div>
                                </div>
                                <div className="post_comment_item_container">
                                    <div className="post_comment_item">
                                        {
                                            postData.User.profile_picture_url === null
                                                ? <Link to={'/' + postData.User.username}><img src={blank_avatar} /></Link>
                                                : <Link to={'/' + postData.User.username}><img src={postData.User.profile_picture_url} /></Link>
                                        }

                                        <span className="post_comment_item_content">
                                            <span className="post_comment_caption_container">
                                                <Link to={'/' + postData.User.username} className="post_comment_username">{postData.User.username}</Link>
                                                <span className="post_comment_caption">{postData.caption}</span>
                                            </span>
                                            <span className="post_comment_hour">{postData.timeSinceCreation}</span>
                                        </span>

                                    </div>
                                    {commentList.map((item, index) => {
                                        return (
                                            <div className="post_comment_item" key={item.id}>
                                                {
                                                    item.User.profile_picture_url === null
                                                        ? <Link to={'/' + item.User.username}><img src={blank_avatar} /></Link>
                                                        : <Link to={'/' + item.User.username}><img src={item.User.profile_picture_url} /></Link>
                                                }
                                                <span className="post_comment_item_content">
                                                    <span className="post_comment_caption_container">
                                                        <Link to={'/' + item.User.username} className="post_comment_username">{item.User.username}</Link>
                                                        <span className="post_comment_caption">{item.comment_text}</span>
                                                    </span>
                                                    <span className="post_comment_hour">{item.timeSinceCreation}</span>
                                                </span>
                                            </div>
                                        )
                                    })}

                                </div>
                                <div className="post_detail_footer">
                                    <div className="post_detail_footer_content">
                                        <div className="interact_container">
                                            <div className="interact_content">
                                                <div className="interact_item"
                                                    id={userLike !== null ? 'liked' : 'unliked'}
                                                    onClick={() => this.handleClickLike(postData.id)}>
                                                    {
                                                        userLike !== null

                                                            ? <FontAwesomeIcon icon={['fas', 'heart']} />
                                                            : <FontAwesomeIcon icon={['far', 'heart']} />
                                                    }
                                                </div>
                                                <div className="interact_item">
                                                    <FontAwesomeIcon icon={faComment} />
                                                </div>
                                                <div className="interact_item" onClick={() => this.handleOpenShare(postData.id, postData.image_url)}>
                                                    <FontAwesomeIcon icon={faShareFromSquare} />

                                                </div>
                                                <div className="interact_item mark">
                                                    <FontAwesomeIcon icon={faBookmark} />
                                                </div>
                                            </div>
                                            <span className="like_count">{likeList.length} lượt thích</span>
                                            <span className="post_comment_hour">{postData.timeSinceCreation}</span>
                                        </div>
                                        <div className="comment_input">
                                            <input
                                                value={commentText}
                                                onChange={(event) => this.handleInputComment(event)}
                                                placeholder="Thêm bình luận..."
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        event.preventDefault();
                                                        this.handleAddComment(commentText);
                                                    }
                                                }}
                                            ></input>
                                            <span onClick={() => this.handleAddComment(commentText)} className="send_comment"><FontAwesomeIcon icon={faPaperPlane} /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    user: store.getState().userReducer.user
});

const mapDispatchToProps = {
};


export default connect(mapStateToProps, mapDispatchToProps)(withOutletContext(withRouter(Post)));
