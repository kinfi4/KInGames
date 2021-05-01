import React, {useEffect} from 'react';
import {connect} from "react-redux";
import s from './Comments.module.css'
import {fetchTopLevelComments} from "../../../../redux/reducers/commentReducer";
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
    return (
        <div className={s.commentsBlock}>
            <AddCommentDialog slug={props.slug} />
            {
                props.comments.map((el, i) => <Comment key={i} comment={el} />)
            }
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        comments: state.comment.topLevelComments,
        user: state.auth.user
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        fetchTopLevelComments: (slug) => dispatch(fetchTopLevelComments(slug))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);