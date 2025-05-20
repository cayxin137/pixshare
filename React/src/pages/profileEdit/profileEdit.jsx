import React from 'react';
import './profileEdit.scss';
import { withNavigation } from '../../utils/navigate';
import { store } from '../../redux/store';
import { editUser, getUser, getUserByUsername } from '../../services/userService';
import { connect } from 'react-redux';
import withRouter from '../../utils/with-router';
import Navigation from '../../components/navigation/navigation';
import Header from '../../components/header/header';

import { storage } from "../../utils/firebase2";
import { deleteObject, getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';

class ProfileEdit extends React.Component {
    state = {
        username: '',
        bio: '',
        email: '',
        profileImage: ''
    };

    componentDidMount() {
        this.fetchUser(this.props.router.params.username);
    }

    fetchUser = async (username) => {
        try {
            let user = await getUserByUsername(username);
            this.setState({
                user: user && user.data && user.data.users ? user.data.users : {},
                username: user.data.users.username,
                bio: user.data.users.bio,
                email: user.data.users.email,
                profileImage: user.data.users.profile_picture_url
            })
        } catch (e) {
            console.log(e.response.data.errMessage)
        }

    }
    handleChange2 = (e) => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.handleUploadImage2(image);
        }
    };

    handleUploadImage2 = (imageUpLoad) => {
        if (imageUpLoad === null) {
            return
        }
        const imageRef2 = ref(storage, `user/${imageUpLoad.name + v4()}`);
        const uploadTask2 = uploadBytesResumable(imageRef2, imageUpLoad);

        uploadTask2.on(
            'state_changed',
            (snapshot) => {

            },
            (error) => {
                console.error('Error uploading file:', error);
            },
            () => {
                getDownloadURL(uploadTask2.snapshot.ref).then((url) => {
                    this.setState({ profileImage: url });

                }).catch((error) => {
                    console.error('Error getting download URL:', error);
                });
            }
        );

    }

    handleSave = async () => {
        const { user, username, bio, email, profileImage } = this.state;
        try {
            await editUser(user.id, username, email, bio, profileImage);
            this.props.navigate(-1);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    render() {
        const { username, bio, email, profileImage } = this.state;
        console.log(profileImage)
        return (
            <div className='profile_edit'>
                <Navigation userId={this.props.user.userId} />
                <Header />
                <div className="profile_edit_container">
                    <h2>Chỉnh sửa thông tin cá nhân</h2>
                    <div className="profile_image_section">
                        <img src={profileImage} alt="Profile" className="profile_image" />
                        <input style={{ display: "none" }} id="image2" type="file" onChange={(e) => this.handleChange2(e)}></input>
                        <label style={{ fontWeight: '700' }} for="image2">Đổi ảnh</label>
                    </div>
                    <div className="form_section">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => this.setState({ username: e.target.value })}
                        />
                        <label>Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => this.setState({ bio: e.target.value })}
                        />
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => this.setState({ email: e.target.value })}
                        />
                        <button onClick={this.handleSave}>Save</button>
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => ({
    user: store.getState().userReducer.user,
});

const mapDispatchToProps = {
};


export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(withRouter(ProfileEdit)));