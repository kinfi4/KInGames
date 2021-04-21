import axios from "axios";
import {BASE_URL} from "../../config";
import {showMessage} from "../../utils/messages";


let initialState = {
    page: 0,
    games: [],
    activeGame: null
}

const GET_GAMES_LIST = 'GET_GAMES_LIST'
const FETCH_SINGLE_GAME = 'FETCH_SINGLE_GAME'
const FETCH_ERROR = 'FETCH_ERROR'
const CLEAR_STATE = 'CLEAR_STATE'


export let fetchListGames = (page) => (dispatch, getState) => {
    let categoriesFilter = ''
    let categories = getState().categories.chosenCategories
    if(categories.length !== 0)
        categoriesFilter = `&category=${categories.join('%')}`

    let searchingString = ''
    let searchingField = getState().categories.searchingField
    if(searchingField.length !== 0)
        searchingString = `&title=${searchingField}`

    dispatch({type: CLEAR_STATE})

    axios.get(BASE_URL + 'api/v1/games?page=' + page + categoriesFilter + searchingString)
        .then(res => dispatch({type: GET_GAMES_LIST, games: res.data, page: page}))
        .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}

export let fetchGame = (slug) => (dispatch) => {
    axios.get(BASE_URL + 'api/v1/games/' + slug)
        .then(res => dispatch({type: FETCH_SINGLE_GAME, game: res.data}))
        .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}


export let gameListReducer = (state=initialState, action) => {
    switch (action.type){
        case GET_GAMES_LIST:
            if(action.games.length === 0)
                return state

            return {...state, page: action.page, games: action.games}
        case FETCH_SINGLE_GAME:
            return {...state, activeGame: action.game}
        case FETCH_ERROR:
            let errors = Object.entries(action.errors).map(el => `${el[0]}: ${el[1]}`)
            showMessage(errors.map((err) => {
                return {message: err, type: 'danger'}
            }))

            return state
        case CLEAR_STATE:
            return initialState
        default:
            return state
    }
}

