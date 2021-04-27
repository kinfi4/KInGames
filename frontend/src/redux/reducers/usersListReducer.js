import axios from "axios";
import {BASE_URL} from "../../config";
import {showMessage} from "../../utils/messages";

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";


const initialState = {
    users: [],
    searchField: '',
    page: 0,
}

const FETCH_USERS_LIST = 'FETCH_USERS_LIST'
const ERROR_ON_REQUEST = 'ERROR_ON_REQUEST'
const MANAGE_SEARCH_FIELD = 'MANAGE_SEARCH_FIELD'


export let fetchUsersList = (dispatch, getState) => {
    let page = getState().users.page
    let token = localStorage.getItem('token')
    let name = getState().users.searchField
    
    axios.get(BASE_URL + 'api/v1/manage-users?page=' + page + '&name=' + name, {
        headers: {'Authorization': `Token ${token}`}
    })
        .then(res => dispatch({type: FETCH_USERS_LIST, users: res.data}))
        .catch(err => dispatch({type: ERROR_ON_REQUEST, errors: err.response.data}))
}

export let changeUserRole = (username, role) => (dispatch) => {
    let token = localStorage.getItem('token')

    axios.post(BASE_URL + 'api/v1/manage-users', JSON.stringify({username, role}), {
        headers: {'Authorization': `Token ${token}`, 'Content-Type': 'application/json'}
    }).catch(err => dispatch({type: ERROR_ON_REQUEST, errors: err.response.data}))
}

export let manageSearchField = (text) => (dispatch) => {
    dispatch({type: MANAGE_SEARCH_FIELD, text: text})
    dispatch(fetchUsersList)
}


export let usersReducer = (state=initialState, action) => {
    switch (action.type){
        case FETCH_USERS_LIST:
            if(action.users.length === 0)
                return state

            let cur_users = state.users
            return {...state, users: [...new Set(cur_users.concat(action.users))], page: state.page + 1}
        case ERROR_ON_REQUEST:
            let errors = Object.entries(action.errors).map(el => `${el[0]}: ${el[1]}`)
            showMessage(errors.map((err) => {
                return {message: err, type: 'danger'}
            }))
            return state
        case MANAGE_SEARCH_FIELD:
            return {...state, searchField: action.text, page: 0, users: []}
        default:
            return state
    }
}
