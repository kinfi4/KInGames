import React from 'react';
import s from './GamePreviewBlock.module.css'
import {BASE_URL} from "../../../config";

const GamePreviewBlockWide = (props) => {
    return (
        <>
            <div className={s.innerPreviewBlock} style={{
                backgroundImage: `url(${BASE_URL}${props.game.preview_image.slice(1)})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundColor: `#404040`,
                backgroundRepeat: 'no-repeat'
            }}>

                <div className={s.wideTitleBlock}>
                    <h4>{props.game.categories.map(el => el.name)}</h4>
                    <h2>{props.game.title}</h2>
                    <h3>${props.game.price}</h3>
                </div>

            </div>

        </>
    );
};

export default GamePreviewBlockWide;