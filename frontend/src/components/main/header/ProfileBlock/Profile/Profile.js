import React, {useState} from "react";
import s from './Profile.module.css'
import s2 from './../ProfileBlock.module.css'
import {connect} from "react-redux";
import {logout} from "../../../../../redux/reducers/authReducer";
import {BASE_URL} from "../../../../../config";
import {FiLogOut, RiShoppingCart2Fill} from "react-icons/all";
import ManageProfileBlock from "./ManageProfileBlock/ManageProfileBlock";


let Profile = (props) => {
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

            <div><RiShoppingCart2Fill />0</div>

            <div onClick={props.logout} className={s2.greyButton}><FiLogOut /></div>
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
