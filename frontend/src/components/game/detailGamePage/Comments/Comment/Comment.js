import React, {useEffect, useState} from 'react';
import profile from '../../../../main/header/ProfileBlock/Profile/Profile.module.css'
import s from './Comment.module.css'
import {ADMIN, BASE_URL, MANAGER} from "../../../../../config";
import {BiDownArrow, BiUpArrow, AiFillEdit, AiTwotoneDelete} from 'react-icons/all'
import {connect} from "react-redux";
import {
    fetchTopLevelCommentReplies,
    manageDeletedComments, manageShowManageButtons
} from "../../../../../redux/reducers/commentReducer";


const Comment = (props) => {
    useEffect(() => {
        props.showManageButtonsForId === props.comment.id ? setManageButtonShow(s.visible) : setManageButtonShow(s.hidden)

    }, [props.showManageButtonsForId])

    const [manageButtonShow, setManageButtonShow] = useState(s.hidden)

    const getDeleteButton = () => {
        return (
            <div onClick={() => {
                if(window.confirm('Are you sure you want to delete comment?')){
                    props.manageDeleted([...props.deleted, props.comment.id])
                }
            }}><AiTwotoneDelete /> DELETE</div>
        )
    }
    const showCommentManager = () => {
        let showAvailableActions = () => {
            if(props.user.username === props.comment.user.username)
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

        if(props.showManageButtons && props.showManageButtonsForId === props.comment.id)
            return (
                <div className={s.manageButtons}>
                    {showAvailableActions()}
                </div>
            )
    }
    const showManageShowButton = () => {
        if(props.user)
            return (
                <div className={`${s.manageButtonsBlock} ${manageButtonShow}`} onClick={() => {
                    let show = props.showManageButtonsForId === props.comment.id ? !props.showManageButtons : true
                    props.manageShowManageButtons({id: props.comment.id, show: show})
                }}>
                    ...
                    {showCommentManager()}
                </div>
            )
    }
    const getInnerPart = () => {
        if(!props.isInner)
            return (
                <div style={{marginLeft: '5%'}}>
                    <TopLevelComment {...props} />
                </div>
            )
    }

    return (
        <>
            <div className={`${s.comment} ${props.isInner ? s.inner : ''}`} onMouseEnter={() => {
                    setManageButtonShow(s.visible)
            }} onMouseLeave={() => {
                if(props.showManageButtons && props.showManageButtonsForId === props.comment.id)
                    setManageButtonShow(s.visible)
                else
                    setManageButtonShow(s.hidden)
            }} id={props.comment.id}>
                <div className={profile.avatar} style={{backgroundImage: `url(${BASE_URL + props.comment.user.kin_user.avatar.slice(1)})`,
                    backgroundPosition: "center",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'}}> </div>

                <div>
                    <div style={{fontSize: 'smaller', fontWeight: '600', marginBottom: '10px'}}>{props.comment.user.first_name} {props.comment.user.last_name}</div>
                    {props.comment.body}
                </div>

                <div>
                    {showManageShowButton()}
                </div>
            </div>
            {getInnerPart()}
        </>
    );
};

const TopLevelComment = (props) => {
    const [showReplies, setShowReplies] = useState(false)

    const getShowRepliesButton = () => {
        if (props.comment.replied_number === 0)
            return

        if(showReplies)
            return <><BiUpArrow /> Hide </>
        else
            return <><BiDownArrow />  {props.comment.replied_number} Replies </>
    }
    const getReplies = () => {
        if(showReplies)
            return <>{props.replies.map((el, i) => <Comment comment={el} key={i} isInner={true} user={props.user}
                                                                       manageShowManageButtons={props.manageShowManageButtons}
                                                                       showManageButtons={props.showManageButtons}
                                                                       showManageButtonsForId={props.showManageButtonsForId} /> )}</>
    }

    const onShowRepliesButtonClick = () => {
        let show = !showReplies
        setShowReplies(show)

        if(show)
            props.fetchReplies(props.comment.id)
    }

    return (
        <>
            <div className={s.foldButton} onClick={onShowRepliesButtonClick}>
                {getShowRepliesButton()}
            </div>

            <div>
                {getReplies()}
            </div>
        </>
    )
}


let mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        deleted: state.comment.deletedComments,
        showManageButtonsForId: state.comment.showManageButtonsForId,
        showManageButtons: state.comment.showManageButtons
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        fetchReplies: (commentId) => dispatch(fetchTopLevelCommentReplies(commentId)),
        manageDeleted: (deletedComments) => dispatch(manageDeletedComments(deletedComments)),
        manageShowManageButtons: (showManageButtonsForId) => dispatch(manageShowManageButtons(showManageButtonsForId))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Comment);