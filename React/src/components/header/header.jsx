import React, { useState } from "react";
import logo1 from "../../assets/images/logo1.png";
import logo2 from "../../assets/images/logo2.png";
import avatar from "../../assets/images/avatar.png"
import icon_noti from "../../assets/images/icon/icon_noti.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import './header.scss'
import { Link } from "react-router-dom";
import { getUser, searchUser } from "../../services/userService";
import blank_avatar from "../../assets/images/blank_avatar.png"
import CreatePost from "../createPost/createPost";

class Header extends React.Component {
    state = {
        style: false,
        listSearch: [],
        searchText: '',
        user: {},
        createPost: false,
    }

    componentDidMount() {
        this.setState({
            createPost: false
        })
        this.fetchUser(this.props.userId);
    }

    changeFocus = () => {
        this.setState({
            style: true
        })
        // document.body.style.overflow = 'hidden';
    }

    changeNotFocus = () => {
        this.setState({
            style: false,
            searchText: '',
            listSearch: []
        })
        document.body.style.overflow = '';
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

    handleChangeSearchInput = async (event) => {
        let searchText = event.target.value
        this.setState({
            searchText: searchText
        })
        this.handleSearch(searchText);
    }

    handleSearch = async (search) => {
        try {
            if (search === '') {
                this.setState({
                    listSearch: []
                })
            }
            else {
                let users = await searchUser(search);
                this.setState({
                    listSearch: users && users.data && users.data.users ? users.data.users : []
                })
            }

        } catch (e) {
            console.log(e.response.data.errMessage)
        }
    }

    handleLogoClick = () => {
        document.body.style.overflow = '';
        window.scrollTo(0, 0);
    }

    handleCreatePostOpen = () => {
        this.setState({
            createPost: true
        })
    }

    handleCreatePostClose = () => {
        this.setState({
            createPost: false
        })
    }

    render() {
        let { style, user, searchText, listSearch, createPost } = this.state;
        console.log(createPost)
        return (
            <div className="header">
                <div onClick={() => this.changeNotFocus()} className={`background_darken ${style ? 'focus3' : ''}`}></div>
                <div className={`header_search_container ${style ? 'focus2' : ''}`}>
                    {
                        listSearch.map((item, index) => {
                            return (
                                <Link onClick={() => this.changeNotFocus()} to={'/' + item.username} className="header_search_item" key={item.id}>
                                    {item.profile_picture_url === null
                                        ?
                                        <img className="search_item_image" src={blank_avatar} alt="" />
                                        :
                                        <img className="search_item_image" src={item.profile_picture_url} alt="" />
                                    }
                                    <div className="search_item_info">
                                        <span className="search_item_info1">{item.username}</span>
                                        <span className="search_item_info2">{item.full_name}</span>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
                <div className={`create_post_container ${createPost ? 'createPost' : ''}`}>
                    <CreatePost handleCreatePostClose={this.handleCreatePostClose} />
                </div>
                <Link onClick={() => this.handleLogoClick()} className="logo_container" to={'/'}>
                    <div id="img1"><img src={logo1}></img></div>
                    <div id="img2"><img src={logo2}></img></div>
                </Link>
                <div className={`search_container ${style ? 'focus' : ''}`}>
                    <input placeholder="Tìm kiếm" onChange={(event) => this.handleChangeSearchInput(event)} onClick={() => this.changeFocus()} value={this.state.searchText}></input>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <div className="feature_container">
                    <div onClick={() => this.handleCreatePostOpen()} className="create_post_button">
                        <FontAwesomeIcon icon={faPlus} />
                        Thêm bài viết
                    </div>
                    <img className="icon_noti" src={icon_noti}></img>
                    <div className="avatar_container">
                        {user.profile_picture_url === null
                            ?
                            <img className="avatar" src={blank_avatar} alt="" />
                            :
                            <img className="avatar" src={user.profile_picture_url} alt="" />
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;