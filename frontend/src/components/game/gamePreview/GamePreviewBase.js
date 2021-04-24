import React, {useState} from 'react';
import {connect} from "react-redux";

import s from './GamePreviewBlock.module.css'

import GamePreviewBlockWide from "./GamePreviewBlockWide";
import GamePreviewBlockThin from "./GamePreviewBlockThin";
import GamePreviewHover from "./GamePreviewHover/GamePreviewHover";
import {NavLink} from 'react-router-dom'

const GamePreviewBase = (props) => {
    const [hoverActive, setHoverActive] = useState(false)

    let blockType = props.game.is_wide ? s.wide : s.thin
    return (
            <NavLink to={'/games/' + props.game.slug} className={`${s.gamePreviewBlock} ${blockType}`}
                onMouseEnter={() => setHoverActive(true)}
                     onMouseLeave={() => setHoverActive(false)}>
                    {props.game.is_wide ? <GamePreviewBlockWide game={props.game} /> : <GamePreviewBlockThin game={props.game} />}
                    <GamePreviewHover is_active={hoverActive} slug={props.game.slug} />
            </NavLink>
        )
}

let mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(GamePreviewBase);