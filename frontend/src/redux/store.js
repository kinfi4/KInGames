import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {auth} from "./reducers/authReducer";

let store = createStore(
    combineReducers({
        auth: auth
    }),
    applyMiddleware(thunk)
)

export default store
