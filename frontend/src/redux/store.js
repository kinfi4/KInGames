import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {auth} from "./reducers/authReducer";
import {modalWindowReducer} from "./reducers/modalWindowReducer";
import {gameListReducer} from "./reducers/gameListReducer";
import {categoriesListReducer} from "./reducers/categoriesListReducer";
import {usersReducer} from "./reducers/usersListReducer";
import {cartReducer} from "./reducers/cartReducer";
import {commentReducer} from "./reducers/commentReducer";

let store = createStore(
    combineReducers({
        auth: auth,
        modalWindow: modalWindowReducer,
        listGames: gameListReducer,
        categories: categoriesListReducer,
        users: usersReducer,
        cart: cartReducer,
        comment: commentReducer
    }),
    applyMiddleware(thunk)
)

export default store
