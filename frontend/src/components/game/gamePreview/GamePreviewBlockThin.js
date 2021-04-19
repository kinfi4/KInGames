import React from 'react';
import s from './GamePreviewBlock.module.css'
import {BASE_URL} from "../../../config";

const GamePreviewBlockThin = (props) => {
    return (
        <div className={`${s.gamePreviewBlock} ${s.thin}`}>
            <div className={s.innerPreviewBlock} style={{
                backgroundImage: `url(${BASE_URL}${props.game.preview_image.slice(1)})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundColor: `#404040`,
                backgroundRepeat: 'no-repeat'
            }}>
                <h2>{props.game.title}</h2>

            </div>

        </div>
    );
};

export default GamePreviewBlockThin;