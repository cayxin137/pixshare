import React from "react";
import Header from "../../components/header/header";
import Navigation from "../../components/navigation/navigation";

import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./postStore.scss";

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
import withRouter from "../../utils/with-router";
import { getStoreFromUser } from "../../services/storeService";
import { getUserByUsername } from "../../services/userService";

class Discovery extends React.Component {
    state = {
        listStore: []
    }

    componentDidMount() {
        if (this.props.user === null) {
            this.props.navigate('/login', { replace: true });
            window.location.reload();

        }
        this.fetchUser(this.props.router.params.username);
    }

    fetchUser = async (username) => {
        try {
            let user = await getUserByUsername(username);
            this.setState({
                user: user && user.data && user.data.users ? user.data.users : {}
            })
            this.fetchStore(user.data.users.id);
        } catch (e) {
            console.log(e.response.data.errMessage)
        }

    }
    fetchStore = async (userId) => {
        try {
            const storeData = await getStoreFromUser(userId).then(res => {
                return res.data.stores
            });
            this.setState({
                listStore: storeData
            })
        } catch (e) {
            console.log(e)
        }
    }

    fetchPostData = async () => {
    }

    render() {
        let { listStore } = this.state;
        let { user } = this.props;
        console.log(listStore)

        const contextValue = {
            fetchPostData: this.fetchPostData
        };
        return (
            <div>
                <Header userId={user.userId} fetchPostData={this.fetchPostData} />
                <Navigation userId={user.userId} page={this.state.page} />
                <Outlet context={contextValue} />

                <div className="postStore">
                    <h1>Kho lưu trữ</h1>
                    <div className="postStore_container">
                        {listStore.map((item, index) => {
                            return (
                                <Link to={'/' + this.props.router.params.username + '/store' + '/post/' + item.post_id.toString()} className="postStore_item">
                                    <div className="store_post_info">
                                        <div className="store_post_user_info">
                                            <img src={item.Post.User.profile_picture_url} />
                                            <span>{item.Post.User.username}</span>
                                        </div>
                                        <span className="post_caption">{item.Post.caption}</span>
                                    </div>
                                    <img src={item.Post.image_url} alt="" />
                                </Link>
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


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Discovery));
