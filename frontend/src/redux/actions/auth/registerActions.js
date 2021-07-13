import { history } from "../../../history"
import axios from "axios"
import { REGISTER_WITH_JWT_ENDPOINT } from "../../../config"
import localStorageService from "../../../axios/localStorageService"

export const signupWithJWT = (data) => {
  return async dispatch => {
    try {

      const res = await axios.post(REGISTER_WITH_JWT_ENDPOINT, data)
      // localStorage.setItem("token", res.data.access)
      // localStorage.setItem("refresh", res.data.refresh)

      const auth = {
        ...res.data.user,
        access: res.data.access,
        refresh: res.data.refresh
      }
      localStorageService.setUserValues(auth)
      delete auth["access"]
      delete auth["refresh"]
      dispatch({
        type: "LOGIN_WITH_JWT",
        auth
      })
      const alertData = {
        title: "Registro Exitoso",
        success: true,
        show: true,
        alertText: "Su Cuenta Ha Sido Creada Exitosamente"
      }
      await dispatch({
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
