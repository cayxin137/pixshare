import React from "react";
import "./register.scss";
import register_image from "../../assets/images/register_image.png";
import logo1 from "../../assets/images/logo1.png";
import logo2 from "../../assets/images/logo2.png";
import { Link } from "react-router-dom";
import { createNewUser } from "../../services/userService";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

class Register extends React.Component {
    state = {
        style1: 'notfocus',
        style2: 'notfocus',
        style3: 'notfocus',
        style4: 'notfocus',
        style5: 'notfocus',
        email: '',
        fullname: '',
        username: '',
        password: '',
        passwordCF: '',
        showPassword1: false,
        showPassword2: false
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

    changeFocus3 = () => {
        this.setState({
            style3: 'focus3'
        })
    }

    changeFocus4 = () => {
        this.setState({
            style4: 'focus4'
        })
    }

    changeFocus5 = () => {
        this.setState({
            style5: 'focus5'
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

    changeNotFocus3 = () => {
        this.setState({
            style3: 'notfocus'
        })
    }

    changeNotFocus4 = () => {
        this.setState({
            style4: 'notfocus'
        })
    }

    changeNotFocus5 = () => {
        this.setState({
            style5: 'notfocus'
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrInput = ['email', 'fullname', 'username', 'password'];

        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                toast.error('Thiếu ' + arrInput[i])
                break;
            }
        }
        return isValid;
    }

    handleChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    handleAddNewUser = async () => {
        let data = {
            email: '',
            fullname: '',
            username: '',
            password: '',
            passwordCF: ''
        };

        let isValid = this.checkValidateInput();
        if (isValid === true) {
            data.email = this.state.email;
            data.username = this.state.username;
            data.fullname = this.state.fullname;
            data.password = this.state.password;
            data.passwordCF = this.state.passwordCF;
            try {
                if (data.password !== data.passwordCF) {
                    toast.error("Mật khẩu không trùng khớp");
                } else {
                    let response = await createNewUser(data);
                    if (response.data && response.data.errCode !== 0) {
                        toast.error(response.data.errMessage);
                    } else {
                        toast.success(response.data.errMessage);
                        this.setState({
                            email: '',
                            username: '',
                            fullname: '',
                            password: '',
                            passwordCF: '',
                        })
                    }
                }

            } catch (e) {
                console.log(e);
            }
        }

    }

    toggleShowPassword1 = () => {
        this.setState((prevState) => ({
            showPassword1: !prevState.showPassword1
        }));
    }

    toggleShowPassword2 = () => {
        this.setState((prevState) => ({
            showPassword2: !prevState.showPassword2
        }));
    }

    render() {
        let { style1, style2, style3, style4, style5 } = this.state;
        return (
            <div className="register_containter">
                <div className="register">
                    <div className="register_content">
                        <img className="logo1_register" src={logo1}></img>
                        <img className="logo2_register" src={logo2}></img>
                        <div className={`input_container ${style1}`}>
                            <input placeholder="Email"
                                onBlur={() => this.changeNotFocus1()}
                                onMouseDown={() => this.changeFocus1()}
                                onChange={(event) => this.handleChangeInput(event, 'email')}
                                value={this.state.email}
                            />
                        </div>
                        <div className={`input_container ${style2}`}>
                            <input placeholder="Tên đầy đủ"
                                onBlur={() => this.changeNotFocus2()}
                                onMouseDown={() => this.changeFocus2()}
                                onChange={(event) => this.handleChangeInput(event, 'fullname')}
                                value={this.state.fullname}
                            />
                        </div>
                        <div className={`input_container ${style3}`}>
                            <input placeholder="Tên người dùng"
                                onBlur={() => this.changeNotFocus3()}
                                onMouseDown={() => this.changeFocus3()}
                                onChange={(event) => this.handleChangeInput(event, 'username')}
                                value={this.state.username}
                            />

                        </div>
                        <div className={`input_container ${style4}`}>
                            <input placeholder="Mật khẩu"
                                onBlur={() => this.changeNotFocus4()}
                                onMouseDown={() => this.changeFocus4()}
                                onChange={(event) => this.handleChangeInput(event, 'password')}
                                type={this.state.showPassword1 ? "text" : "password"}
                                value={this.state.password}
                            />
                            <FontAwesomeIcon onClick={() => this.toggleShowPassword1()} icon={this.state.showPassword1 ? faEyeSlash : faEye} style={{ color: "450EE0", cursor: "pointer" }} />
                        </div>

                        <div className={`input_container ${style5}`}>
                            <input placeholder="Xác nhận mật khẩu"
                                onBlur={() => this.changeNotFocus5()}
                                onMouseDown={() => this.changeFocus5()}
                                onChange={(event) => this.handleChangeInput(event, 'passwordCF')}
                                type={this.state.showPassword2 ? "text" : "password"}
                                value={this.state.passwordCF}
                            />
                            <FontAwesomeIcon onClick={() => this.toggleShowPassword2()} icon={this.state.showPassword2 ? faEyeSlash : faEye} style={{ color: "450EE0", cursor: "pointer" }} />
                        </div>
                        <div className="register_button" onClick={() => this.handleAddNewUser()}>
                            Đăng ký
                        </div>
                        <div className="other_title">
                            <span className="line"></span>
                            <span className="text">Hoặc</span>
                        </div>
                        <span className="login_link_container">Bạn đã có tài khoản ? <Link to="/login" className="login_link">Đăng nhập</Link></span>
                    </div>
                    <img className="register_image" src={register_image}></img>
                </div>
            </div>
        )
    }
}

export default Register;