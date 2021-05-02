import React, {useState} from 'react';
import profile from '../../../../main/header/ProfileBlock/Profile/Profile.module.css'
import s from './Comment.module.css'
import {BASE_URL} from "../../../../../config";
import {BiDownArrow, BiUpArrow} from 'react-icons/all'
import {connect} from "react-redux";
import {fetchTopLevelCommentReplies} from "../../../../../redux/reducers/commentReducer";

const Comment = (props) => {
    const [manageButtonShow, setManageButtonShow] = useState(s.hidden)
    const [showReplies, setShowReplies] = useState(false)

    console.log(props.comment)

    let getShowRepliesButton = () => {
        if (props.comment.comment.replied_number === 0)
            return

        if(showReplies)
            return <><BiUpArrow /> Hide </>
        else
            return <><BiDownArrow />  {props.comment.comment.replied_number} Replies </>
    }

    let getReplies = () => {
        if(showReplies)
            return <>{props.comment.replies.map((el, i) => el.body)}</>
    }

    let onShowRepliesButtonClick = () => {
        let show = !showReplies
        setShowReplies(show)

        if(show)
            props.fetchReplies(props.comment.comment.id)
    }

    return (
        <>
            <div className={s.comment} onMouseEnter={() => setManageButtonShow(s.visible)} onMouseLeave={() => setManageButtonShow(s.hidden)}>
                <div className={profile.avatar} style={{backgroundImage: `url(${BASE_URL + props.comment.comment.user.kin_user.avatar.slice(1)})`,
                    backgroundPosition: "center",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'}}> </div>

                <div>
                    <div style={{fontSize: 'smaller', fontWeight: '600', marginBottom: '10px'}}>{props.comment.comment.user.first_name} {props.comment.comment.user.last_name}</div>
                    {props.comment.comment.body}

                    <div className={s.foldButton} onClick={onShowRepliesButtonClick}>
                        {getShowRepliesButton()}
                    </div>

                    <div className={s.repliesBlock}>
                        {getReplies()}
                    </div>
                </div>

                <div className={`${s.manageButtons} ${manageButtonShow}`}>
                    ...
                </div>
            </div>
        </>
    );
};

let mapStateToProps = (state) => {
    return {

    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        fetchReplies: (commentId) => dispatch(fetchTopLevelCommentReplies(commentId))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Comment);