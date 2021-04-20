import React, {useEffect, useState} from 'react';
import s from './MainPageBody.module.css'
import {connect} from "react-redux";
import {fetchListGames} from "../../../redux/reducers/gameListReducer";
import GamePreviewBlockWide from "../../game/gamePreview/GamePreviewBlockWide";
import GamePreviewBlockThin from "../../game/gamePreview/GamePreviewBlockThin";


const MainPageBody = (props) => {
    useEffect(() => {
        props.fetchGames(props.page)
    }, [])

    return (
        <div className={s.mainPageBody}>
            <div className={s.gamesList}>
                {
                    props.games.map((el, index) => el.is_wide ? <GamePreviewBlockWide key={index} game={el}/> : <GamePreviewBlockThin key={index} game={el}/>)
                }
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