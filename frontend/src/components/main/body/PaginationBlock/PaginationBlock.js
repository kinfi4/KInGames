import React from 'react';
import s from './PaginationBlock.module.css'
import {connect} from "react-redux";
import {fetchListGames} from "../../../../redux/reducers/gameListReducer";
import P from './P'

const PaginationBlock = (props) => {
    const dots = <span className={s.dots}>...</span>

    const getPagesCells = () => {
        const cells = []
        for (let i = 1; i <= Number(props.pagination.lastPage); i++){
            cells.push(i)
        }

        if(Number(props.pagination.lastPage) < 6)
            return <>{cells.map(n => <P n={n} key={n} />)}</>

        if(props.pagination.page === 1)
            return <><P n={1} /><P n={2} /> {dots} <P n={Number(props.pagination.lastPage) - 1}/> <P n={props.pagination.lastPage} /></>
        if(props.pagination.page === 2)
            return <><P n={1} /><P n={2} /><P n={3} /> {dots} <P n={Number(props.pagination.lastPage) - 1} /> <P n={props.pagination.lastPage}/></>
        if(props.pagination.page === 3)
            return <><P n={1} /><P n={2} /><P n={3} /><P n={4} /> {dots} <P n={Number(props.pagination.lastPage) - 1} /><P n={props.pagination.lastPage} /></>

        if(props.pagination.page === props.pagination.lastPage)
            return <><P n={1} /><P n={2} /> {dots} <P n={Number(props.pagination.lastPage) - 1} /><P n={props.pagination.lastPage} /></>
        if(Number(props.pagination.page) === Number(props.pagination.lastPage) - 1)
            return <><P n={1} /><P n={2} /> {dots} <P n={Number(props.pagination.lastPage) - 2} /><P n={Number(props.pagination.lastPage) - 1} /><P n={props.pagination.lastPage} /></>
        if(Number(props.pagination.page) === Number(props.pagination.lastPage) - 2)
            return <><P n={1} /><P n={2} /> {dots} <P n={Number(props.pagination.lastPage) - 3} /><P n={Number(props.pagination.lastPage) - 2} /><P n={Number(props.pagination.lastPage) - 1} /><P n={props.pagination.lastPage} /></>

        return <><P n={1} /><P n={2} /> {dots} <P n={Number(props.pagination.page) - 1} /> <P n={props.pagination.page} /><P n={Number(props.pagination.page) + 1} /> {dots} <P n={Number(props.pagination.lastPage) - 1} /><P n={props.pagination.lastPage} /></>
    }

    return (
        <div className={s.paginationBlock}>
            {getPagesCells()}
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        pagination: state.listGames.pagination
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        fetchGames: (page) => dispatch(fetchListGames(page))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PaginationBlock);