import {AiTwotoneStar} from "react-icons/all";
import React from "react";
import {connect} from "react-redux";
import {addGameMark, changeCurrentMark} from "../../../../redux/reducers/gameMarkReducer";
import s from '../GameDetailsPage.module.css'

const Star = (props) => {
    const starActiveClass = props.n <= props.curMark ? s.active : ''

    return (
        <div onClick={() => {props.changeGameMark(props.slug, props.n)}}
             className={starActiveClass}
             onMouseEnter={() => {props.changeCurMark(props.n)}}
             onMouseLeave={() => {
                 props.changeCurMark(Math.round(props.avg_mark))
             }}>
            <AiTwotoneStar />
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        curMark: state.marks.curMark,
        avg_mark: state.marks.avgMark
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        changeGameMark: (slug, mark) => dispatch(addGameMark(slug, mark)),
        changeCurMark: (mark) => dispatch(changeCurrentMark(mark))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Star)