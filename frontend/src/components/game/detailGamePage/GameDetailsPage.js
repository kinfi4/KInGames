import React, {useLayoutEffect} from 'react';
import {connect} from "react-redux";
import s from './GameDetailsPage.module.css'
import gamePage from '../detailGamePage/GameDetailsPage.module.css'
import {fetchGame} from "../../../redux/reducers/gameListReducer";
import {BASE_URL} from "../../../config";
import {manageCartGames} from "../../../redux/reducers/cartReducer";
import {fetchTopLevelComments} from "../../../redux/reducers/commentReducer";
import Comments from "./Comments/Comments";


let GameDetailsPage = (props) => {
    useLayoutEffect(() => {
        let urlBlocks = window.location.href.split('/')
        let gameSlug = urlBlocks[urlBlocks.length - 1]

        props.fetchGame(gameSlug)
        props.fetchTopLevelComments(gameSlug)
    }, [])

    return props.game && <GameDetailsPageChild game={props.game} {...props} />
}

const GameDetailsPageChild = (props) => {
    let blockType = props.game.is_wide ? s.wide : s.thin

    return (
        <div className={s.inner}>
            <div className={`${s.gameDetailsBlock} ${blockType}`}>
                <div className={`${s.previewImage} ${blockType}`} style={{
                    backgroundImage: `url(${BASE_URL}${props.game.preview_image.slice(1)})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundColor: `#404040`,
                    backgroundRepeat: 'no-repeat'
                }}> </div>

                <div className={`${s.detailsBlock} ${blockType}`}>
                    <h1>{props.game.title}</h1>
                    <h2>${props.game.price}</h2>
                    <div className={s.descriptionBlock}>{props.game.description}</div>
                    <div className={s.buyButton} onClick={() => props.addGameToCart(props.game.slug)}>ADD TO CART</div>
                </div>
            </div>

            <hr style={{backgroundColor: '#666666', marginTop: '40px'}}/>

            <Comments slug={props.game.slug} />
        </div>
    );
};

let mapStateToProps = (state) => {
    return {
        game: state.listGames.activeGame,
        comments: state.comment.topLevelComments,
        user: state.auth.user
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        fetchGame: (slug) => dispatch(fetchGame(slug)),
        addGameToCart: (slug) => dispatch(manageCartGames(slug, true, false)),
        fetchTopLevelComments: (slug) => dispatch(fetchTopLevelComments(slug))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(GameDetailsPage);