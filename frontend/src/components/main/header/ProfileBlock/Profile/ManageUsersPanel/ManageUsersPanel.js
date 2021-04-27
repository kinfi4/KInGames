import React, {useEffect} from 'react';
import s from './ManageUsersPanel.module.css'
import {connect} from "react-redux";
import {changeUserRole, fetchUsersList, manageSearchField} from "../../../../../../redux/reducers/usersListReducer";
import {BASE_URL} from "../../../../../../config";
import {BiSearchAlt} from "react-icons/all";
import UserProfile from "./UserProfileBlock/UserProfile";

const ManageUsersPanel = (props) => {
    useEffect(() => {
        props.fetchUsers()
    }, [])

    if(!props.users)
        return <div>LOADING</div>
    else
        return <ManageUsersPanelChild {...props} />
}

const ManageUsersPanelChild = (props) => {
    return (
        <div className={s.manageUsersPanel}>
            <div className={s.searchBlock}>
                <BiSearchAlt style={{fontSize: '25px'}} /> <input type="text" value={props.searchField} onInput={e => props.manageSearchField(e.target.value)}/>
            </div>
            <hr/>
            <div>
                {props.users.map((el, i) => <UserProfile key={i} user={el}/>)}
            </div>
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        searchField: state.users.searchField,
        users: state.users.users
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        fetchUsers: () => dispatch(fetchUsersList),
        manageSearchField: (text) => dispatch(manageSearchField(text))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsersPanel);