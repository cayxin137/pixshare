import React from "react";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { connect } from 'react-redux';
import { store } from "../../redux/store";
import { getUser } from "../../services/userService";
import { createPost } from "../../services/postService";

import blank_avatar from "../../assets/images/blank_avatar.png"
class CreatePostPage3 extends React.Component {
    state = {
        mainWidth: false,
        user: {},
        caption: ''
    }
    componentDidMount() {
        this.props.loadedChange();
        this.setState({
            mainWidth: true
        })
        this.fetchUser(this.props.user.userId)
    }

    componentWillUnmount() {
        this.setState({
            mainWidth: false
        })
    }

    fetchUser = async (userId) => {
        try {
            let user = await getUser(userId);
            this.setState({
                user: user && user.data && user.data.users ? user.data.users : {}
            })

        } catch (e) {
            console.log(e.response.data.errMessage)
        }


    }

    handleCaptionChange = (e) => {
        this.setState({
            caption: e.target.value
        })
    }

    handleCreatePost = (userId, caption, imageUrl) => {
        this.props.handleCreatePost(userId, caption, imageUrl);
    }



    render() {
        const { imageUrl } = this.props;
        const { user, caption } = this.state;
        console.log(caption)
        return (
            <div className="create_post_page">
                <div className="create_post_header">
                    <FontAwesomeIcon onClick={this.props.handlePrev} className="navigation_button" icon={faRotateLeft} />
                    <span>Tạo bài viết mới</span>
                    <span onClick={() => this.handleCreatePost(user.id, caption, imageUrl)} className="navigation_button">Chia sẻ</span>
                </div>
                <div className="create_post_main">
                    <div className="create_post_image">
                        <img src={imageUrl} alt="" />
                    </div>
                    <div className="create_post_info_container">
                        <span className="create_post_info">
                            {
                                user.profile_picture_url === null
                                    ? <img src={blank_avatar} />
                                    : <img src={user.profile_picture_url} />
                            }

                            <span>{user.username}</span>
                        </span>
                        <div className="caption_input">
                            <textarea onChange={(e) => this.handleCaptionChange(e)} value={caption} placeholder="Viết chú thích..." type="text" />
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: store.getState().userReducer.user,
});

const mapDispatchToProps = {
};


export default connect(mapStateToProps, mapDispatchToProps)(CreatePostPage3);
