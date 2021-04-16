import React from "react";
import s from './MainApp.module.css'
import Header from "./header/Header";
import ModalWindow from "../crumbs/ModalWindow/ModalWindow";


let MainApp = (props) => {
    return (
        <>
            <ModalWindow />
            <Header />
        </>
    )
}

export default MainApp
