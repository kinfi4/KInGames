import React, {useEffect, useState} from 'react';
import s from "./Comments.module.css";
import profile from "../../../main/header/ProfileBlock/Profile/Profile.module.css";
import {BASE_URL} from "../../../../config";
import {connect} from "react-redux";
import {
    addComment,
    manageShowReplyInput,
    manageUpdateObject,
    updateComment
} from "../../../../redux/reducers/commentReducer";


const AddCommentDialog = (props) => {
    const [commentText, setCommentText] = useState(props.initText ? props.initText : '')
    const inputTextRef = React.createRef()

    useEffect(() => {
        if(inputTextRef.current)
            inputTextRef.current.textContent = commentText
    }, [])

    const onSubmitComment = () => {
        if(props.onUpdate){
            console.log('submit')
            props.updateComment(props.id, commentText)
            props.manageUpdateObject({onUpdate: false, updatedId: null})
        }
        else{
            props.addComment(props.slug, commentText, props.top_level_comment, props.replied_comment)
        }

        setCommentText('')
        inputTextRef.current.textContent = ''
    }
    const getSendButton = () => {
        const stripedContent = commentText.replace(/^s+|s+$/g, '')
        const saveButtonClass = stripedContent.length === 0 ? `${s.unactive}` : ``
        if(props.onUpdate){
            return (
                <div className={s.manageCommentBlock}>
                    <div onClick={() => props.manageUpdateObject({onUpdate: false, updatedId: null})}>CANCEL</div>
                    <div onClick={onSubmitComment} className={saveButtonClass}>SAVE</div>
                </div>
            )
        }
        else
            return (
                    <div className={s.manageCommentBlock}>
                        <div onClick={() => props.manageShowReply({show: false, commentId: null})}>CANCEL</div>
                        <div onClick={onSubmitComment} className={saveButtonClass}>COMMENT</div>
                    </div>
                )

    }

    if(props.user)
        return (
            <>
                <div className={s.commentDialog}>
                    <div className={profile.avatar} style={{backgroundImage: `url(${BASE_URL + props.user.kin_user.avatar.slice(1)})`,
                        backgroundPosition: "center",
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover'}} />

                    <div className={s.textInput} contentEditable={true} data-placeholder={'Enter your comment'}
                         onInput={(e) => setCommentText(e.target.innerText)}
                         ref={inputTextRef}> </div>
                </div>

                {getSendButton()}
                <br/>
            </>
        );
    else
        return (
            <div style={{color: '#ffa3a3'}}>You need to authenticate in order to leave comments</div>
        )
};

let mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        updateObject: state.comment.updateObject,
        showReplyInput: state.comment.showReplyInput
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        addComment: (gameSlug, body, top_level_comment, replied_comment) => dispatch(addComment(gameSlug, body, top_level_comment, replied_comment)),
        updateComment: (id, body) => dispatch(updateComment(id, body)),
        manageUpdateObject: (newUpdateObj) => dispatch(manageUpdateObject(newUpdateObj)),
        manageShowReply: (newReplyInput) => dispatch(manageShowReplyInput(newReplyInput))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AddCommentDialog);