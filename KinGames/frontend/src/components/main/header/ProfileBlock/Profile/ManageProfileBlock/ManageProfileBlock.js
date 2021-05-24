import React from "react";
import s from './ManageProfileBlock.module.css'
import {connect} from "react-redux";
import {logout} from "../../../../../../redux/reducers/authReducer";
import {deleteAccount} from "../../../../../../utils/manageUser";
import {showModalWindow} from "../../../../../../redux/reducers/modalWindowReducer";
import EditProfileForm from "../EditProfile/EditProfileForm";
import {ADMIN} from "../../../../../../config";
import ManageUsersPanel from "../ManageUsersPanel/ManageUsersPanel";

let ManageProfileBlock = (props) => {
    const additionClass = props.visible ? s.active : s.hidden

    let manageUsersButton = () => {
        if(props.user.kin_user.role === ADMIN)
            return (
                <>
                    <div onClick={manageUserButtonClick}>Manage Users</div>
                    <hr/>
                </>
            )
    }

    let manageUserButtonClick = () => {
        props.showModalWindow(<ManageUsersPanel />, 500, 700)
    }

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
            {manageUsersButton()}
            <div onClick={onAccountDelete}>Delete Account</div>
        </div>
    )
}

let mapStateToProps = (state) => {
    return {user: state.auth.user}
}

let mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout),
        showModalWindow: (content, width=null, height=null) => dispatch(showModalWindow(content, width, height))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageProfileBlock)