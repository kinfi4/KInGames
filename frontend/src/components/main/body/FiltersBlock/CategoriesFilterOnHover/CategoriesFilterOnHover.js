import React, {useEffect} from 'react';
import {connect} from "react-redux";

import s from './CategoriesFilterOnHover.module.css'
import {fetchListCategories, manageChosenCategories} from "../../../../../redux/reducers/categoriesListReducer";

const CategoriesFilterOnHover = (props) => {
    useEffect(() => {
        props.fetchListCategories()
    }, [])

    let onChooseCategory = (active, slug) => {
        if(active)
            props.manageChosenCategories([...props.chosenCategories, slug])
        else
            props.manageChosenCategories([...props.chosenCategories.filter(el => el !== slug)])
    }

    let componentClass = props.active ? s.active : s.hidden

    return (
        <div className={`${s.categoriesFilterBlock} ${componentClass}`}>
            {props.categories.map((el, index) => {
                let chosen = props.chosenCategories.includes(el.slug)
                return (
                    <div className={s.checkboxBlock} key={index}>
                        <input type="checkbox" id={'category' + index} checked={chosen} onChange={e => onChooseCategory(e.target.checked, el.slug)}/>
                        <label htmlFor={'category' + index}>{el.name}</label>
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
        fetchListCategories: () => dispatch(fetchListCategories),
        manageChosenCategories: (chosen) => dispatch(manageChosenCategories(chosen))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CategoriesFilterOnHover);