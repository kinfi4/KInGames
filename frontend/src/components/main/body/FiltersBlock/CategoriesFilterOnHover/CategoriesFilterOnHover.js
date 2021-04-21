import React, {useEffect} from 'react';
import {connect} from "react-redux";

import s from './CategoriesFilterOnHover.module.css'
import {fetchListCategories} from "../../../../../redux/reducers/categoriesListReducer";

const CategoriesFilterOnHover = (props) => {
    useEffect(() => {
        props.fetchListCategories()
    }, [])

    let componentClass = props.active ? s.active : s.hidden

    return (
        <div className={`${s.categoriesFilterBlock} ${componentClass}`}>
            {props.categories.map(el => {
                return (
                    <div>
                        <input type="checkbox"/> <span>{el.name}</span>
                    </div>
                )
            })}
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        categories: state.categories.categories,
        chosenCategories: state.categories.chosenCategories
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        fetchListCategories: () => dispatch(fetchListCategories)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CategoriesFilterOnHover);