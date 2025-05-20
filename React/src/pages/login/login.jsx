import React from "react";
import "./login.scss";
import login_image from "../../assets/images/login_image.png";
import logo1 from "../../assets/images/logo1.png";
import logo2 from "../../assets/images/logo2.png";
import { Link } from "react-router-dom";
import { handleLogin } from "../../services/userService";
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import { login, changeLogginState } from "../../redux/slices/userSlice";
import { withNavigation } from "../../utils/navigate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


class Login extends React.Component {

    state = {
        style1: 'notfocus',
        style2: 'notfocus',
        userLogin: '',
        password: '',
        showPassword: false
    }

    changeFocus1 = () => {
        this.setState({
            style1: 'focus1'
        })
    }

    changeFocus2 = () => {
        this.setState({
            style2: 'focus2'
        })
    }


    changeNotFocus1 = () => {
        this.setState({
            style1: 'notfocus',
        })
    }

    changeNotFocus2 = () => {
        this.setState({
            style2: 'notfocus'
        })
    }

    handleChangeUserLogin = (event) => {
        this.setState({
            userLogin: event.target.value
        })
    }

    handleChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleLogin = async (e) => {
        e.preventDefault();
        try {

            let data = await handleLogin(this.state.userLogin, this.state.password).then(res => {
                return res.data;
            });

            if (data && data.errCode == 0) {
                toast.success('Đăng nhập thành công');
                this.props.login({
                    userId: data.user.id,
                    email: data.user.email,
                    username: data.user.username
                })
                this.props.changeLogginState(true);
                this.props.navigate("/", { state: { prevPath: window.location.pathname } });

            }
            else if (data && data.errCode !== 0) {
                toast.error(data.message);
            }
        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    toast.error(e.response.data.message);
                }
            }
        }
    }

    toggleShowPassword = () => {
        this.setState((prevState) => ({
            showPassword: !prevState.showPassword
        }));
    }

    render() {
        let { style1, style2 } = this.state;
        return (
            <div className="login_containter">
                <div className="login">
                    <img className="login_image" src={login_image}></img>
                    <div className="login_content">
                        <img className="logo1_login" src={logo1}></img>
                        <img className="logo2_login" src={logo2}></img>
                        <div className={`input_container ${style1}`}>
                            <input
                                placeholder="Số điện thoại, tên người dùng hoặc email"
                                onBlur={() => this.changeNotFocus1()}
                                onMouseDown={() => this.changeFocus1()}
                                value={this.state.userLogin}
                                onChange={(event) => this.handleChangeUserLogin(event)}
                            />
                        </div>
                        <div className={`input_container ${style2}`}>
                            <input
                                placeholder="Mật khẩu"
                                onBlur={() => this.changeNotFocus2()}
                                onMouseDown={() => this.changeFocus2()}
                                value={this.state.password}
                                onChange={(event) => this.handleChangePassword(event)}
                                type={this.state.showPassword ? "text" : "password"}
                            />
                            <FontAwesomeIcon onClick={() => this.toggleShowPassword()} icon={this.state.showPassword ? faEyeSlash : faEye} style={{ color: "E7366B", cursor: "pointer" }} />
                        </div>
                        <div className="login_button" onClick={(e) => this.handleLogin(e)}>
                            Đăng nhập
                        </div>
                        <div className="other_title">
                            <span className="line"></span>
                            <span className="text">Hoặc</span>
                        </div>
                        <span className="register_link_container">Bạn chưa có tài khoản ? <Link to="/register" className="register_link">Đăng ký</Link></span>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
    login,
    changeLogginState
};

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Login));
