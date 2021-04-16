import React from "react";
import s from './Profile.module.css'
import {connect} from "react-redux";


let Profile = (props) => {
    return (
        <div className={s.profile}>
            <div className={s.profileInfo}>
                <div className={s.avatar}>IMG</div>
                Ilya Makarov
            </div>
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

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
