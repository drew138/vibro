
import axios from "axios"
import { UPDATE_USER_PROFILE_ENDPOINT } from '../../../config'

export const updateProfile = (user, token) => {
    return async dispatch => {
      try {
        const data = new FormData();
        data.append("first_name", user.first_name)
        data.append("last_name", user.last_name)
        data.append("phone", user.phone)
        data.append("ext", user.ext)
        data.append("celphone", user.celphone)
        data.append("email", user.email)
        if (user.selectedFile) {
          data.append("picture", user.selectedFile)
        }
        const res = await axios.patch(
          `${UPDATE_USER_PROFILE_ENDPOINT}${user.id}/`, 
          data, 
          { headers: { 'Authorization': `Bearer ${token}` } })
        dispatch({
          type: "LOGIN_WITH_JWT",
          payload: { ...res.data }
        })
      } catch (e) {
        console.log(e);
      }
    }
}