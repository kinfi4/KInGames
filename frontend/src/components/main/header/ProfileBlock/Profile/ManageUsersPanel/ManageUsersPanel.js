import React, {useCallback, useEffect, useRef} from 'react';
import s from './ManageUsersPanel.module.css'
import {connect} from "react-redux";
import {clearTheState, fetchUsersList, manageSearchField} from "../../../../../../redux/reducers/usersListReducer";
import {BiSearchAlt} from "react-icons/all";
import UserProfile from "./UserProfileBlock/UserProfile";

const ManageUsersPanel = (props) => {
    useEffect(() => {
        props.fetchUsers()

        return () => {
            props.clearUserState()
        }
    }, [])

    if(!props.users)
        return <div>LOADING</div>
    else
        return <ManageUsersPanelChild {...props} />
}

const ManageUsersPanelChild = (props) => {
    let observer = useRef()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    let lastUserRef = useCallback(node => {
        if(observer.current) {
            observer.current.disconnect()
        }

        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting){
                props.fetchUsers()
            }
        })

        if (node)
            observer.current.observe(node)
    })

    return (
        <div className={s.manageUsersPanel}>
            <div className={s.searchBlock}>
                <BiSearchAlt style={{fontSize: '25px'}} /> <input type="text" value={props.searchField} onInput={e => props.manageSearchField(e.target.value)}/>
            </div>
            <hr/>
            <div>
                {
                    props.users.map((el, i) => {
                        if(i === props.users.length - 1)
                            return <div ref={lastUserRef}><UserProfile key={i} user={el} /></div>
                        else
                            return <div><UserProfile key={i} user={el} /></div>
                    })
                }
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
        manageSearchField: (text) => dispatch(manageSearchField(text)),
        clearUserState: () => dispatch(clearTheState)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsersPanel);