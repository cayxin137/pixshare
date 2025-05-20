import React from "react";
import Header from "../../components/header/header";
import Navigation from "../../components/navigation/navigation";
import { withNavigation } from "../../utils/navigate";
import './profile.scss'

import { faEllipsis, faTableCells, faClapperboard, faUserTag, faUser } from "@fortawesome/free-solid-svg-icons";

import { store } from "../../redux/store";
import { connect } from "react-redux";
import { getUser, getUserByUsername } from "../../services/userService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllPost } from "../../services/postService";

import blank_avatar from "../../assets/images/blank_avatar.png"

import withRouter from "../../utils/with-router";
import { checkFollower, followUser, getFollower, getFollowing, unfollowUser } from "../../services/followerService";
import { Link, Outlet } from "react-router-dom";
import { removeUser } from "../../redux/slices/chatSlice";

class Profile extends React.Component {
    state = {
        user: {},
        listPost: [],
        listFollower: [],
        listFollowing: []
    }

    componentDidMount() {
        this.setState({
            user: {}
        })
        this.fetchUser(this.props.router.params.username);
        this.fetchPostData();
        if (this.props.user.username === this.props.router.params.username) {
            this.props.removeUser();
        }
    }

    componentDidUpdate(prevProps) {

        if (this.props.router.params.username !== prevProps.router.params.username) {
            this.fetchUser(this.props.router.params.username);
        }
    }

    fetchUser = async (username) => {
        try {
            let user = await getUserByUsername(username);
            this.setState({
                user: user && user.data && user.data.users ? user.data.users : {}
            })
            this.fecthFollower(user.data.users.id);
            this.fecthFollowing(user.data.users.id);
        } catch (e) {
            console.log(e.response.data.errMessage)
        }

    }

    fetchPostData = async () => {
        // this.setState({
        //     listLike: [],
        //     listComment: [],
        //     likeDetail: []
        // })
        let postData = await getAllPost().then(res => {
            return res.data.posts
        });
        this.setState({
            listPost: postData ? postData : [],
        })
        // Object.keys(postData).forEach(id => {
        //     this.handleGetLikeFromPost(postData[id].id);
        //     this.handleGetCommentFromPost(postData[id].id)
        // });
        // this.setState({
        //     loading: false
        // })
    }

    fecthFollower = async (userId) => {
        let followerData = await getFollower(userId).then(res => {
            return res.data.followers
        });
        this.setState({
            listFollower: followerData ? followerData : [],
        })
    }

    fecthFollowing = async (followUserId) => {
        let followingData = await getFollowing(followUserId).then(res => {
            return res.data.followers
        });
        this.setState({
            listFollowing: followingData ? followingData : [],
        })
    }


    handleClickFollow = async (userId) => {
        try {
            let followUserId = this.props.user.userId;
            const check = await checkFollower(userId, followUserId).then(res => {
                return res.data.follow
            });
            console.log(check)
            if (check === true) {
                await unfollowUser(userId, followUserId);
                let currentFollowers = this.state.listFollower;
                currentFollowers = currentFollowers.filter(item => item.user_id !== userId || item.follower_user_id !== followUserId);
                this.setState({
                    listFollower: currentFollowers
                })
            } else {
                const newFollower = await followUser(userId, followUserId).then(res => {
                    return res.data.follower.follower
                })
                this.setState({
                    listFollower: [...this.state.listFollower, newFollower]
                })

            }

        } catch (e) {
            console.log(e)
        }
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
        let { user, listPost, listFollower, listFollowing } = this.state;
        let username = this.props.router.params.username;
        const filterPost = listPost.filter(post => post.User.username === this.props.router.params.username);
        const userFollow = listFollower.filter(follower => follower.user_id === user.id && follower.follower_user_id === this.props.user.userId)
        console.log(userFollow)

        const contextValue = {
            fetchPostData: this.fetchPostData
        };
        return (
            <div>
                <Header userId={this.props.user.userId} />
                <Navigation userId={this.props.user.userId} />
                <Outlet context={contextValue} />
                <div className="profile">
                    <div className="profile_content">
                        <div className="profile_info_container">
                            <div className="profile_image">
                                {user.profile_picture_url === null
                                    ?
                                    <img className="profile_image" src={blank_avatar} alt="" />
                                    :
                                    <img className="profile_image" src={user.profile_picture_url} alt="" />
                                }
                            </div>
                            <div className="profile_info">
                                <div className="profile_header">
                                    <span className="profile_fullname">{user.full_name}</span>
                                    <div className="profile_buttons">
                                        {
                                            user.username === this.props.user.username
                                                ?
                                                <>
                                                    <Link to={'/edit/' + this.props.user.username} className="profile_follow_button"><span>Chỉnh sửa</span></Link>
                                                    <Link to={'/' + this.props.user.username + '/store'} className="profile_chat_button">Kho lưu trữ</Link>
                                                </>
                                                :
                                                <>
                                                    <div onClick={() => this.handleClickFollow(user.id)} className={`profile_follow_button ${userFollow[0] ? 'follow' : ''}`}>
                                                        {
                                                            userFollow[0] ? <span style={{ backgroundColor: '#450EE0' }}>Đang theo dõi</span> : <span>Theo dõi</span>
                                                        }
                                                    </div>
                                                    <div className="profile_chat_button">Nhắn tin</div>
                                                </>
                                        }

                                        <FontAwesomeIcon icon={faEllipsis} />
                                    </div>
                                </div>
                                <span className="profile_username">{'@' + user.username}</span>
                                <div className="profile_detail_container">
                                    <div className="profile_detail_item">
                                        <span className="profile_detail_item_count">{filterPost.length}</span>
                                        <span className="profile_detail_item_title">Bài viết</span>
                                    </div>
                                    <div className="profile_detail_item">
                                        <span className="profile_detail_item_count">{listFollower.length}</span>
                                        <span className="profile_detail_item_title">Người theo dõi</span>
                                    </div>
                                    <div className="profile_detail_item">
                                        <span className="profile_detail_item_count">{listFollowing.length}</span>
                                        <span className="profile_detail_item_title">Đang theo dõi</span>
                                    </div>
                                </div>
                                <div className="profile_bio">{user.bio}</div>
                            </div>
                        </div>
                        <div className="profile_content_category">
                            <span className="line"></span>
                            <div className="profile_category_container">
                                <div className="profile_category">
                                    <FontAwesomeIcon icon={faTableCells} />
                                    <p>Bài viết</p>
                                </div>
                                <div className="profile_category">
                                    <FontAwesomeIcon icon={faClapperboard} />
                                    <p>Reels</p>
                                </div>
                                <div className="profile_category">
                                    <FontAwesomeIcon icon={faUserTag} />
                                    <p>Được gắn thẻ</p>
                                </div>
                            </div>
                        </div>

                        <div className="profile_post_container">
                            {

                                filterPost.map((item, index) => {
                                    return (
                                        <div className="profile_post" key={item.id}>
                                            <Link onClick={() => this.handleOpenPostDetail()} to={`post/${item.id.toString()}`}>
                                                <img src={item.image_url} alt="" />
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div >


        )
    }
}

const mapStateToProps = (state) => ({
    loggedIn: store.getState().userReducer.loggedIn,
    user: store.getState().userReducer.user,
    homeLocation: store.getState().homeReducer.homeLocation
});

const mapDispatchToProps = {
    removeUser
};


export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(withRouter(Profile)));
