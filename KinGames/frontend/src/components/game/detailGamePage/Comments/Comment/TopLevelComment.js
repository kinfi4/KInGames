import React, {useState} from "react";
import {BiDownArrow, BiUpArrow} from "react-icons/all";
import s from "./Comment.module.css";
import commentsPage from './../Comments.module.css'
import Comment from "./Comment";
import {connect} from "react-redux";
import {
    fetchTopLevelCommentReplies,
    manageDeletedComments
} from "../../../../../redux/reducers/commentReducer";

const TopLevelComment = (props) => {
    const [showReplies, setShowReplies] = useState(false)
    const thisFullComment = props.comments.filter(el => el.comment.id === props.topLevelCommentId)[0]


    const getShowRepliesButton = () => {
        if (thisFullComment.comment.replied_number === 0)
            return

        if(showReplies)
            return <><BiUpArrow /> Hide </>
        else
            return <><BiDownArrow />  {thisFullComment.comment.replied_number} Replies </>
    }
    const getReplies = () => {
        if(showReplies){
            return <>
                {thisFullComment.replies.map((el, i) => {
                    if(el && props.deleted.includes(el.id))
                        return (
                            <div onClick={() => props.manageDeleted(props.deleted.filter(c => c !== el.id))} className={commentsPage.undoButton}>
                                UNDO
                            </div>
                        )
                    else
                        return <Comment comment={el} key={i} isInner={true} slug={props.slug} />
                })} </>
        }
    }

    const onShowRepliesButtonClick = () => {
        let show = !showReplies
        setShowReplies(show)

        if(show)
            props.fetchReplies(thisFullComment.comment.id)
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
        deleted: state.comment.deletedComments,
        comments: state.comment.topLevelComments
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        manageDeleted: (deletedComments) => dispatch(manageDeletedComments(deletedComments)),
        fetchReplies: (commentId) => dispatch(fetchTopLevelCommentReplies(commentId)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TopLevelComment)