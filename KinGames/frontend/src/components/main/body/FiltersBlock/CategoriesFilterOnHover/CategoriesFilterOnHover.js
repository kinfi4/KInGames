import React, {useEffect} from 'react';
import {connect} from "react-redux";

import s from './CategoriesFilterOnHover.module.css'
import gameCreateUpdatePage from '../../../../game/createGamePage/CreateGamePage.module.css'
import {fetchListCategories, manageChosenCategories} from "../../../../../redux/reducers/categoriesListReducer";

const CategoriesFilterOnHover = (props) => {
    useEffect(() => {
        props.fetchListCategories()
    }, [])

    let componentClass = props.active ? s.active : s.hidden

    return (
        <div className={`${s.categoriesFilterBlock} ${componentClass}`}>
                {props.categories.map((el, i) => {
                    let manageCategoryAdd = () => {
                        if(props.chosenCategories.includes(el.slug)){
                            let newCategories = props.chosenCategories.filter(s => s !== el.slug)
                            props.manageChosenCategories(newCategories)
                        }
                        else {
                            props.manageChosenCategories([...props.chosenCategories, el.slug])
                        }
                    }

                    let chosenClass = ''
                    if(props.chosenCategories.includes(el.slug))
                        chosenClass = gameCreateUpdatePage.chosen

                    return (
                        <div key={i} className={`${gameCreateUpdatePage.categoryButton} ${chosenClass}`}
                             onClick={manageCategoryAdd}>
                            {el.name}
                        </div>
                    )
                })}
        </div>
    );
}

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