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


const initialState = {
    topLevelComments: [{comment: null, replies: []}],
    deletedComments: [],
    showManageButtons: false
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
        top_level_comment,
        replies_on_comment: replied_comment
    })

    axios.post(BASE_URL + 'api/v1/comments', data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    }).then(res => dispatch(fetchTopLevelComments(gameSlug)))
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

export const manageShowManageButtons = (showManageButtons) => (dispatch) => {
    dispatch({type: MANAGE_SHOW_MANAGE_BUTTONS, showManageButtons})
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
            return {...state, showManageButtons: action.showManageButtons}
        default:
            return state
    }
}