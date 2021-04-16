import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {auth} from "./reducers/authReducer";
import {modalWindowReducer} from "./reducers/modalWindowReducer";

let store = createStore(
    combineReducers({
        auth: auth,
        modalWindow: modalWindowReducer
    }),
    applyMiddleware(thunk)
)

export default store
