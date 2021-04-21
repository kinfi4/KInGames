import axios from "axios";
import {BASE_URL} from "../../config";

const FETCH_ALL_CATEGORIES = 'FETCH_ALL_CATEGORIES'

const initialState = {
    chosenCategories: [],
    categories: []
}


export let fetchListCategories = (dispatch) => {
    axios.get(BASE_URL + 'api/v1/categories')
        .then(res => dispatch({type: FETCH_ALL_CATEGORIES, categories: res.data}))
}



export let categoriesListReducer = (state=initialState, action) => {
    switch (action.type){
        case FETCH_ALL_CATEGORIES:
            return {...state, categories: action.categories}
        default:
            return state
    }
}