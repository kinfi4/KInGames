import React, {useState} from 'react';
import {connect} from "react-redux";
import s from './CartDetailsPage.module.css'
import gameDetailsPage from '../detailGamePage/GameDetailsPage.module.css'


const OrderForm = (props) => {
    const [details, setDetails] = useState({
        firstName: props.user.first_name,
        lastName: props.user.last_name,
        email: props.user.email,
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

            <div className={gameDetailsPage.buyButton} style={{margin: 'auto'}}>
                ORDER
            </div>
        </>
    );
};

let mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(OrderForm);