import React, {useEffect, useLayoutEffect} from "react";
import s from './Profile.module.css'
import {connect} from "react-redux";
import {logout} from "../../../../../redux/reducers/authReducer";
import {loadUser} from "../../../../../redux/reducers/authReducer";
import {BASE_URL} from "../../../../../config";


let Profile = (props) => {
    return (
        <div className={s.profile}>
            <div className={s.profileInfo}>
                <div className={s.avatar} style={{backgroundImage: `url(${BASE_URL + props.user.kin_user.avatar.slice(1)})`,
                                                  backgroundPosition: "center",
                                                  backgroundRepeat: 'no-repeat',
                                                  backgroundSize: 'cover'}}> </div>
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
        logout: () => dispatch(logout),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
