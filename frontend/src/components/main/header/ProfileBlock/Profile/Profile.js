import React from "react";
import s from './Profile.module.css'
import {connect} from "react-redux";
import {logout} from "../../../../../redux/reducers/authReducer";
import {BASE_URL} from "../../../../../config";


let Profile = (props) => {
    return (
        <div className={s.profile}>
            <div className={s.profileInfo}>
                <div className={s.avatar}><img src={BASE_URL + props.user.kin_user.avatar.slice(1)} alt=""/></div>
                {props.user.first_name} {props.user.last_name}
            </div>

            <div onClick={props.logout}>Logout</div>
        </div>
    )
}


let mapStateToProps = (state) => {
    console.log(state.auth.user)
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
