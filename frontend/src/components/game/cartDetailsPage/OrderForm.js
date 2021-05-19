import React, {useState} from 'react';
import {connect} from "react-redux";
import s from './CartDetailsPage.module.css'
import gameDetailsPage from '../detailGamePage/GameDetailsPage.module.css'
import {makeOrder} from "../../../redux/reducers/cartReducer";
import {NavLink} from "react-router-dom";


const OrderForm = (props) => {
    const [details, setDetails] = useState({
        first_name: props.user ? props.user.first_name : '',
        last_name: props.user ? props.user.last_name : '',
        email: props.user ? props.user.email: '',
        phone: ''
    })

    return (
        <>
            <h2 style={{margin: '30px', textAlign: 'center'}}>ORDER FORM</h2>

            <div className={s.form}>
                <div>
                    <input className={s.textInput} type="text" value={details.first_name} id={'firstName'} onInput={e => setDetails({...details, first_name: e.target.value})} required={true}/>
                    <label className={s.label} htmlFor={'firstName'}>First Name</label>
                </div>

                <div>
                    <input className={s.textInput} type="text" value={details.last_name} id={'lastName'} onInput={e => setDetails({...details, last_name: e.target.value})} required={true}/>
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
                <div className={gameDetailsPage.buyButton} style={{margin: 'auto'}} onClick={() => {
                    props.makeOrder(details)
                }}>
                    ORDER
                </div>
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
        makeOrder: (data) => dispatch(makeOrder(data)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(OrderForm);