import axios from "axios";
import {BASE_URL} from "../../config";
import {HIDE_MODAL_WINDOW} from "./modalWindowReducer";
import {showMessage} from "../../utils/messages";


axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const USER_LOADING = 'USER_LOADING'
const USER_LOADED = 'USER_LOADED'
const AUTH_ERROR = ' AUTH_ERROR'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGIN_FAIL = 'LOGIN_FAIL'
export const LOGOUT = 'LOGOUT'

const REGISTRATION_ERROR = 'REGISTRATION_ERROR'

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null,
}

// CHECK THE TOKEN AND LOAD THE USER
export const loadUser = () => (dispatch, getState) => {
    dispatch({type: USER_LOADING})

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    const token = getState().auth.token;
    if(token){
        headers['Authorization'] = `Token ${token}`
    }

    axios.get(BASE_URL + 'api/v1/user', {
        headers: headers
    }).then(res => {
        if(res.status === 200)
            dispatch({type: USER_LOADED, payload: res.data})
        else
            dispatch({type: AUTH_ERROR})
    }).catch(er => er)
}

// LOGIN
export const login = (username, password) => (dispatch) => {
    dispatch({type: USER_LOADING})
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    // REQUEST BODY
    const body = JSON.stringify({
        username,
        password,
        email: ''
    })

    axios.post(BASE_URL + 'api/v1/rest-auth/login/', body,{
        headers: headers,
    }).then(res => {
        let authToken = res.data.key
        axios.get(BASE_URL + 'api/v1/user', {
            headers: {'Authorization': `Token ${authToken}`}
        }).then(res => {
            dispatch({type: USER_LOADED, payload: res.data})
            dispatch({ type: LOGIN_SUCCESS, token: authToken })
            dispatch({ type: HIDE_MODAL_WINDOW })
        }).catch(err => dispatch({type: LOGIN_FAIL}))

    }).catch(err => dispatch({type: LOGIN_FAIL}))
}

// LOGOUT
export const logout = (dispatch) => {
    let authToken = localStorage.getItem('token')
    dispatch({type: USER_LOADING})
    axios.post(BASE_URL + 'api/v1/rest-auth/logout/', {}, {
        headers: {'Authorization': `Token ${authToken}`}
    }).then(res => dispatch({type: LOGOUT}))
}

// REGISTER
export const register = (first_name, last_name, username, email, password1, password2) => (dispatch) => {
    dispatch({type: USER_LOADING})

    let body = {
        username,
        email,
        password1,
        password2
    }

    axios.post(BASE_URL + 'api/v1/rest-auth/registration/', JSON.stringify(body), {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(
        res => {
            const authToken = res.data.key
            axios.post(BASE_URL + 'api/v1/user', JSON.stringify({first_name, last_name}), {
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                axios.get(BASE_URL + 'api/v1/user', {
                    headers: {'Authorization': `Token ${authToken}`}
                }).then(res => {
                    dispatch({type: USER_LOADED, payload: res.data})
                    dispatch({ type: LOGIN_SUCCESS, token: authToken })
                    dispatch({ type: HIDE_MODAL_WINDOW })
                }).catch(err => dispatch({type: REGISTRATION_ERROR, errors: err.response.data}))
            }).catch(err => {
                    dispatch({type: REGISTRATION_ERROR, errors: err.response.data})
               })

        }).catch(err => {
            dispatch({type: REGISTRATION_ERROR, errors: err.response.data})
        })
}


// REDUCER
export function auth (state=initialState, action){
    // alert(`${action.type} ${action.payload ? action.payload.key : action.payload}`)
    switch (action.type){
        case USER_LOADING:
            return {
                ...state,
                isLoading: true,
                isAuthenticated: false
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.token)
            window.location.replace('/')
            return {
                ...state,
                token: action.token,
                isAuthenticated: true,
                isLoading: false,
            }
        case REGISTRATION_ERROR:
            let errors = Object.entries(action.errors).map(el => `${el[0]}: ${el[1]}`)
            showMessage(errors.map((err) => {
                return {message: err, type: 'danger'}
            }))

            return {
                isAuthenticated: false,
                isLoading: false,
                token: null,
                user: null,
            }
        case AUTH_ERROR:
        case LOGIN_FAIL:
            showMessage([{message: 'Username or password is incorrect', type: 'danger'}])
            return {
                isAuthenticated: false,
                isLoading: false,
                token: null,
                user: null,
            }
        case LOGOUT:
            localStorage.removeItem('token')
            window.location.replace('/')
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            }
        default:
            return state
    }
}