import { history } from "../../../history"
import axios from "axios"
import {
  LOGIN_WITH_JWT_ENDPOINT,
  GET_USER_WITH_JWT_ENDPOINT,
  REFRESH_JWT_ENDPOINT,

} from '../../../config'
import { requestInterceptor, responseInterceptordt } from "../../../axios/axiosInstance"
import localStorageService from "../../../axios/localStorageService"

export const loginWithUsernameAndPassword = user => {
  return async dispatch => {

    try {
      const res = await axios.post(LOGIN_WITH_JWT_ENDPOINT, {
        username: user.username,
        password: user.password
      })


      const values = {
        ...res.data
      }
      localStorageService.setUserValues(values);
      delete values["access"]
      delete values["refresh"]
      dispatch({
        type: "LOGIN_WITH_JWT",
        values
      })
      history.push("/")
    } catch (e) {
      const alerData = {
        title: "Error de Validación",
        success: false,
        show: true,
        alertText: Object.entries(e.response.data)[0][1]
      }
      dispatch({
        type: "DISPLAY_SWEET_ALERT",
        payload: alerData
      })
    }

  }
}




export const getUserWithJWT = () => {
  return async dispatch => {
    try {
      const res = await axios.get(GET_USER_WITH_JWT_ENDPOINT)
      const values = {
        ...res.data
      }
      localStorageService.setUserValues(values);
      dispatch({
        type: "LOGIN_WITH_JWT",
        values
      })
    } catch (e) {
      console.log(e)
      // history.push("/pages/login")
    }
  }
}

export const logoutWithJWT = () => {
  return dispatch => {
    dispatch({ type: "LOGOUT_WITH_JWT", payload: {} })
    history.push("/pages/login")
    localStorageService.clearToken();
    localStorageService.clearUserValues();
  }
}

