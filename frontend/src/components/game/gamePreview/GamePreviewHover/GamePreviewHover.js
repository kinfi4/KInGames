import React from 'react';
import {connect} from "react-redux";

import {AiOutlineEdit, RiDeleteBin6Fill} from 'react-icons/all'

import s from './GamePreviewHover.module.css'
import {deleteGame} from "../../../../redux/reducers/gameListReducer";
import {showMessage} from "../../../../utils/messages";
import {NavLink} from "react-router-dom";


const GamePreviewHover = (props) => {

    let onDelete = () => {
        if(window.confirm('Are you sure? This will delete this game from catalog')) {
            props.deleteGame(props.slug)
            showMessage([{message: 'Game deleted', type: 'success'}])
            window.location.href = '/'
        }
    }

    let activeClass = props.is_active ? s.active : s.hidden
    return (
        <div className={s.previewHover + ` ${activeClass}`}>

            <div className={s.manageButton}><NavLink to={'update/' + props.slug}><AiOutlineEdit /> <span> Edit </span></NavLink></div>
            <div className={s.manageButton} onClick={onDelete}><NavLink to={'/'}><RiDeleteBin6Fill /> <span> Delete </span></NavLink></div>

        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        deleteGame: (slug) => dispatch(deleteGame(slug))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GamePreviewHover);