import React from "react";
import avatar3 from "../../assets/images/avatar3.png";
import './chat.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faImage, faMagnifyingGlass, faMicrophoneLines } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { faFaceSmile } from "@fortawesome/free-regular-svg-icons";
import { addMessage, getMessages } from "../../services/messageService";
import { Link } from "react-router-dom";
import ScrollToBottom from 'react-scroll-to-bottom';
import blank_avatar from "../../assets/images/blank_avatar.png"
import chat from "./chat";
import { getAllPost, getPostByID } from "../../services/postService";


class ChatDetail extends React.Component {
    state = {
        listMessage: [],
        messageText: '',
        chatStatus: false,
        listPost: []
    }

    componentDidMount() {
        this.fetchPostData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (Object.keys(this.props.chatUser).length !== 0) {
            if (prevProps.chatUser !== this.props.chatUser) {
                this.fetchMessage(this.props.chatUser.id, this.props.user.id)
                this.setState({
                    chatStatus: true
                })
            }
        }

    }

    fetchMessage = async (receiverId, senderId) => {
        try {
            let user_messages = await getMessages(receiverId, senderId);
            this.setState({
                listMessage: user_messages.data.messages
            })

            let other_messages = await getMessages(senderId, receiverId);

            Object.keys(other_messages.data.messages).forEach(id => {
                let copyMessage = this.state.listMessage;
                copyMessage.push(other_messages.data.messages[id])
                this.setState({
                    listMessage: copyMessage
                })

            });

        } catch (e) {
            console.log(e.response.data.errMessage)
        }

    }

    handleMessageChange = (event) => {
        this.setState({
            messageText: event.target.value
        })
    }

    handleAddMessage = async (receiverId, senderId, messageText) => {
        try {
            const newMessage = await addMessage(receiverId, senderId, messageText).then(res => {
                return res.data.message.message
            })

            console.log(newMessage)

            this.setState({
                listMessage: [...this.state.listMessage, newMessage],
                messageText: ''
            })
            this.props.fetchAllMessages();
        } catch (e) {
            console.log(e)
        }
    }

    changeFocus = () => {
        this.props.changeFocus();
    }

    fetchPostData = async () => {
        try {
            const postData = await getAllPost();
            this.setState({
                listPost: postData.data.posts,
            })
        } catch (e) {
            console.log(e)
        }
    }

    renderMessage = (msg) => {
        const messageContent = this.replaceLocalhostPost(msg.message_text);
        if (messageContent === true) {
            const postId = this.extractPostIdFromMessage(msg.message_text);
            const { listPost } = this.state;
            const filterPost = listPost.filter(post => post.id.toString() === postId);
            return filterPost ? (
                <Link className="chat_post_image_container" to={`/chat/post/${postId}`}>
                    <img className="chat_post_image" src={msg.message_picture} />
                    <span>Click để xem bài viết</span>
                </Link>
            ) : null;
        }
        else {
            return (
                <div>{msg.message_text}</div>
            );
        }

    }



    extractPostIdFromMessage = (messageText) => {
        const regex = /http:\/\/localhost:3000\/chat\/post\/(\d+)/;
        const match = messageText.match(regex);
        return match ? match[1] : null;
    };

    replaceLocalhostPost = (messageText) => {
        const regex = /localhost:3000\/chat\/post/g;
        if (regex.test(messageText)) {
            return true
        }
        return false;
    }



    render() {
        const { chatUser, user } = this.props;
        let { listMessage, messageText, chatStatus, postData } = this.state;
        listMessage = listMessage.sort((a, b) => a.id - b.id);
        return (
            chatStatus
                ?
                <div className="chat_detail">
                    <div className="chat_header">
                        {chatUser.profile_picture_url === null
                            ? <img className="chat_user_image" src={blank_avatar} />
                            : <img className="chat_user_image" src={chatUser.profile_picture_url} alt="" />
                        }
                        <div className="chat_item_info">
                            <span className="chat_user_name">{chatUser.full_name}</span>
                            <span className="chat_user_activity">Hoạt động 4 phút trước</span>
                        </div>
                    </div>

                    <ScrollToBottom className="chat_detail_content">
                        <div className="chat_detail_info">
                            {chatUser.profile_picture_url === null
                                ? <img className="chat_user_image" src={blank_avatar} />
                                : <img className="chat_user_image" src={chatUser.profile_picture_url} alt="" />
                            }
                            <span className="chat_user_name">{chatUser.full_name}</span>
                            <span className="chat_user_tag">{`@${chatUser.username}`}</span>
                            <Link to={'/' + chatUser.username} className="profile_button">Xem trang cá nhân</Link>
                        </div>
                        <div className="chat_message_container">
                            {
                                listMessage.map((item, index) => {
                                    return (
                                        item.sender_id === user.id
                                            ?
                                            <div className="chat_message_item user_message_container" key={item.senderId}>
                                                <div className="user_message">
                                                    {this.renderMessage(item)}
                                                </div>
                                            </div>
                                            :
                                            <div className="chat_message_item other_message_container" key={item.senderId}>
                                                {item.Sender.profile_picture_url === null
                                                    ? <img className="chat_avatar" src={blank_avatar} />
                                                    : <img className="chat_avatar" src={item.Sender.profile_picture_url} alt="" />
                                                }
                                                <div className="other_message">
                                                    {this.renderMessage(item)}
                                                </div>
                                            </div>
                                    )
                                })
                            }
                        </div>
                    </ScrollToBottom>

                    <div className="chat_detail_input_container">
                        <div className="chat_detail_input">
                            <FontAwesomeIcon icon={faFaceSmile} />
                            <input
                                onChange={(e) => this.handleMessageChange(e)}
                                value={messageText} placeholder="Tin nhắn"
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        this.handleAddMessage(chatUser.id, user.id, messageText);
                                    }
                                }}
                            />
                            <div className="chat_tag">
                                <FontAwesomeIcon icon={faMicrophoneLines} />
                                <FontAwesomeIcon icon={faImage} />
                                <FontAwesomeIcon icon={faHeart} />
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="chat_blank_container">
                    <div className="logo_chat_container"><FontAwesomeIcon icon={faComments} /></div>
                    <span className="chat_title">Tin nhắn của bạn</span>
                    <span className="chat_content">Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm</span>
                    <div className="chat_button" onClick={() => this.changeFocus()}>Gửi tin nhắn</div>
                </div>
        )
    }
}

export default ChatDetail;