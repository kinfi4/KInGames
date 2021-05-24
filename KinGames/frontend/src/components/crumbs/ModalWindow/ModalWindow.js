import React from "react";
import s from './ModalWindow.module.css'
import {connect} from "react-redux";
import {hideModalWindow} from "../../../redux/reducers/modalWindowReducer";

let ModalWindow = (props) => {
    return (
        <div className={props.active ? `${s.overflow} ${s.active}` : s.overflow} onClick={() => props.hideWindow() }>
            <div className={s.inner} style={{
                width: props.width ? props.width + 'px' : 500 + 'px',
                height: props.height ? props.height + 'px' : 600 + 'px'
            }} onClick={e => e.stopPropagation() }>

                {props.child}
            </div>
        </div>
    )
}


let mapStateToProps = (state) => {
    return {
        active: state.modalWindow.active,
        child: state.modalWindow.modalWindowContent,
        width: state.modalWindow.width,
        height: state.modalWindow.height
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        hideWindow: () => dispatch(hideModalWindow)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ModalWindow)