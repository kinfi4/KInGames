import React, {useState} from 'react';
import s from './FiltersBlock.module.css'
import {BsPlusCircleFill, BiSearchAlt} from 'react-icons/all'

import {connect} from "react-redux";
import CategoriesFilterOnHover from "./CategoriesFilterOnHover/CategoriesFilterOnHover";
import {manageSearchingField} from "../../../../redux/reducers/categoriesListReducer";

const FiltersBlock = (props) => {

    let onSearchFieldInput = (text) => {
        props.manageSearchingField(text)
    }

    const [activeHover, setActiveHover] = useState(false)

    return (
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
    );
};

let mapStateToProps = (state) => {
    return {
        searchingField: state.categories.searchingField
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        manageSearchingField: (text) => dispatch(manageSearchingField(text))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FiltersBlock);