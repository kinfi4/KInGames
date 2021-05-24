import axios from "axios";
import {BASE_URL} from "../../config";
import {fetchListGames} from "./gameListReducer";

const FETCH_ALL_CATEGORIES = 'FETCH_ALL_CATEGORIES'
const MANAGE_CHOSEN_CATEGORIES = 'MANAGE_CHOSEN_CATEGORIES'
const MANAGE_SEARCHING_FIELD = 'MANAGE_SEARCHING_FIELD'

const initialState = {
    chosenCategories: [],
    categories: [],
    searchingField: '',
}


export let fetchListCategories = (dispatch) => {
    axios.get(BASE_URL + 'api/v1/categories')
        .then(res => dispatch({type: FETCH_ALL_CATEGORIES, categories: res.data}))
}
export let manageChosenCategories = (chosenCategories) => (dispatch) => {
    dispatch({type: MANAGE_CHOSEN_CATEGORIES, chosenCategories: chosenCategories})
    dispatch(fetchListGames(0))
}
export let manageSearchingField = (searchString) => (dispatch) => {
    dispatch({type: MANAGE_SEARCHING_FIELD, searchingField: searchString})
    dispatch(fetchListGames(0))
}


export let categoriesListReducer = (state=initialState, action) => {
    switch (action.type){
        case FETCH_ALL_CATEGORIES:
            return {...state, categories: action.categories}
        case MANAGE_CHOSEN_CATEGORIES:
            return {...state, chosenCategories: action.chosenCategories}
        case MANAGE_SEARCHING_FIELD:
            return {...state, searchingField: action.searchingField}
        default:
            return state
    }
}