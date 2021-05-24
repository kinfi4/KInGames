import axios from "axios";
import {BASE_URL} from "../../config";
import {FETCH_ERROR} from "./gameListReducer";
import {showMessage} from "../../utils/messages";


axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const FETCH_TOP_LEVEL_COMMENTS = 'FETCH_TOP_LEVEL_COMMENTS'
const FETCH_COMMENT_REPLIES = 'FETCH_COMMENT_REPLIES'
const MANAGE_DELETED_COMMENTS = 'MANAGE_DELETED_COMMENTS'
const MANAGE_SHOW_MANAGE_BUTTONS = 'MANAGE_SHOW_MANAGE_BUTTONS'
const UPDATE_COMMENT = 'UPDATE_COMMENT'
const MANAGE_UPDATE_OBJECT = 'MANAGE_UPDATE_OBJECT'
const MANAGE_SHOW_REPLY_INPUT = 'MANAGE_SHOW_REPLY_INPUT'
const ON_ADD_COMMENT = 'ON_ADD_COMMENT'
const MANAGE_BLINKING = 'MANAGE_BLINKING'


const initialState = {
    topLevelComments: [{comment: null, replies: []}],
    deletedComments: [],
    showManageButtonsForId: null,
    showManageButtons: false,
    updateObject: {onUpdate: false, updatedId: null},
    showReplyInput: {show: false, commentId: null},
    showBlinking: {show: false, commentId: null}
}

export const fetchTopLevelComments = (gameSlug) => (dispatch) => {
    axios.get(BASE_URL + 'api/v1/comments?game_slug=' + gameSlug)
        .then(res => dispatch({type: FETCH_TOP_LEVEL_COMMENTS, comments: res.data}))
        .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}

export const fetchTopLevelCommentReplies = (id) => (dispatch) => {
    axios.get(BASE_URL + 'api/v1/comments/' + id)
        .then(res => dispatch({type: FETCH_COMMENT_REPLIES, commentId: id, replies: res.data}))
}

export const addComment = (gameSlug, body, top_level_comment, replied_comment) => (dispatch) => {
    const token = localStorage.getItem('token')
    if(!token){
        showMessage([{message: 'You must authenticate to comment', type: 'danger'}])
        return
    }

    let data = JSON.stringify({
        game_slug: gameSlug,
        body,
        top_level_comment_id: top_level_comment,
        replies_on_comment: replied_comment
    })

    axios.post(BASE_URL + 'api/v1/comments', data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    }).then(res => dispatch({type: ON_ADD_COMMENT, comment: res.data}))
      .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}

export const deleteComment = (id) => (dispatch) => {
    const token = localStorage.getItem('token')
    if(!token){
        showMessage([{message: 'You must authenticate to comment', type: 'danger'}])
        return
    }

    axios.delete(BASE_URL + 'api/v1/comments/' + id, {
        headers: {'Authorization': `Token ${token}`}
    }).catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}

export const manageDeletedComments = (deletedComments) => (dispatch) => {
    dispatch({type: MANAGE_DELETED_COMMENTS, deletedComments: deletedComments})
}

export const deleteChosenComments = (dispatch, getState) => {
    let deletedComments = getState().comment.deletedComments

    for (let i = 0; i < deletedComments.length; i++) {
        dispatch(deleteComment(deletedComments[i]))
    }

    dispatch(manageDeletedComments([]))
}

export const manageShowManageButtons = (showManageButtonsObject) => (dispatch) => {
    dispatch({type: MANAGE_SHOW_MANAGE_BUTTONS, showManageButtonsObject})
}

export const updateComment = (id, newBody) => (dispatch) => {
    const token = localStorage.getItem('token')

    axios.put(BASE_URL + 'api/v1/comments/' + id, JSON.stringify({body: newBody}), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    }).then(res => dispatch({type: UPDATE_COMMENT, body: res.data.body, commentId: id}))
        .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}

export const manageUpdateObject = (newUpdateObject) => (dispatch) => {
    console.log(`Managing in action ${newUpdateObject.onUpdate}`)
    dispatch({type: MANAGE_UPDATE_OBJECT, updateObject: newUpdateObject})
}

export const manageShowReplyInput = (newReplyInput) => (dispatch) => {
    dispatch({type: MANAGE_SHOW_REPLY_INPUT, showReplyInput: newReplyInput})
}

export const manageBlinking = (newBlinkObject) => (dispatch) => {
    dispatch({type: MANAGE_BLINKING, newBlinkObject: newBlinkObject})
}


export const commentReducer = (state=initialState, action) => {
    switch (action.type){
        case FETCH_TOP_LEVEL_COMMENTS:
            const comments = action.comments.map(el => {return {comment: el, replies: []}})
            return {...state, topLevelComments: comments}
        case FETCH_COMMENT_REPLIES:
            const commentsWithReplies = state.topLevelComments.map(el => {
                return el.comment.id === action.commentId ? {...el, replies: action.replies} : el
            })
            return {...state, topLevelComments: commentsWithReplies}
        case MANAGE_DELETED_COMMENTS:
            return {...state, deletedComments: action.deletedComments}
        case MANAGE_SHOW_MANAGE_BUTTONS:
            return {...state, showManageButtonsForId: action.showManageButtonsObject.id, showManageButtons: action.showManageButtonsObject.show}
        case MANAGE_UPDATE_OBJECT:
            return {...state, updateObject: action.updateObject}
        case MANAGE_SHOW_REPLY_INPUT:
            return {...state, showReplyInput: action.showReplyInput}
        case MANAGE_BLINKING:
            return {...state, showBlinking: action.newBlinkObject}
        case ON_ADD_COMMENT:
            let newComments = [...state.topLevelComments]

            if(action.comment.top_level_comment === null){
                newComments = [{comment: action.comment, replies: []}, ...newComments]
            }else{
                for (let i = 0; i < newComments.length; i++) {
                    if(action.comment.top_level_comment === newComments[i].comment.id){
                        newComments[i].replies = [...newComments[i].replies, action.comment]
                        newComments[i].comment.replied_number += 1
                        break
                    }
                }
            }

            return {...state, topLevelComments: newComments}
        case UPDATE_COMMENT:
            let top = [...state.topLevelComments]
            let found = false
            for (let i = 0; i < top.length; i++) {
                if(top[i].comment.id === action.commentId){
                    top[i].comment = {...top[i].comment, body: action.body}
                    break
                }

                for (let j = 0; j < top[i].replies.length; j++) {
                    if(top[i].replies[j].id === action.commentId) {
                        top[i].replies = [...top[i].replies.map((el, index) => index === j ? {...el, body: action.body} : el)]
                        found = true
                        break
                    }
                }

                if(found)
                    break
            }

            return {...state, topLevelComments: top}
        default:
            return state
    }
}