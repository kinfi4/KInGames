import axios from "axios";
import {BASE_URL} from "../../config";
import {showMessage} from "../../utils/messages";

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

let initialState = {
    page: 0,
    games: [],
    activeGame: null,
    pagination: {page: 0, lastPage: 0},
    loading: false
}

const GET_GAMES_LIST = 'GET_GAMES_LIST'
const FETCH_SINGLE_GAME = 'FETCH_SINGLE_GAME'
export const FETCH_ERROR = 'FETCH_ERROR'
const CLEAR_STATE = 'CLEAR_STATE'
const SET_LOADING = 'SET_LOADING'

const prepareDataForSending = (title, price, description, numberOfLicence, categories, preview) => {
    let data = new FormData()
    data.append('title', title)
    data.append('price', price)
    data.append('description', description)
    data.append('number_of_licences', numberOfLicence)
    data.append('categories', JSON.stringify(categories))
    if(preview)
        data.append('preview_image', preview, preview.name)

    return data
}

export let fetchListGames = (page) => (dispatch, getState) => {
    dispatch({type: CLEAR_STATE})
    dispatch({type: SET_LOADING})

    let categoriesFilter = ''
    let categories = getState().categories.chosenCategories
    if(categories.length !== 0)
        categoriesFilter = `&category=${categories.join('%')}`

    let searchingString = ''
    let searchingField = getState().categories.searchingField
    if(searchingField.length !== 0)
        searchingString = `&title=${searchingField}`

    axios.get(BASE_URL + 'api/v1/games?page=' + page + categoriesFilter + searchingString)
        .then(res => dispatch({type: GET_GAMES_LIST, games: res.data.games, paginationObJ: res.data.pagination, page: page}))
        .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data})).catch(() => alert('hel'))
}

export let fetchGame = (slug) => (dispatch) => {
    axios.get(BASE_URL + 'api/v1/games/' + slug)
        .then(res => dispatch({type: FETCH_SINGLE_GAME, game: res.data}))
        .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
        .catch(() => alert('something go wrong'))
}

export let addGame = (title, price, description, numberOfLicence, categories, preview) => (dispatch) => {
    let token = localStorage.getItem('token')
    if(!token){
        showMessage([{message: 'You have to be authenticated', type: 'danger'}])
        return
    }

    let data = prepareDataForSending(title, price, description, numberOfLicence, categories, preview)

    axios.post(BASE_URL + 'api/v1/games', data, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    }).catch(err => {
        let errors = Object.entries(err.response.data).map(el => `${el[0]}: ${el[1]}`)
        showMessage(errors.map((err) => {
            return {message: err, type: 'danger'}
        }))
    })

}

export let updateGame = (slug, title, price, description, numberOfLicence, categories, preview) => (dispatch, getState) => {
    let page = getState().listGames.pagination.page

    let token = localStorage.getItem('token')
    if(!token){
        showMessage([{message: 'You have to be authenticated', type: 'danger'}])
        return
    }

    let data = prepareDataForSending(title, price, description, numberOfLicence, categories, preview)

    axios.put(BASE_URL + 'api/v1/games/' + slug, data, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    }).then(res => dispatch(fetchListGames(Number(page) - 1)))
      .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))

}

export let deleteGame = (slug) => (dispatch) => {
    let token = localStorage.getItem('token')
    if(!token){
        showMessage([{message: 'You have to be authenticated', type: 'danger'}])
        return
    }

    axios.delete(BASE_URL + 'api/v1/games/' + slug, {
        headers: {'Authorization': `Token ${token}`}
    }).catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}

export let hideGame = (slug, message) => (dispatch) => {
    let token = localStorage.getItem('token')

    axios.post(BASE_URL + 'api/v1/hide-game/' + slug, {}, {
        headers: {'Authorization': `Token ${token}`}
    }).then(res => showMessage([{message: message, type: 'success'}]))
      .catch(err => dispatch({type: FETCH_ERROR, errors: err.response.data}))
}


export let gameListReducer = (state=initialState, action) => {
    switch (action.type){
        case GET_GAMES_LIST:
            if(action.games.length === 0)
                return {...state, loading: false}

            return {...state, page: action.page, games: action.games, pagination: {page: action.paginationObJ.current_page, lastPage: action.paginationObJ.last_page}, loading: false}
        case FETCH_SINGLE_GAME:
            return {...state, activeGame: action.game, loading: false}
        case FETCH_ERROR:
            let errors = Object.entries(action.errors).map(el => `${el[0]}: ${el[1]}`)
            showMessage(errors.map((err) => {
                return {message: err, type: 'danger'}
            }))
            return {...state, loading: false}
        case SET_LOADING:
            return {...state, loading: true}
        case CLEAR_STATE:
            return initialState
        default:
            return state
    }
}

