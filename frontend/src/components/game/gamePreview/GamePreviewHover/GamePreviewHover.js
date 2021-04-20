import React from 'react';
import {connect} from "react-redux";

import {AiOutlineEdit, RiDeleteBin6Fill} from 'react-icons/all'

import s from './GamePreviewHover.module.css'

const GamePreviewHover = (props) => {
    let activeClass = props.is_active ? s.active : s.hidden
    return (
        <div className={s.previewHover + ` ${activeClass}`}>

            <div className={s.manageButton}><AiOutlineEdit /> <span> Edit </span></div>
            <div className={s.manageButton}><RiDeleteBin6Fill /> <span> Delete </span> </div>

        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(GamePreviewHover);