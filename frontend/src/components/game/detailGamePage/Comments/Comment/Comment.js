import React, {useState} from 'react';
import profile from '../../../../main/header/ProfileBlock/Profile/Profile.module.css'
import s from './Comment.module.css'
import {ADMIN, BASE_URL, MANAGER} from "../../../../../config";
import {BiDownArrow, BiUpArrow, AiFillEdit, AiTwotoneDelete} from 'react-icons/all'
import {connect} from "react-redux";
import {
    fetchTopLevelCommentReplies,
    manageDeletedComments
} from "../../../../../redux/reducers/commentReducer";

const Comment = (props) => {
    const [manageButtonShow, setManageButtonShow] = useState(s.hidden)
    const [showReplies, setShowReplies] = useState(false)
    const [showCommentManagerDialog, setShowCommentManager] = useState(false)

    const getDeleteButton = () => {
        return (
            <div onClick={() => {
                if(window.confirm('Are you sure you want to delete comment?')){
                    props.manageDeleted([...props.deleted, props.comment.comment.id])
                }
            }}><AiTwotoneDelete /> DELETE</div>
        )
    }

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

        let showCommentManager = () => {
        let showAvailableActions = () => {
            if(props.user.username === props.comment.comment.user.username)
                return (
                    <>
                        <div><AiFillEdit /> EDIT</div>
                        <hr/>
                        {getDeleteButton()}
                    </>
                )
            else if(props.user.kin_user.role === ADMIN || props.user.kin_user.role === MANAGER)
                return getDeleteButton()

        }


        if(showCommentManagerDialog)
            return (
                <div className={s.manageButtons}>
                    {showAvailableActions()}
                </div>
            )
    }

    return (
        <>
            <div className={s.comment} onMouseEnter={() => {
                    setManageButtonShow(s.visible)
            }} onMouseLeave={() => {
                if(showCommentManagerDialog)
                    setManageButtonShow(s.visible)
                else
                    setManageButtonShow(s.hidden)
            }}>
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

                    <div>
                        {getReplies()}
                    </div>
                </div>

                <div className={`${s.manageButtonsBlock} ${manageButtonShow}`} onClick={() => {
                    let show = !showCommentManagerDialog
                    setShowCommentManager(show)
                }}>
                    ...
                    {showCommentManager()}
                </div>
            </div>
        </>
    );
};

let mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        deleted: state.comment.deletedComments
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        fetchReplies: (commentId) => dispatch(fetchTopLevelCommentReplies(commentId)),
        manageDeleted: (deletedComments) => dispatch(manageDeletedComments(deletedComments))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Comment);