import axios from "axios";
import {BASE_URL} from "../../config";
import {showMessage} from "../../utils/messages";
import {FETCH_ERROR} from "./gameListReducer";


const CURRENT_MARK_CHANGED = 'CURRENT_MARK_CHANGED'
const FETCH_GAME_MARK_DETAILS = 'FETCH_GAME_MARK_DETAILS'

const initialState = {
    userMark: null,
    curMark: null,
    estimatedTimes: 0,
    avgMark: 0.0
}


export let addGameMark = (slug, mark) => (dispatch) => {
    let token = localStorage.getItem('token')
    if(!token){
        showMessage([{message: 'You have to be authenticated', type: 'danger'}])
        return
    }

    axios.post(BASE_URL + 'api/v1/estimate-game/' + slug, JSON.stringify({mark}), {
        headers: {'Authorization': `Token ${token}`, 'Content-Type': 'application/json'}
    }).then(res => {
        showMessage([{message: 'Your mark proceeded', type: 'success'}])
        dispatch(fetchGameMark(slug))
    })
      .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}

export let changeCurrentMark = (mark) => (dispatch) => {
    dispatch({type: CURRENT_MARK_CHANGED, mark: mark})
}

export let fetchGameMark = (slug) => (dispatch) => {
    let token = localStorage.getItem('token')
    let headers = token ? {'Authorization': `Token ${token}`} : {}

    axios.get(BASE_URL + 'api/v1/estimate-game/' + slug, {headers: headers})
        .then(res => dispatch({type: FETCH_GAME_MARK_DETAILS, ...res.data}))
        .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}


export const gameMarkReducer = (state=initialState, action) => {
    switch (action.type){
        case  CURRENT_MARK_CHANGED:
            return {...state, curMark: action.mark}
        case FETCH_GAME_MARK_DETAILS:
            return {...state, estimatedTimes: action.estimated_times, userMark: action.user_mark, avgMark: action.avg_mark}
        default:
            return state
    }
}