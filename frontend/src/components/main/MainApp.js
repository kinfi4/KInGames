import React from "react";
import s from './MainApp.module.css'
import Header from "./header/Header";
import ModalWindow from "../crumbs/ModalWindow/ModalWindow";
import ReactNotifications from 'react-notifications-component';
import MainPageBody from "./body/MainPageBody";
import Footer from "./footer/Footer";
import {Route} from 'react-router-dom'
import GameDetailsPage from "../game/detailGamePage/GameDetailsPage";


let MainApp = (props) => {
    return (
        <>
            <ReactNotifications />
            <ModalWindow />
            <Header />

            <Route exact path={'/'} render={() => <MainPageBody />} />
            <Route path={'/games/'} render={() => <GameDetailsPage />} />
            {/*<Footer />*/}
        </>
    )
}

export default MainApp
