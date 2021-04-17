import React from "react";
import s from './Header.module.css'
import {connect} from "react-redux";
import ProfileBlock from "./ProfileBlock/ProfileBlock";


let Header = (props) => {
    return (
        <header className={s.header}>
            <div className={s.logo}> </div>
            <nav className={s.navigation}>
                <h3>Games</h3>
                <h3>Community</h3>
                <h3>About</h3>
                <h3>Support</h3>
            </nav>

            <ProfileBlock />
        </header>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header)
