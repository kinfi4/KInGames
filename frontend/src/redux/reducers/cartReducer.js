import axios from "axios";
import {BASE_URL} from "../../config";
import {FETCH_ERROR} from "./gameListReducer";


const FETCH_CART_SIZE = 'FETCH_CART_SIZE'
const FETCH_CART = 'FETCH_CART'

const initialState = {
    cartSize: 0,
    cartItems: [],
    finalPrice: 0
}


export const fetchCartSize = (dispatch) => {
    let token = localStorage.getItem('token')
    axios.get(BASE_URL + 'api/v1/cart-size', {
        headers: {'Authorization': `Token ${token}`}
    }).then(res => dispatch({type: FETCH_CART_SIZE, cartSize: res.data.size}))
}

export const fetchUserCartItems = (dispatch) => {
    let token = localStorage.getItem('token')
    axios.get(BASE_URL + 'api/v1/user-cart', {
        headers: {'Authorization': `Token ${token}`}
    }).then(res => dispatch({type: FETCH_CART, data: res.data}))
        .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}

export const addGameToCart = (gameSlug) => (dispatch) => {
    let token = localStorage.getItem('token')
    axios.post(BASE_URL + 'api/v1/user-cart', JSON.stringify({game_slug: gameSlug, add: true}), {
        headers: {
            'Authorization': `Token ${token}`,
            'ContentType': 'application/json'
        }
    }).catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))

    dispatch(fetchUserCartItems)
}

export const removeGameFromTheCart = (gameSlug) => (dispatch) => {
    let token = localStorage.getItem('token')
    axios.post(BASE_URL + 'api/v1/user-cart', JSON.stringify({game_slug: gameSlug, add: false}), {
        headers: {
            'Authorization': `Token ${token}`,
            'ContentType': 'application/json'
        }
    }).catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))

    dispatch(fetchUserCartItems)
}


export const cartReducer = (state=initialState, action) => {
    switch (action.type){
        case FETCH_CART_SIZE:
            return {...state, cartSize: action.cartSize}
        case FETCH_CART:
            return {
                ...state,
                cartSize: action.data.total_products,
                cartItems: action.data.cart_games,
                finalPrice: action.data.final_price
            }
        default:
            return state
    }
}