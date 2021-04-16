import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

let store = createStore(
    combineReducers(

    ),
    applyMiddleware(thunk)
)

export default store
