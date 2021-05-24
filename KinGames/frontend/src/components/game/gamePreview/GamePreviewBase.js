import React, {useState} from 'react';
import {connect} from "react-redux";

import s from './GamePreviewBlock.module.css'

import GamePreviewBlockWide from "./GamePreviewBlockWide";
import GamePreviewBlockThin from "./GamePreviewBlockThin";
import GamePreviewHover from "./GamePreviewHover/GamePreviewHover";
import {NavLink} from 'react-router-dom'
import {ADMIN, MANAGER} from "../../../config";

const GamePreviewBase = (props) => {
    const [hoverActive, setHoverActive] = useState(false)
    const hoverClass = hoverActive ? s.hover : null

    let blockType = props.game.is_wide ? s.wide : s.thin
    return (
            <NavLink to={'/games/' + props.game.slug} className={`${s.gamePreviewBlock} ${blockType} ${hoverClass}`}
                onMouseEnter={() => setHoverActive(true)}
                onMouseLeave={() => setHoverActive(false)}>

                    {props.game.is_wide ? <GamePreviewBlockWide game={props.game} /> : <GamePreviewBlockThin game={props.game} />}
                    {props.user && (props.user.kin_user.role === ADMIN || props.user.kin_user.role === MANAGER) ?
                        <GamePreviewHover is_active={hoverActive} slug={props.game.slug} /> : null}
            </NavLink>
        )
}

let mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(GamePreviewBase);