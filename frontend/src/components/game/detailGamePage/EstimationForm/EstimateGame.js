import React from 'react';
import {connect} from "react-redux";
import s from '../GameDetailsPage.module.css'
import Star from "./Star";

const EstimateGame = (props) => {
    return (
        <div className={s.estimateForm}>
            <div>{[1,2,3,4,5,6,7,8,9,10].map(el => <Star n={el} key={el} slug={props.slug}/>)}</div>
            <div style={{fontWeight: 'bold', fontSize: '18px'}}>Average mark: {props.avg_mark}</div>
            <div style={{fontWeight: 'bold', fontSize: '18px'}}>Estimated times: {props.estimatedTimes}</div>
        </div>
    );
};


let mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        estimatedTimes: state.marks.estimatedTimes,
        avg_mark: state.marks.avgMark
    }
}


export default connect(mapStateToProps)(EstimateGame);