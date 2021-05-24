import React, {useState} from "react";
import {connect} from "react-redux";
import s from './../../../../../accounts/Accounts.module.css'
import s2 from './EditProfile.module.css'
import {BASE_URL} from "../../../../../../config";
import {updateUserInfo} from "../../../../../../utils/manageUser";
import {hideModalWindow} from "../../../../../../redux/reducers/modalWindowReducer";


let EditProfileForm = (props) => {
    const [details, setDetails] = useState({
        first_name: props.user.first_name,
        last_name: props.user.last_name,
        preview_image: BASE_URL + props.user.kin_user.avatar.slice(1),
        imageOnLoad: null
    })

    let onImageLoad = (file) => {
        let reader = new FileReader()
        reader.onload = (ev) => {
            if(reader.readyState === 2){
                setDetails({...details, preview_image: reader.result, imageOnLoad: file})
            }
        }
        try{
            reader.readAsDataURL(file)
        }catch (e){}
    }

    let onSave = () => {
        props.hideWindow()
        props.updateUserInfo(details.first_name, details.last_name, details.imageOnLoad)
    }

    return (
        <>
            <h2 className={s2.title}>Edit Profile</h2>
            <div className={s2.inner}>
                <div>
                    <input type="file" className={s2.previewImage} id={'preview_image'}
                           onInput={event => onImageLoad(event.target.files[0])} accept={'image/*'}/>
                    <label htmlFor={'preview_image'} className={s2.previewImageLabel}
                           style={{backgroundImage: `url(${details.preview_image})`,
                               backgroundColor: '#fff',
                               backgroundRepeat: 'no-repeat',
                               backgroundPosition: 'center',
                               backgroundSize: 'cover'}} /> <br/>
                </div>
                <div className={s2.inputBlock}>
                    <label htmlFor={'first_name'}>First name</label>
                    <input type="text" className={s.authInput} id={'first_name'}
                           onChange={e => setDetails({...details, first_name: e.target.value})}
                           value={details.first_name} placeholder={'First Name'}/>

                    <label htmlFor={'last_name'}>Last name</label>
                    <input type="text" className={s.authInput} id={'last_name'}
                           onChange={e => setDetails({...details, last_name: e.target.value})}
                           value={details.last_name} placeholder={'Last Name'}/>

                </div>
            </div>
            <div className={s2.saveButton} onClick={onSave}>Save</div>
        </>
    )
}

let mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        hideWindow: () => dispatch(hideModalWindow),
        updateUserInfo: (first_name, last_name, image) => dispatch(updateUserInfo(first_name, last_name, image))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileForm)
