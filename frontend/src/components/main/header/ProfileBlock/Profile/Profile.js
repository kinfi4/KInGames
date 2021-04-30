import React, {useEffect, useState} from "react";
import s from './Profile.module.css'
import s2 from './../ProfileBlock.module.css'
import {connect} from "react-redux";
import {logout} from "../../../../../redux/reducers/authReducer";
import {BASE_URL} from "../../../../../config";
import {FiLogOut, RiShoppingCart2Fill} from "react-icons/all";
import ManageProfileBlock from "./ManageProfileBlock/ManageProfileBlock";
import {fetchCartSize} from "../../../../../redux/reducers/cartReducer";
import {NavLink} from "react-router-dom";


let Profile = (props) => {
    useEffect(() => {
        props.fetchCartSize()
    }, [])

    const [manageButtonsShow, setManageButtonsShow] = useState(false)

    return (
        <div className={s.profile}>
            <div className={s.profileInfo} onMouseEnter={() => setManageButtonsShow(true)} onMouseLeave={() => setManageButtonsShow(false)}>
                <div className={s.avatar} style={{backgroundImage: `url(${BASE_URL + props.user.kin_user.avatar.slice(1)})`,
                                                  backgroundPosition: "center",
                                                  backgroundRepeat: 'no-repeat',
                                                  backgroundSize: 'cover'}}> </div>
                {props.user.first_name} {props.user.last_name}

                <ManageProfileBlock visible={manageButtonsShow} />
            </div>

            <NavLink to={'/cart'} className={s2.greyButton}><RiShoppingCart2Fill />{props.cartSize}</NavLink>
            <div onClick={props.logout} className={s2.greyButton}><FiLogOut /></div>
        </div>
    )
}


let mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user,
        cartSize: state.cart.cartSize
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout),
        fetchCartSize: () => dispatch(fetchCartSize)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
