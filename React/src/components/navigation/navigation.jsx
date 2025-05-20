import React from "react";
import "./navigation.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCompass, faComment, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import { getUser } from "../../services/userService";
import blank_avatar from "../../assets/images/blank_avatar.png"
import { logout, changeLogginState } from "../../redux/slices/userSlice";
import { connect } from "react-redux";
import { withNavigation } from "../../utils/navigate";
import { removeUser } from "../../redux/slices/chatSlice";

class Navigation extends React.Component {
    state = {
        user: {}
    }

    async componentDidMount() {

        this.fetchUser(this.props.userId)

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
    handleLogout = () => {
        this.props.logout();
        this.props.changeLogginState(false);
        this.props.removeUser();
        this.props.navigate('/login');
        window.location.reload();
    }

    homeClick = () => {
        document.body.style.overflow = '';
    }

    render() {
        let { user } = this.state;
        return (
            <div className="navigation">
                <div className="menu_container">
                    <NavLink onClick={() => this.homeClick()} to="/" className="menu_item">
                        <FontAwesomeIcon icon={faHome} />
                        Trang chủ
                    </NavLink>
                    <NavLink to="/discovery" className="menu_item">
                        <FontAwesomeIcon icon={faCompass} />
                        Khám phá
                    </NavLink>
                    <NavLink to="/chat" className="menu_item">
                        <FontAwesomeIcon icon={faComment} />
                        Tin nhắn
                    </NavLink>
                    <NavLink to={'/' + user.username} className="menu_item">
                        {user.profile_picture_url === null
                            ?
                            <img className="menu_user_avatar" src={blank_avatar} alt="" />
                            :
                            <img className="menu_user_avatar" src={user.profile_picture_url} alt="" />
                        }

                        Trang cá nhân
                    </NavLink>
                    <div className="logout" onClick={() => this.handleLogout()}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        Đăng xuất
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
    logout,
    changeLogginState,
    removeUser
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Navigation));