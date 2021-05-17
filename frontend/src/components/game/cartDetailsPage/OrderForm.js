import React, {useState} from 'react';
import {connect} from "react-redux";
import s from './CartDetailsPage.module.css'
import gameDetailsPage from '../detailGamePage/GameDetailsPage.module.css'
import {makeOrder} from "../../../redux/reducers/cartReducer";
import {showMessage} from "../../../utils/messages";
import {NavLink} from "react-router-dom";
import {hideModalWindow} from "../../../redux/reducers/modalWindowReducer";


const OrderForm = (props) => {
    const [details, setDetails] = useState({
        firstName: props.user ? props.user.first_name : '',
        lastName: props.user ? props.user.last_name : '',
        email: props.user ? props.user.email: '',
        phone: '',
        comment: ''
    })

    return (
        <>
            <h2 style={{margin: '30px', textAlign: 'center'}}>ORDER FORM</h2>

            <div className={s.form}>
                <div>
                    <input className={s.textInput} type="text" value={details.firstName} id={'firstName'} onInput={e => setDetails({...details, firstName: e.target.value})} required={true}/>
                    <label className={s.label} htmlFor={'firstName'}>First Name</label>
                </div>

                <div>
                    <input className={s.textInput} type="text" value={details.lastName} id={'lastName'} onInput={e => setDetails({...details, lastName: e.target.value})} required={true}/>
                    <label className={s.label} htmlFor={'lastName'}>Last Name</label>
                </div>

                <div>
                    <input className={s.textInput} type="text" value={details.email} id={'email'} onInput={e => setDetails({...details, email: e.target.value})} required={true}/>
                    <label className={s.label} htmlFor={'email'}>Email</label>
                </div>

                <div>
                    <input className={s.textInput} type="text" value={details.phone} id={'phone'} onInput={e => setDetails({...details, phone: e.target.value})} required={true}/>
                    <label className={s.label} htmlFor={'phone'}>Phone</label>
                </div>
            </div>

            <div style={{textAlign: 'center'}}>
                <NavLink to={'/'} className={gameDetailsPage.buyButton} style={{margin: 'auto'}} onClick={() => {
                    showMessage([{message: 'You order successfully proceeded, you will get payment bill on your email.', type: 'success'}])
                    props.hideModalWindow()
                }}>
                    ORDER
                </NavLink>
            </div>
        </>
    );
};

let mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        makeOrder: () => dispatch(makeOrder),
        hideModalWindow: () => dispatch(hideModalWindow)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(OrderForm);