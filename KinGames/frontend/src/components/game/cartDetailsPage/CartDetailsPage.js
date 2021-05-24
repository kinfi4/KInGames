import React, {useEffect} from 'react';
import s from './CartDetailsPage.module.css'
import gameDetailsPage from '../detailGamePage/GameDetailsPage.module.css'
import {connect} from "react-redux";
import {fetchUserCartItems} from "../../../redux/reducers/cartReducer";
import GameRow from "./gameRow/GameRow";
import {showModalWindow} from "../../../redux/reducers/modalWindowReducer";
import OrderForm from "./OrderForm";

const CartDetailsPage = (props) => {
    useEffect(() => {
        props.fetchCart()
    }, [])

    const onProceedClick = () => {
        props.showModalWindow(<OrderForm />, 400, 700)
    }

    return (
        <div className={gameDetailsPage.inner}>
            <div className={s.upperRow}>
                <h1>Your cart</h1>

                <div className={s.upperRow}>
                    <h2 style={{marginRight: '20px'}}>Total ${props.finalPrice}</h2>
                    <div className={gameDetailsPage.buyButton} onClick={onProceedClick}>PROCEED</div>
                </div>
            </div>

            <hr style={{backgroundColor: '#7d7d7d', margin: '40px 0'}}/>

            <div>
                {
                    props.cartItems.map((el, i) => <GameRow cartGame={el} key={i} />)
                }
            </div>
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        finalPrice: state.cart.finalPrice,
        cartItems: state.cart.cartItems,
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        fetchCart: () => dispatch(fetchUserCartItems),
        showModalWindow: (content, width=null, height=null) => dispatch(showModalWindow(content, width, height))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartDetailsPage);