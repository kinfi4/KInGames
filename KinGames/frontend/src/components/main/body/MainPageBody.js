import React, {useEffect} from 'react';
import s from './MainPageBody.module.css'
import {connect} from "react-redux";
import {fetchListGames} from "../../../redux/reducers/gameListReducer";
import GamePreviewBase from "../../game/gamePreview/GamePreviewBase";
import FiltersBlock from "./FiltersBlock/FiltersBlock";
import PaginationBlock from "./PaginationBlock/PaginationBlock";
import LoadingSpinner from "../../crumbs/LoadingSpinner/LoadingSpinner";


const MainPageBody = (props) => {
    useEffect(() => {
        props.fetchGames(props.page)
    }, [])

    const getGames = () => {
        let curRowFilled = 0
        let extra = []

        if(props.gamesIsLoading)
            return <LoadingSpinner width={100} height={100}/>
        else{
            if(props.games.length === 0)
                return <h1 style={{fontWeight: 'bold', fontSize: 'large', marginTop: '40px'}}>Nothing was found (</h1>
            else
                return props.games.map((el, index) => {
                    let size = el.is_wide ? 2 : 1

                    if(curRowFilled === 3)
                        curRowFilled = 0

                    if(size + curRowFilled <= 3){
                        curRowFilled += size
                        return <GamePreviewBase game={el} key={index}/>
                    }

                    extra.push(<GamePreviewBase game={el} key={index}/>)
                }).concat(extra)
        }
    }

    return (
        <div className={s.mainPageBody}>

            <FiltersBlock />

            <hr style={{backgroundColor: '#3b3b3b'}}/>

            <div className={s.gamesList}>
                {getGames()}
            </div>

            <hr/>
            {props.gamesIsLoading ? null : <PaginationBlock/>}
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        games: state.listGames.games,
        page: state.listGames.page,
        gamesIsLoading: state.listGames.loading
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        fetchGames: (page) => dispatch(fetchListGames(page))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPageBody);