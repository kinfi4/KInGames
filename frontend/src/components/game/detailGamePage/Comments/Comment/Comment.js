import React from 'react';
import profile from '../../../../main/header/ProfileBlock/Profile/Profile.module.css'
import s from './Comment.module.css'
import {BASE_URL} from "../../../../../config";
import {BiDownArrow} from 'react-icons/all'

const Comment = (props) => {
    return (
        <>
            <div className={s.comment}>
                <div className={profile.avatar} style={{backgroundImage: `url(${BASE_URL + props.comment.comment.user.kin_user.avatar.slice(1)})`,
                    backgroundPosition: "center",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'}}> </div>

                <div>
                    <div style={{fontSize: 'smaller', fontWeight: '600', marginBottom: '10px'}}>{props.comment.comment.user.first_name} {props.comment.comment.user.last_name}</div>
                    {props.comment.comment.body}
                </div>

                <div className={`${s.manageButtons}`}>
                    ...
                </div>
            </div>
            <div className={s.foldButton}><BiDownArrow /></div>
        </>
    );
};

export default Comment;