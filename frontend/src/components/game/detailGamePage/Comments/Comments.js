import React, {useEffect} from 'react';
import {connect} from "react-redux";
import s from './Comments.module.css'
import {
    deleteChosenComments,
    fetchTopLevelComments,
    manageDeletedComments
} from "../../../../redux/reducers/commentReducer";
import Comment from "./Comment/Comment";
import AddCommentDialog from "./AddCommentDialog";


const Comments = (props) => {
    useEffect(() => {
        props.fetchTopLevelComments(props.slug)
    }, [])
    return (
        props.comments && <CommentsChild {...props} />
    );
};

const CommentsChild = (props) => {
    useEffect(() => {
        return () => {
            props.deleteChosenComments()
        }
    }, [])

    return (
        <div className={s.commentsBlock}>
            <AddCommentDialog slug={props.slug} />

            {
                props.comments.map((el, i) => {
                    if(el.comment && props.deleted.includes(el.comment.id))
                        return (
                            <div onClick={() => props.manageDeleted(props.deleted.filter(c => c !== el.comment.id))} className={s.undoButton}>
                                UNDO
                            </div>
                        )
                    else
                        return <Comment key={i} comment={el.comment} replies={el.replies} />
                })
            }
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        comments: state.comment.topLevelComments,
        user: state.auth.user,
        deleted: state.comment.deletedComments
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        fetchTopLevelComments: (slug) => dispatch(fetchTopLevelComments(slug)),
        manageDeleted: (deletedComments) => dispatch(manageDeletedComments(deletedComments)),
        deleteChosenComments: () => dispatch(deleteChosenComments)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);