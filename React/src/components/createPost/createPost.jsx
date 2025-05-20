import React from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreatePostPage1 from "./createPostPage1";
import CreatePostPage2 from "./createPostPage2";

import { storage } from "../../utils/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';
import { createPost } from "../../services/postService";

import { toast } from "react-toastify";


class CreatePost extends React.Component {
    state = {
        pageIndex: 0,
        imageUpLoad: null,
        imageUrl: '',
        progress: 0,
        loaded: false,
        mainWidth: false,
        notification: false,
        createPostLoaded: false,
        postClose: false,
        postCloseClicked: false,
    };



    componentDidMount() {
        this.setState({
            createPostLoaded: true
        })
    }

    handleNext = () => {
        if (this.state.pageIndex < this.pages.length - 1) {
            this.setState({ pageIndex: this.state.pageIndex + 1, mainWidth: true });
        }
    };

    handlePrev = () => {
        if (this.state.pageIndex > 0) {
            this.notificationChange();
        }
    };

    handleUploadImage = (imageUpLoad) => {
        this.setState({
            loaded: false
        })
        if (imageUpLoad === null) {
            return
        }
        const imageRef = ref(storage, `images/${imageUpLoad.name + v4()}`);
        const uploadTask = uploadBytesResumable(imageRef, imageUpLoad);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.setState({ progress });
            },
            (error) => {
                console.error('Error uploading file:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    this.setState({ imageUrl: url, progress: 100 });
                    this.handleNext();

                }).catch((error) => {
                    console.error('Error getting download URL:', error);
                });
            }
        );

    }


    loadedChange = () => {
        this.setState({
            loaded: true
        })
    }

    deleteImage = (imageUrl) => {
        const imageRef = ref(storage, imageUrl);

        deleteObject(imageRef)
            .then(() => {
                console.log('Xóa ảnh thành công');
            })
            .catch((error) => {
                console.error('Lỗi khi xóa ảnh:', error);
            });
    };

    notificationChange = () => {
        this.setState({
            notification: true,
        })
    }

    handleCancel = () => {
        this.setState({
            notification: false
        })
    }

    handleConfirm = () => {
        let { postCloseClicked } = this.state
        if (postCloseClicked === true) {
            this.setState({ postClose: true })
            console.log(this.state.postClose)
        }
        this.setState({ pageIndex: this.state.pageIndex - 1, mainWidth: false, imageUrl: '', notification: false, postCloseClicked: false });
        this.deleteImage(this.state.imageUrl)

    }

    handleCreatePostClose = () => {
        this.setState({
            postCloseClicked: true
        })

    }

    handleCreatePostClose2 = () => {
        this.props.handleCreatePostClose();
    }



    handleCreatePost = async (userId, caption, imageUrl) => {
        try {
            const newPost = await createPost(userId, caption, imageUrl).then(res => {
                return res.data
            })
            if (newPost && newPost.errCode !== 0) {
                toast.error(newPost.message);
            } else {
                toast.success(newPost.message);
                setTimeout(() => {
                    this.handleCreatePostClose2();
                    window.location.reload();
                    window.scrollTo(0, 0);
                }, 1000)
            }
        } catch (e) {
            toast.error(e.response.data.message);
        }
    }

    pages = [];

    componentDidUpdate(prevProps, prevState) {
        if (prevState.postCloseClicked !== this.state.postCloseClicked) {
            if (this.state.pageIndex > 0) {
                console.log(this.state.postCloseClicked)
                this.notificationChange();
            } else {
                this.setState({
                    postCloseClicked: false
                })
                this.props.handleCreatePostClose();
            }

        }
        if (prevState.postClose !== this.state.postClose) {
            this.setState({
                postClose: false
            })
            this.props.handleCreatePostClose();

        }
    }

    render() {
        const { progress, loaded, imageUrl, mainWidth, notification, createPostLoaded } = this.state;
        this.pages = [
            <CreatePostPage1
                handleNext={this.handleNext}
                handlePrev={this.handlePrev}
                handleUploadImage={this.handleUploadImage} />,
            <CreatePostPage2
                imageUrl={this.state.imageUrl}
                loadedChange={this.loadedChange}
                handleNext={this.handleNext}
                handlePrev={this.handlePrev}
                handleCreatePost={this.handleCreatePost} />,
        ];

        return (
            <>
                {
                    notification &&
                    <div className="notification_container">
                        <div className="notification">
                            <p className="notification_title">Bỏ bài viết?</p>
                            <p className="notification_content">Nếu rời đi, bạn sẽ mất những gì vừa chỉnh sửa.</p>
                            <div onClick={() => this.handleConfirm()} className="notification_button button1">Bỏ</div>
                            <div onClick={() => this.handleCancel()} className="notification_button button2">Hủy</div>
                        </div>
                    </div>
                }
                <FontAwesomeIcon onClick={() => this.handleCreatePostClose()} icon={faXmark} />
                <div className={`create_post_content ${mainWidth ? 'create_post_page_change' : ''} ${createPostLoaded ? 'createPostLoaded' : ''}`}>
                    <div className='create_post_page_container'>
                        {progress > 0 && (
                            <div style={{ width: `${progress / 2}%`, visibility: loaded ? 'hidden' : 'visible' }} className="progress"></div>
                        )}

                        {this.pages[this.state.pageIndex]}
                    </div>
                </div>
            </>

        )
    }


}

export default CreatePost;

