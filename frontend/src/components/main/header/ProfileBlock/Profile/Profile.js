import React from "react";
import s from './Profile.module.css'
import {connect} from "react-redux";
import {logout} from "../../../../../redux/reducers/authReducer";


let Profile = (props) => {
    return (
        <div className={s.profile}>
            <div className={s.profileInfo}>
                <div className={s.avatar}>IMG</div>
                Ilya Makarov
            </div>

            <div onClick={props.logout}>Logout</div>
        </div>
    )
}


let mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
