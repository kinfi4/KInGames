import React from 'react';
import {connect} from "react-redux";
import s from './PaginationBlock.module.css'
import {fetchListGames} from "../../../../redux/reducers/gameListReducer";

const P = (props) => {
    const activeClass = props.n === props.activePage ? s.active : ''

    return <div className={activeClass} onClick={() => {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })

        props.fetchListGames(props.n - 1)
    }}>{props.n}</div>
};

let mapStateToProps = (state) => {
    return {
        activePage: state.listGames.pagination.page
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        fetchListGames: (page) => dispatch(fetchListGames(page))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(P);