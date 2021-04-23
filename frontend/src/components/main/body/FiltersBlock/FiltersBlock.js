import React, {useState} from 'react';
import s from './FiltersBlock.module.css'
import {BsPlusCircleFill, BiSearchAlt} from 'react-icons/all'
import {ADMIN, MANAGER} from "../../../../config";

import {connect} from "react-redux";
import CategoriesFilterOnHover from "./CategoriesFilterOnHover/CategoriesFilterOnHover";
import {manageSearchingField} from "../../../../redux/reducers/categoriesListReducer";
import {NavLink} from "react-router-dom";

const FiltersBlock = (props) => {

    let onSearchFieldInput = (text) => {
        props.manageSearchingField(text)
    }

    let addGameButton = () => {
        if(props.user && (props.user.kin_user.role === ADMIN || props.user.kin_user.role === MANAGER))
            return (
                <div className={s.addGameButtonBlock}>
                    <NavLink to={'/add-game'} className={s.addGameButton}>Add Game</NavLink>
                </div>
            )
    }

    const [activeHover, setActiveHover] = useState(false)

    return (
        <>
            <div className={s.filterBlock}>
                <div className={s.filterCategory}
                     onMouseEnter={() => setActiveHover(true)}
                     onMouseLeave={() => setActiveHover(false)}>

                    <BsPlusCircleFill /> <span> Add Filter </span>
                    <CategoriesFilterOnHover active={activeHover} />
                </div>

                <div>
                    <div>
                        <BiSearchAlt /> <input type="text"
                                               className={s.searchField}
                                               value={props.searchingField}
                                               onInput={e => onSearchFieldInput(e.target.value)}/>
                    </div>
                </div>
            </div>

            {addGameButton()}
        </>
    );
};

let mapStateToProps = (state) => {
    return {
        searchingField: state.categories.searchingField,
        user: state.auth.user
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        manageSearchingField: (text) => dispatch(manageSearchingField(text))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FiltersBlock);