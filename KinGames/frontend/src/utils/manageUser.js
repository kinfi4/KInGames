import axios from "axios";
import {BASE_URL} from "../config";
import {showMessage} from "./messages";
import {loadUser} from "../redux/reducers/authReducer";

export let deleteAccount = () => {
    const token = localStorage.getItem('token')
    axios.delete(BASE_URL + 'api/v1/user', {
        headers: {
            'Authorization': `Token ${token}`
        }
    }).then(res => {})
      .catch(err => {
        let errors = Object.values(err.response.data).flat()
        showMessage(errors.map((err) => {
            return {message: err, type: 'danger'}
        }))
      })
}

export let updateUserInfo = (first_name, last_name, avatar) => (dispatch) => {
    let formData = new FormData()
    let authToken = localStorage.getItem('token')

    formData.append('first_name', first_name)
    formData.append('last_name', last_name)

    if (avatar !== null)
        formData.append('avatar', avatar, avatar.name)

    axios.put(BASE_URL + 'api/v1/user', formData, {
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': `Token ${authToken}`
        }
    }).then(res => {
        console.log(res.data)
        dispatch(loadUser())
        showMessage([{message: 'Profile updated', type: 'success'}])
    }).catch(er => showMessage({message: er.response.data, type: 'danger'}))
}
