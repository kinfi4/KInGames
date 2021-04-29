import React from 'react';
import s from '../CartDetailsPage.module.css'
import {ImCross} from 'react-icons/all'
import {BASE_URL} from "../../../../config";

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

            <div>
                {props.cartGame.qty}
            </div>

            <div className={s.total}>
                Total: {props.cartGame.final_price}
            </div>

            <div className={s.deleteButton}>
                <ImCross />
            </div>
        </div>
    );
};

export default GameRow;