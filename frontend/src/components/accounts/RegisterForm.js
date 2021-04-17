import React, {useState} from "react";
import s from './Accounts.module.css'
import {connect} from "react-redux";
import {register} from "../../redux/reducers/authReducer";
import {hideModalWindow, showModalWindow} from "../../redux/reducers/modalWindowReducer";
import LoginForm from "./LoginForm";


let RegisterForm = (props) => {
    const [details, setDetails] = useState({first_name: '', last_name: '', username: '', email: '', password1: '', password2: ''})
    let onRegisterSubmit = () => {
        props.registerHandler(details.first_name, details.last_name, details.username, details.email, details.password1, details.password2)
    }

    let onLoginButtonClick = () => {
        props.hideWindow()
        props.showModalWindow(<LoginForm />, 500, 200)
    }

    return (
        <div className={s.form}>
            <div className={s.upper_caption}>
                <h2>【﻿Ｒｅｇｉｓｔｅｒ】</h2>
            </div>

            <div className={s.inputBlock + ' form-group'}>
                <input type="text" className={s.authInput} id={'first_name'}
                       onChange={e => setDetails({...details, first_name: e.target.value})}
                       value={details.first_name} placeholder={'First Name'}/>

                <input type="text" className={s.authInput} id={'last_name'}
                       onChange={e => setDetails({...details, last_name: e.target.value})}
                       value={details.last_name} placeholder={'Last Name'}/>

                <input type="text" className={s.authInput} id={'username'}
                       onChange={e => setDetails({...details, username: e.target.value})}
                       value={details.username} placeholder={'Username'}/>

                <input type="email" className={s.authInput} id={'email'}
                       onChange={e => setDetails({...details, email: e.target.value})}
                       value={details.email} placeholder={'Email'}/>

                <input type="password" className={s.authInput} id={'password1'}
                       onChange={e => setDetails({...details, password1: e.target.value})}
                       value={details.password1} placeholder={'Password'}/>

                <input type="password" className={s.authInput} id={'password2'}
                       onChange={e => setDetails({...details, password2: e.target.value})}
                       value={details.password2} placeholder={'Confirm password'}/>

                <button onClick={onRegisterSubmit} className={s.submitButton}>Register</button>
            </div>

            <div className={s.bottomTextRegister}>
                Already have an account? <span onClick={onLoginButtonClick}>Login</span>
            </div>
        </div>
    )
}

let matStateToProps = (state) => {
    return {}
}

let mapDispatchToProps = (dispatch) => {
    return {
        registerHandler: (first_name, last_name, username, email, password1, password2) =>
            dispatch(register(first_name, last_name, username, email, password1, password2)),
        hideWindow: () => dispatch(hideModalWindow),
        showModalWindow: (content, width=null, height=null) => dispatch(showModalWindow(content, width, height))
    }
}

export default connect(matStateToProps, mapDispatchToProps)(RegisterForm)