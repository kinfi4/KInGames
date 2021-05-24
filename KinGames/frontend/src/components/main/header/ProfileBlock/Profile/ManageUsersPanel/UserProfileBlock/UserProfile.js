import React, {useState} from 'react';
import s from './UserProfile.module.css'
import {ADMIN, BASE_URL, MANAGER, USER} from "../../../../../../../config";
import {changeUserRole} from "../../../../../../../redux/reducers/usersListReducer";
import {connect} from "react-redux";

const UserProfile = (props) => {
    let initRole;
    if(props.user.kin_user.role === ADMIN)
        initRole = ADMIN
    else if (props.user.kin_user.role === MANAGER)
        initRole = MANAGER
    else
        initRole = USER

    const [userRole, setUserRole] = useState(initRole)
    let changeUserRole = () => {
        let new_role = userRole === USER ? MANAGER : USER
        setUserRole(new_role)
        props.changeUserRole(props.user.username, new_role)
    }

    let manageButtons = () => {
        if(userRole === ADMIN)
            return <div>ADMIN</div>
        else{
            let managerClass = userRole === MANAGER ? s.chosen : ''
            let userClass = userRole === USER ? s.chosen : ''
            return (
                <div className={s.buttons} onClick={changeUserRole}>
                    <div className={`${s.button} ${managerClass}`}>Manager</div>
                    <div className={`${s.button} ${userClass}`}>User</div>
                </div>
            )
        }
    }
    return (
        <>
            <div className={s.usersBlock}>
                <div className={s.profileInfo}>
                    <img src={BASE_URL + props.user.kin_user.avatar.slice(1)} alt="avatar" className={s.avatar}/>
                    <div className={s.names}>
                        {props.user.first_name} {props.user.last_name}
                    </div>
                </div>
                <div className={s.manageButtons}>
                    {manageButtons()}
                </div>
            </div>
            <hr/>
        </>
    );
};

let mapDispatchToProps = (dispatch) => {
    return {changeUserRole: (username, role) => dispatch(changeUserRole(username, role))}

}


export default connect(() => {}, mapDispatchToProps)(UserProfile);