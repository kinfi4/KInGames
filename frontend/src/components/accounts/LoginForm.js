
import React, {useState} from "react";
import s from './Accounts.module.css'
import {connect} from "react-redux";
import {login} from "../../redux/reducers/authReducer";
import {hideModalWindow, showModalWindow} from "../../redux/reducers/modalWindowReducer";
import RegisterForm from "./RegisterForm";


let LoginForm = (props) => {
    const [details, setDetails] = useState({username: '', password: ''})
    let onLoginSubmit = () => {
        props.loginHandler(details.username, details.password)
    }
    let onRegisterButtonClick = () => {
        props.hideWindow()
        props.showModalWindow(<RegisterForm />, 500, 600)
    }
    return (
        <div className={s.form}>
            <div className={s.upper_caption}>
                <h2>【﻿Ｌｏｇｉｎ】</h2>
            </div>

            <div className={s.inputBlock}>
                <input type="text" className={s.authInput} id={'username'}
                       onChange={e => setDetails({...details, username: e.target.value})}
                       value={details.username} placeholder={'Username'}/>

                <input type="password" className={s.authInput} id={'password'}
                       onChange={e => setDetails({...details, password: e.target.value})}
                       value={details.password} placeholder={'Password'}/>

                <button onClick={onLoginSubmit} className={s.submitButton}>Login</button>
            </div>

            <div className={s.bottomTextLogin}>
                New here? <span onClick={onRegisterButtonClick}>Register</span>
            </div>
        </div>
    )
}

let matStateToProps = (state) => {
    return {}
}

let mapDispatchToProps = (dispatch) => {
    return {
        loginHandler: (username, password) => dispatch(login(username, password)),
        hideWindow: () => dispatch(hideModalWindow),
        showModalWindow: (content, width=null, height=null) => dispatch(showModalWindow(content, width, height))
    }
}

export default connect(matStateToProps, mapDispatchToProps)(LoginForm)