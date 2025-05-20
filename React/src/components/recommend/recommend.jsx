import React from "react";
import "./recommend.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import icon_recommend from "../../assets/images/icon/icon_recommend.png";
import avatar3 from "../../assets/images/avatar3.png";
import { getUser } from "../../services/userService";
import { connect } from "react-redux";
import { store } from "../../redux/store";

import blank_avatar from "../../assets/images/blank_avatar.png"
import { Link } from "react-router-dom";

class Recommend extends React.Component {
    state = {
        listUser: []
    }

    componentDidMount() {
        this.fetchUser();
    }

    fetchUser = async () => {
        try {
            let users = await getUser('ALL');
            this.setState({
                listUser: users && users.data && users.data.users ? users.data.users : []
            })
        } catch (e) {
            console.log(e.response.data.errMessage)
        }
    }


    render() {
        const { listUser } = this.state;
        const filterUser = listUser.filter(item => item.id !== this.props.user.userId)
        return (
            <div className="recommend">
                <div className="title">
                    <FontAwesomeIcon icon={faUserPlus} />
                    Gợi ý cho bạn
                </div>
                {filterUser.map((item, index) => {
                    return (
                        <Link to={'/' + item.username} className="recommend_item">
                            <div className="recommend_content">
                                {
                                    item.profile_picture_url === null
                                        ? <img src={blank_avatar} />
                                        : <img src={item.profile_picture_url} alt="" />
                                }

                                <div className="recommend_info">
                                    <span className="user_name">{item.username}</span>
                                    <span className="recommend_by">{item.full_name}</span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: store.getState().userReducer.user
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Recommend);