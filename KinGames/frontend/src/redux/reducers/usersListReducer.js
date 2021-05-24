import axios from "axios";
import {BASE_URL} from "../../config";
import {FETCH_ERROR} from "./gameListReducer";

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";


const initialState = {
    users: [],
    searchField: '',
    page: 0,
    loading: false
}

const FETCH_USERS_LIST = 'FETCH_USERS_LIST'
const MANAGE_SEARCH_FIELD = 'MANAGE_SEARCH_FIELD'
const CLEAR_THE_STATE = 'CLEAR_THE_STATE'

export let fetchUsersList = (dispatch, getState) => {
    let page = getState().users.page
    let token = localStorage.getItem('token')
    let name = getState().users.searchField

    axios.get(BASE_URL + 'api/v1/manage-users?page=' + page + '&name=' + name, {
        headers: {'Authorization': `Token ${token}`}
    }).then(res => dispatch({type: FETCH_USERS_LIST, users: res.data}))
      .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}

export let changeUserRole = (username, role) => (dispatch) => {
    let token = localStorage.getItem('token')

    axios.post(BASE_URL + 'api/v1/manage-users', JSON.stringify({username, role}), {
        headers: {'Authorization': `Token ${token}`, 'Content-Type': 'application/json'}
    }).catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))

}

export let manageSearchField = (text) => (dispatch) => {
    dispatch({type: MANAGE_SEARCH_FIELD, text: text})
    dispatch(fetchUsersList)
}

export let clearTheState = (dispatch) => {
    dispatch({type: CLEAR_THE_STATE})
}


export let usersReducer = (state=initialState, action) => {
    switch (action.type){
        case FETCH_USERS_LIST:
            if(action.users.length === 0)
                return state

            let cur_users = state.users
            return {...state, users: [...new Set(cur_users.concat(action.users))], page: state.page + 1, loading: false}
        case MANAGE_SEARCH_FIELD:
            return {...state, searchField: action.text, page: 0, users: []}
        case CLEAR_THE_STATE:
            return initialState
        default:
            return state
    }
}
