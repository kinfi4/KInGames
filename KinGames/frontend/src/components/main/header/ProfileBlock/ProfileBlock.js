import React, {useEffect} from "react";
import s from './ProfileBlock.module.css'
import {connect} from "react-redux";
import {showModalWindow} from "../../../../redux/reducers/modalWindowReducer";
import LoginForm from "../../../accounts/LoginForm";
import Profile from "./Profile/Profile";
import {NavLink} from "react-router-dom";
import s2 from "./ProfileBlock.module.css";
import {RiShoppingCart2Fill} from "react-icons/all";
import {fetchCartSize} from "../../../../redux/reducers/cartReducer";


let ProfileBlock = (props) => {
    useEffect(() => {
        props.fetchCartSize()
    }, [])

    let get_block_content = () => {
        if(!props.isAuthenticated)
            return (
                <div style={{display: 'flex', alignItems: 'center', textAlign: 'center'}}>
                    <NavLink to={'/cart'} className={s2.greyButton} style={{marginRight: '10px'}}><RiShoppingCart2Fill />{props.cartSize}</NavLink>
                    <div className={s.greyButton} onClick={() => props.showModalWindow(<LoginForm />, 500, 540)}>Sing in</div>
                </div>
            )
        else
            return <Profile />
    }
    return (
        <div className={s.profileBlock}>
            {get_block_content()}
        </div>
    )
}


let mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        cartSize: state.cart.cartSize
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        showModalWindow: (content, width, height) => dispatch(showModalWindow(content, width, height)),
        fetchCartSize: () => dispatch(fetchCartSize)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBlock)
