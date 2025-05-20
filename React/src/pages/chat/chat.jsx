import React from "react";
import Header from "../../components/header/header";
import Navigation from "../../components/navigation/navigation";
import "./chat.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faMessage } from "@fortawesome/free-solid-svg-icons";
import avatar from "../../assets/images/avatar.png";
import avatar3 from "../../assets/images/avatar3.png";
import logo1 from "../../assets/images/logo1.png";
import ChatDetail from "./ChatDetail";
import { connect } from "react-redux";
import { store } from "../../redux/store";
import { getUser, searchUser } from "../../services/userService";
import blank_avatar from "../../assets/images/blank_avatar.png"
import { getAllMessages } from "../../services/messageService";
import { Outlet } from "react-router-dom";
import { getAllPost } from "../../services/postService";
import { saveUser } from "../../redux/slices/chatSlice";

class Chat extends React.Component {
    state = {
        activeIndex: null,
        page: window.location.pathname,
        user: {},
        searchStatus: false,
        searchText: '',
        listSearch: [],
        chatUser: {},
        listMessageUser: []

    }

    componentDidMount() {
        this.fetchUser(this.props.user.userId);
        this.fetchAllMessages();
    }

    componentWillUnmount() {
        document.body.style.overflow = '';
        this.props.saveUser(this.state.chatUser);
    }

    changeFocus = () => {
        this.setState({
            searchStatus: true
        })
        document.body.style.overflow = 'hidden';
    }

    changeNotFocus = () => {
        this.setState({
            searchStatus: false,
            searchText: '',
            listSearch: []
        })
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

    handleClickItem = (userId) => {
        this.setState({
            activeIndex: userId
        })
        this.fetchChatUser(userId);
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

    fetchChatUser = async (userId) => {
        try {
            let user = await getUser(userId);
            this.setState({
                chatUser: user && user.data && user.data.users ? user.data.users : {}
            })
            this.props.saveUser(user.data.users)
            this.changeNotFocus();

        } catch (e) {
            console.log(e.response.data.errMessage)
        }


    }

    fetchAllMessages = async () => {
        try {
            const { userId } = this.props.user;
            let messages = await getAllMessages().then(res => { return res.data.messages });
            messages = this.filterLatestMessages(messages);
            const uniqueUsers = new Set();
            let messageUser = [];
            Object.keys(messages).forEach(id => {
                let User = null;
                if (messages[id].sender_id !== userId) {
                    User = messages[id].Sender;
                } else if (messages[id].receiver_id !== userId) {
                    User = messages[id].Receiver;
                }

                if (User && !uniqueUsers.has(User.id)) {
                    uniqueUsers.add(User.id);
                    messageUser.push(User);
                }
            });


            this.setState({
                listMessageUser: messageUser
            });
            this.setState({
                chatUser: this.props.chatUser
            })

        } catch (e) {
            console.log(e.response.data.message)
        }
    }

    filterLatestMessages = (messages) => {
        const sortedMessages = messages.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const uniquePairs = new Set();
        const latestMessages = [];

        for (const message of sortedMessages) {
            if (message.sender_id === this.props.user.userId || message.receiver_id === this.props.user.userId) {
                const pair = `${Math.min(message.sender_id, message.receiver_id)}-${Math.max(message.sender_id, message.receiver_id)}`;
                if (!uniquePairs.has(pair)) {
                    uniquePairs.add(pair);
                    latestMessages.push(message);
                }
            }
        }

        return latestMessages;
    };

    fetchPostData = () => {

    }



    render() {
        let { activeIndex, listUser, user, searchText, listSearch, searchStatus, chatUser, listMessageUser } = this.state;
        const contextValue = {
            fetchPostData: this.fetchPostData
        };
        return (
            <div className="chat_container">
                <Outlet context={contextValue} />
                <img className="logo1" src={logo1}></img>
                <Navigation userId={this.props.user.userId} page={this.state.page} />
                <div className="chat">
                    <div onClick={() => this.changeNotFocus()} className={`search_black_background ${searchStatus ? 'search_black_background_focus' : ''}`}></div>
                    <div className={`search_chat_container ${searchStatus ? 'search_chat_container_focus' : ''}`}>
                        <div className="search_chat_input">
                            <input onChange={(e) => this.handleChangeSearchInput(e)} value={this.state.searchText} />
                        </div>
                        <div className="search_chat_list">
                            {listSearch.map((item, index) => {
                                return (
                                    <div onClick={() => this.fetchChatUser(item.id)} to={'/' + item.username} className="search_chat_list_item" key={item.id}>
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
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="chat_function">
                        <div className="chat_info">
                            <div className="user_name">
                                {user.username}
                                <FontAwesomeIcon onClick={() => this.changeFocus()} icon={faMagnifyingGlass} />
                            </div>
                            <div className="status">
                                {user.profile_picture_url === null
                                    ?
                                    <img src={blank_avatar} alt="" />
                                    :
                                    <img src={user.profile_picture_url} alt="" />
                                }
                                <span>Ghi chú của bạn</span>
                                <div className="status_title">
                                    <span className="message_1"><span className="status_title_text">Ghi chú...</span></span>
                                    <span className="message_2"></span>
                                    <span className="message_3"></span>

                                </div>
                            </div>
                        </div>

                        <span className="chat_title">Tin nhắn</span>
                        <div className="chat_item_container">
                            {listMessageUser && listMessageUser.length > 0 &&
                                listMessageUser.map((item, index) => {
                                    return (
                                        <div className={`chat_item ${activeIndex === item.id ? 'active' : ''}`} key={item.id} onClick={() => this.handleClickItem(item.id)}>
                                            {item.profile_picture_url === null
                                                ? <img className="chat_user_image" src={blank_avatar} />
                                                : <img className="chat_user_image" src={item.profile_picture_url} alt="" />
                                            }
                                            <div className="chat_item_info">
                                                <span className="chat_user_name">{item.full_name}</span>
                                                <span className="chat_user_activity">Hoạt động {item.activity} phút trước</span>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                    <ChatDetail changeFocus={this.changeFocus} fetchAllMessages={this.fetchAllMessages} user={user} chatUser={chatUser} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: store.getState().userReducer.user,
    chatUser: store.getState().chatReducer.chatUser
});

const mapDispatchToProps = {
    saveUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);