import React, {useState} from 'react';
import {connect} from "react-redux";

import s from './GamePreviewBlock.module.css'

import GamePreviewBlockWide from "./GamePreviewBlockWide";
import GamePreviewBlockThin from "./GamePreviewBlockThin";
import GamePreviewHover from "./GamePreviewHover/GamePreviewHover";

const GamePreviewBase = (props) => {
    const [hoverActive, setHoverActive] = useState(false)

    let blockType = props.game.is_wide ? s.wide : s.thin
    return (
        <div className={`${s.gamePreviewBlock} ${blockType}`}
             onMouseEnter={() => setHoverActive(true)}
             onMouseLeave={() => setHoverActive(false)}>

            {props.game.is_wide ? <GamePreviewBlockWide game={props.game} /> : <GamePreviewBlockThin game={props.game} />}
            <GamePreviewHover is_active={hoverActive} />
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(GamePreviewBase);