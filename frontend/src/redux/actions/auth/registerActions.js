import { history } from "../../../history"
import axios from "axios"
import { REGISTER_WITH_JWT_ENDPOINT } from "../../../config"


export const signupWithJWT = ( data ) => {
  return async dispatch => {
    try {
    
    const res = await axios.post(REGISTER_WITH_JWT_ENDPOINT, data)
    localStorage.setItem("token", res.data.access)
    localStorage.setItem("refresh", res.data.refresh)
    const tokens = {
      access: res.data.access,
      refresh: res.data.refresh
    }
    const values = { ...res.data.user }
    dispatch({
      type: "LOGIN_WITH_JWT",
      payload: { tokens, values }
    })
    const alertData = {
      title: "Registro Exitoso",
      success: true,
      show: true,
      alertText: "Su Cuenta Ha Sido Creada Exitosamente"
    }
    dispatch({
      type: "DISPLAY_SWEET_ALERT",
      payload: alertData
    })
    history.push("/")
    } catch (e) {
      const alertData = {
        title: "Error de Validación",
        success: false,
        show: true,
        alertText: Object.entries(e.response.data)[0][1][0]
      }
      dispatch({
        type: "DISPLAY_SWEET_ALERT",
        payload: alertData
      })
    }
  }
}
