import React from "react";
import { faRotateLeft, faPhotoFilm } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";




class CreatePostPage1 extends React.Component {
    state = {
        dragActive: false,
    }

    handleChange = async (e) => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            await this.props.handleUploadImage(image);
        }
    };

    handleDragOver = (e) => {
        e.preventDefault();
        this.setState({ dragActive: true });
    };

    handleDragLeave = (e) => {
        e.preventDefault();
        this.setState({ dragActive: false });
    };

    handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            this.setState({ dragActive: false });
            this.props.handleUploadImage(file)
        }
    };



    render() {
        const { dragActive } = this.state;
        const { progress } = this.props;
        return (
            <div className="create_post_page">
                <div className="create_post_header" id="page1">
                    <span>Tạo bài viết</span>
                </div>
                <div className="create_post_main">
                    <div className="create_post_drag_container"
                        onDragOver={this.handleDragOver}
                        onDragLeave={this.handleDragLeave}
                        onDrop={this.handleDrop}
                    >
                        <div className="create_post_drag">
                            <FontAwesomeIcon style={{ color: dragActive ? '#E7366B' : 'black' }} icon={faPhotoFilm} />
                            <span>Kéo ảnh và video vào đây</span>
                        </div>
                        <input style={{ display: "none" }} id="image" placeholder="Chọn từ máy tính" type="file" onChange={this.handleChange}></input>
                        <label for="image">Chọn từ máy tính</label>
                    </div>

                </div>

            </div>
        )
    }
}

export default CreatePostPage1;