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


export let fetchListGames = (page) => (dispatch) => {
    axios.get(BASE_URL + 'api/v1/games?page=' + page)
        .then(res => dispatch({type: GET_GAMES_LIST, games: res.data}))
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

            return {...state, page: state.page + 1, games: action.games}
        case FETCH_SINGLE_GAME:
            return {...state, activeGame: action.game}
        case FETCH_ERROR:
            let errors = Object.entries(action.errors).map(el => `${el[0]}: ${el[1]}`)
            showMessage(errors.map((err) => {
                return {message: err, type: 'danger'}
            }))

            return state
        default:
            return state
    }
}

