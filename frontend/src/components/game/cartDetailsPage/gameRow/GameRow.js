import React from 'react';
import s from '../CartDetailsPage.module.css'
import {ImCross} from 'react-icons/all'
import {BASE_URL} from "../../../../config";
import {connect} from "react-redux";
import {manageCartGames} from "../../../../redux/reducers/cartReducer";


const GameRow = (props) => {
    return (
        <div className={s.row}>
            <div className={s.previewImage} style={{
                backgroundImage: `url(${BASE_URL}${props.cartGame.game.preview_image.slice(1)})`,
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundColor: `#242424`,
                backgroundRepeat: 'no-repeat'
            }} > </div>

            <div className={s.titlePriceBlock}>
                <div>{props.cartGame.game.title}</div>
                <div>$ {props.cartGame.game.price}</div>
            </div>

            <div className={s.manageQuantity}>
                <div style={{cursor: 'pointer'}} onClick={() => props.addGameToCart(props.cartGame.game.slug)}>+</div>
                <div>{props.cartGame.qty}</div>
                <div style={{cursor: 'pointer'}} onClick={() => props.removeGameFromCart(props.cartGame.game.slug)}>-</div>
            </div>

            <div className={s.total}>
                Total: {props.cartGame.final_price}
            </div>

            <div className={s.deleteButton} onClick={() => props.removeWholeRow(props.cartGame.game.slug)}>
                <ImCross />
            </div>
        </div>
    );
};


let mapDispatchToProps = (dispatch) => {
    return {
        addGameToCart: (slug) => dispatch(manageCartGames(slug, true, true)),
        removeGameFromCart: (slug) => dispatch(manageCartGames(slug, false, true)),
        removeWholeRow: (slug) => dispatch(manageCartGames(slug, false, true, true))
    }
}


export default connect(() => {}, mapDispatchToProps)(GameRow);