import React, {useLayoutEffect} from 'react';
import {connect} from "react-redux";
import s from '../GameDetailsPage.module.css'
import Star from "./Star";
import {changeCurrentMark} from "../../../../redux/reducers/gameMarkReducer";

const EstimateGame = (props) => {
    useLayoutEffect(() => {
        props.changeCurMark(Math.round(props.avg_mark))
    })

    return (
        <div className={s.estimateForm}>
            <div>{[1,2,3,4,5,6,7,8,9,10].map(el => <Star n={el} key={el} slug={props.slug}/>)}</div>
            <div style={{fontWeight: 'bold', fontSize: '18px'}}>Average mark: {Number(props.avg_mark).toFixed(2)}</div>
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

let mapDispatchToProps = (dispatch) => {
    return {
        changeCurMark: (mark) => dispatch(changeCurrentMark(mark))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(EstimateGame);