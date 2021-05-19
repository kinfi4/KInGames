import axios from "axios";
import {BASE_URL} from "../../config";
import {FETCH_ERROR} from "./gameListReducer";
import {showMessage} from "../../utils/messages";
import {HIDE_MODAL_WINDOW} from "./modalWindowReducer";

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";


const FETCH_CART_SIZE = 'FETCH_CART_SIZE'
const FETCH_CART = 'FETCH_CART'
const CHANGE_CART_ITEMS = 'CHANGE_CART_ITEMS'

const initialState = {
    cartSize: 0,
    cartItems: [],
    finalPrice: 0
}


export const fetchCartSize = (dispatch) => {
    let token = localStorage.getItem('token')

    let headers = {};
    if(token)
        headers = {'Authorization': `Token ${token}`}

    axios.get(BASE_URL + 'api/v1/cart-size', {
        headers: headers
    }).then(res => dispatch({type: FETCH_CART_SIZE, cartSize: res.data.size}))
}

export const fetchUserCartItems = (dispatch) => {
    let token = localStorage.getItem('token')

    let headers = {};
    if(token)
        headers = {'Authorization': `Token ${token}`}

    axios.get(BASE_URL + 'api/v1/user-cart', {
        headers: headers
    }).then(res => dispatch({type: FETCH_CART, data: res.data}))
      .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}

export const manageCartGames = (gameSlug, add, remove_whole_row=false, reload=true) => (dispatch) => {
    let token = localStorage.getItem('token')

    let headers = token ? {'Authorization': `Token ${token}`, 'Content-Type': 'application/json'} : {'Content-Type': 'application/json'};

    const data = JSON.stringify({game_slug: gameSlug, add: add, remove_whole_row: remove_whole_row})
    axios.post(BASE_URL + 'api/v1/user-cart', data, {
        headers: headers
    }).then(res => {
        if(reload)
            dispatch({type: CHANGE_CART_ITEMS, add, remove_whole_row, gameSlug})

        dispatch(fetchCartSize)
    }).catch(err => dispatch({type: FETCH_ERROR, errors: err.response ? err.response.data : alert(err)}))
}

export const makeOrder = (data) => (dispatch) => {
    let token = localStorage.getItem('token')
    let headers = token ? {'Authorization': `Token ${token}`, 'Content-Type': 'application/json'} : {'Content-Type': 'application/json'};


    axios.post(BASE_URL + 'api/v1/make-order', JSON.stringify(data), {headers: headers})
        .then(() => {
            window.location.href = '/'
            showMessage([{message: 'You order successfully proceeded, you will get payment bill on your email.', type: 'success'}])
            dispatch({type: HIDE_MODAL_WINDOW})
        }).catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data.errors}))
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
        case CHANGE_CART_ITEMS:
            let changedGame = state.cartItems.find(el => el.game.slug === action.gameSlug)

            let newFinalPrice
            if(action.remove_whole_row)
                newFinalPrice = (Number(state.finalPrice) - Number(changedGame.game.price) * changedGame.qty).toFixed(2)
            else
                newFinalPrice = action.add ?
                    (Number(state.finalPrice) + Number(changedGame.game.price)).toFixed(2) :
                    (Number(state.finalPrice) - Number(changedGame.game.price)).toFixed(2)

            let newCartItems;
            if(action.remove_whole_row)
                newCartItems = [...state.cartItems.filter(el => el.game.slug !== action.gameSlug)]
            else
                newCartItems = [...state.cartItems.map(el => {
                    if(el.game.slug === action.gameSlug){
                        if(!action.add && el.qty === 1)
                            return

                        return {
                            ...el,
                            qty: action.add ? el.qty + 1 : el.qty - 1,
                            final_price: action.add ?
                                (Number(el.final_price) + Number(el.game.price)).toFixed(2) :
                                (Number(el.final_price) - Number(el.game.price)).toFixed(2)
                        }
                    }
                    else{
                        return el
                    }
                }).filter(el => el)]

            return {...state, cartItems: newCartItems, finalPrice: newFinalPrice}
        default:
            return state
    }
}