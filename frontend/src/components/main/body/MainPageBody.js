import React, {useEffect} from 'react';
import s from './MainPageBody.module.css'
import {connect} from "react-redux";
import {fetchListGames} from "../../../redux/reducers/gameListReducer";
import GamePreviewBase from "../../game/gamePreview/GamePreviewBase";
import FiltersBlock from "./FiltersBlock/FiltersBlock";


const MainPageBody = (props) => {
    useEffect(() => {
        props.fetchGames(props.page)
    }, [])

    const getGames = () => {
        let curRowFilled = 0
        let extra = []

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

    return (
        <div className={s.mainPageBody}>

            <FiltersBlock />

            <hr style={{backgroundColor: '#3b3b3b'}}/>

            <div className={s.gamesList}>
                {getGames()}
            </div>
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        games: state.listGames.games,
        page: state.listGames.page
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        fetchGames: (page) => dispatch(fetchListGames(page))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPageBody);