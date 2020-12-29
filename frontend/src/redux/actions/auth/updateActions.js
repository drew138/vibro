import "firebase/auth"
import "firebase/database"
import axios from "axios"
import { UPDATE_USER_PROFILE_ENDPOINT } from '../../../config'

export const updateProfile = user => {
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
        const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjA5MjM5NTA2LCJqdGkiOiI0ZTZmNjQ3ZjViMjE0ZDdjOGEzMmQ1ZDNiOWRhOTBiZSIsInVzZXJfaWQiOjE2fQ.urXNsD83xn53-tzYHQoPVpdXY3tFmhDdwCe1g7D-B5w"
        const res = await axios.patch(
          `${UPDATE_USER_PROFILE_ENDPOINT}${user.id}/`, 
          data, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
          )
        const da = res.data
        console.log({da})
        dispatch({
          type: "LOGIN_WITH_JWT",
          payload: { ...res.data }
        })
        // return undefined
      } catch (e) {
        console.log(e);
        // return e
      }
    }
}