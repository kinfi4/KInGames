import React from "react";
import s from './ManageProfileBlock.module.css'
import {connect} from "react-redux";
import {logout} from "../../../../../../redux/reducers/authReducer";
import {deleteAccount} from "../../../../../../utils/manageUser";
import {showModalWindow} from "../../../../../../redux/reducers/modalWindowReducer";
import EditProfileForm from "../EditProfile/EditProfileForm";

let ManageProfileBlock = (props) => {
    const additionClass = props.visible ? s.active : s.hidden

    let onAccountDelete = () => {
        if (window.confirm('Are you sure you want to delete your account? All the comments will be deleted as well')) {
            props.logout()
            deleteAccount()
        }
    }

    let onEditProfileButton = () => {
        props.showModalWindow(<EditProfileForm />, 650, 400)
    }

    return (
        <div className={s.manageProfileBlock + ` ${additionClass}`}>
            <div onClick={onEditProfileButton}>Edit Profile</div>
            <hr/>
            <div onClick={onAccountDelete}>Delete Account</div>
        </div>
    )
}

let mapStateToProps = (state) => {
    return {}
}

let mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout),
        showModalWindow: (content, width=null, height=null) => dispatch(showModalWindow(content, width, height))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageProfileBlock)