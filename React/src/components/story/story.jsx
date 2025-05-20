import React from "react";
import "./story.scss";
import { getUser } from "../../services/userService";

import blank_avatar from "../../assets/images/blank_avatar.png"

class Story extends React.Component {
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
        const limitUser = listUser.slice(0, 7);
        return (
            <div className="story">
                {
                    limitUser.map((item, index) => {
                        return (
                            <div className="story_item_container">
                                {
                                    item.profile_picture_url === null
                                        ? <img src={blank_avatar} className="story_item" />
                                        : <img src={item.profile_picture_url} className="story_item" />
                                }
                            </div>
                        )
                    })
                }

            </div>
        )
    }
}

export default Story;