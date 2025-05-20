import React from 'react';
import './like.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import blank_avatar from "../../assets/images/blank_avatar.png"
import { Link } from 'react-router-dom';

class Like extends React.Component {
    state = {
        listLike: []
    }

    handleCloseLikeDetail = () => {
        this.props.handleCloseLikeDetail();
        this.setState({
            listLike: []
        })
    }

    render() {
        let likeList = [];
        likeList = this.props.likeDetail;
        return (
            <div className='like_container'>
                <div className='like_content'>
                    <div className='like_content_header'>
                        Lượt Thích
                        <FontAwesomeIcon icon={faXmark} onClick={() => this.handleCloseLikeDetail()} />
                    </div>
                    <div className='like_list'>
                        {likeList.map((item, index) => {
                            return (
                                <div className='like_item' key={item.id}>
                                    {
                                        item.User.profile_picture_url === null
                                            ? <Link onClick={() => this.handleCloseLikeDetail()} to={'/' + item.User.username}><img src={blank_avatar} /></Link>
                                            : <Link onClick={() => this.handleCloseLikeDetail()} to={'/' + item.User.username}><img src={item.User.profile_picture_url} /></Link>
                                    }

                                    <div className='like_info'>
                                        <Link onClick={() => this.handleCloseLikeDetail()} to={'/' + item.User.username} className='like_info1'>{item.User.username}</Link>
                                        <span className='like_info2'>{item.User.full_name}</span>
                                    </div>
                                    <div className='follow_button'>
                                        Theo dõi
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

export default Like;
