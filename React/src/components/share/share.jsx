import React from "react";
import { Link } from "react-router-dom";
import './share.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import blank_avatar from "../../assets/images/blank_avatar.png"
import { addMessage, addMessagePicutre, getAllMessages } from "../../services/messageService";
import { store } from "../../redux/store";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { searchUser } from "../../services/userService";

class Share extends React.Component {
    state = {
        shareList: [],
        listMessageUser: [],
        chooseUser: null,
        searchText: '',
        listSearch: []
    }

    componentDidMount() {
        this.fetchAllMessages();
    }

    handleCloseShare = () => {
        this.props.handleCloseShare();
        this.setState({
            shareList: []
        })
    }

    fetchAllMessages = async () => {
        try {
            const userId = this.props.user.userId;
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

    handleClickItem = (userId) => {
        this.setState({
            chooseUser: userId
        })
    }

    handleAddMessage = async (receiverId, senderId, messageText, messagePicture) => {
        try {
            await addMessagePicutre(receiverId, senderId, messageText, messagePicture);
            toast.success('Đã gửi');
            this.setState({
                chooseUser: null
            })
        } catch (e) {
            console.log(e)
        }
    }

    handleChangeSearchInput = async (event) => {
        let searchText = event.target.value
        this.setState({
            searchText: searchText,
            chooseUser: null
        })
        setTimeout(() => {
            this.handleSearch(searchText);
        }, 100)
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



    render() {
        const { shareList, listMessageUser, chooseUser, searchText, listSearch } = this.state;
        const { postId, postImage } = this.props;
        console.log(listSearch)
        return (
            <div className="share_container">
                <div className='share_content'>
                    <div className='share_content_header'>
                        Chia sẻ
                        <FontAwesomeIcon icon={faXmark} onClick={() => this.handleCloseShare()} />
                    </div>
                    <div className="share_search_container">
                        <span>Tới: </span>
                        <input value={searchText} onChange={(e) => this.handleChangeSearchInput(e)} placeholder="Tìm kiếm..." />
                    </div>
                    <div className='share_list'>
                        {
                            searchText !== ''
                                ?
                                <>
                                    {listSearch.map((item, index) => {
                                        return (
                                            <div className={`share_item ${chooseUser === item.id ? 'active' : ''}`} key={item.id} onClick={() => this.handleClickItem(item.id)} >
                                                {
                                                    item.profile_picture_url === null
                                                        ? <img src={blank_avatar} />
                                                        : <img src={item.profile_picture_url} />
                                                }

                                                <div className='share_info'>
                                                    <span className='share_info1'>{item.username}</span>
                                                    <span className='share_info2'>{item.full_name}</span>
                                                </div>
                                            </div>
                                        )

                                    })}
                                </>
                                :
                                <>
                                    {listMessageUser.map((item, index) => {
                                        return (
                                            <div className={`share_item ${chooseUser === item.id ? 'active' : ''}`} key={item.id} onClick={() => this.handleClickItem(item.id)} >
                                                {
                                                    item.profile_picture_url === null
                                                        ? <img src={blank_avatar} />
                                                        : <img src={item.profile_picture_url} />
                                                }

                                                <div className='share_info'>
                                                    <span className='share_info1'>{item.username}</span>
                                                    <span className='share_info2'>{item.full_name}</span>
                                                </div>
                                            </div>
                                        )

                                    })}
                                </>
                        }



                    </div>
                    <div className="share_button_container">
                        <button
                            onClick={() => this.handleAddMessage(chooseUser, this.props.user.userId, `http://localhost:3000/chat/post/${postId}`, postImage)}
                            disabled={chooseUser === null}
                            style={{ cursor: chooseUser === null ? 'not-allowed' : 'pointer' }}
                        >Gửi
                        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Share);