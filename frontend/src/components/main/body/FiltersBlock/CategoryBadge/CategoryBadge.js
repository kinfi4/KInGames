import React from 'react';
import s from './CategoryBadge.module.css'
import {connect} from "react-redux";
import {manageChosenCategories} from "../../../../../redux/reducers/categoriesListReducer";

const CategoryBadge = (props) => {
    let onDeleteChosen = () => {
        let newCategories = props.chosenCategories.filter(s => s !== props.slug)
        props.manageChosenCategories(newCategories)
    }
    
    return (
        <div className={s.categoryBadge}>
            {props.slug} <div onClick={onDeleteChosen}>&#10008;</div>
        </div>
    );
}

let mapStateToProps = (state) => {
    return {
        chosenCategories: state.categories.chosenCategories
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        manageChosenCategories: (chosen) => dispatch(manageChosenCategories(chosen))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CategoryBadge);