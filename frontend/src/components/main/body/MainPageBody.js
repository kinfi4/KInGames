import React from 'react';
import s from './MainPageBody.module.css'
import {connect} from "react-redux";


const MainPageBody = () => {
    return (
        <div className={s.mainPageBody}>

        </div>
    );
};

export default connect()(MainPageBody);