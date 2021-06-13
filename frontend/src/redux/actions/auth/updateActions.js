
import axios from "axios"
import { UPDATE_USER_PROFILE_ENDPOINT } from '../../../config'

export const updateProfile = (user, id) => {
  return async dispatch => {
    try {

      const data = new FormData();
      Object.keys(user).forEach(key => data.append(key, user[key]));
      const res = await axios.patch(
        `${UPDATE_USER_PROFILE_ENDPOINT}${id}/`,
        data)
      const values = { ...res.data }
      dispatch({
        type: "UPDATE_USER_PROFILE",
        values
      })
      const alertData = {
        title: "Información de Usuario Actualizada Exitosamente",
        success: true,
        show: true,
        alertText: "Se Ha Actualizado Exitosamente su Información de Usuario"
      }

      dispatch({
        type: "DISPLAY_SWEET_ALERT",
        payload: alertData
      })
    } catch (e) {
      console.log(e)
      // const alerData = {
      //   title: "Error de Validación",
      //   success: false,
      //   show: true,
      //   alertText: Object.entries(e.response.data)[0][1][0]
      // }
      // dispatch({
      //   type: "DISPLAY_SWEET_ALERT",
      //   payload: alerData
      // })
    }
  }
}