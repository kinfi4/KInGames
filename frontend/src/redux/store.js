import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {auth} from "./reducers/authReducer";
import {modalWindowReducer} from "./reducers/modalWindowReducer";
import {gameListReducer} from "./reducers/gameListReducer";
import {categoriesListReducer} from "./reducers/categoriesListReducer";
import {usersReducer} from "./reducers/usersListReducer";

let store = createStore(
    combineReducers({
        auth: auth,
        modalWindow: modalWindowReducer,
        listGames: gameListReducer,
        categories: categoriesListReducer,
        users: usersReducer
    }),
    applyMiddleware(thunk)
)

export default store
