import axios from "axios";
import {BASE_URL} from "../../config";
import {FETCH_ERROR} from "./gameListReducer";
import {showMessage} from "../../utils/messages";


axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const FETCH_TOP_LEVEL_COMMENTS = 'FETCH_TOP_LEVEL_COMMENTS'
const FETCH_COMMENT_REPLIES = 'FETCH_COMMENT_REPLIES'


const initialState = {
    topLevelComments: [{comment: null, replies: []}]
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
        default:
            return state
    }
}