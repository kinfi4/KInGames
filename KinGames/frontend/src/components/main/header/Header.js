import React from "react";
import s from './Header.module.css'
import {connect} from "react-redux";
import ProfileBlock from "./ProfileBlock/ProfileBlock";
import {NavLink} from "react-router-dom";


let Header = (props) => {
    return (
        <header className={s.header}>
            <NavLink to={'/'}><div className={s.logo}> </div></NavLink>
            <nav className={s.navigation}>
                <NavLink to={'/'}><h3>Games</h3></NavLink>
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
