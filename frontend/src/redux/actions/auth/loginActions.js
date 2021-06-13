import { history } from "../../../history"
import axios from "axios"
import {
  LOGIN_WITH_JWT_ENDPOINT,
  GET_USER_WITH_JWT_ENDPOINT,
} from '../../../config'
import localStorageService from "../../../axios/localStorageService"

export const loginWithUsernameAndPassword = user => {
  return async dispatch => {

    try {
      const res = await axios.post(LOGIN_WITH_JWT_ENDPOINT, {
        username: user.username,
        password: user.password
      })


      const auth = {
        ...res.data
      }
      localStorageService.setUserValues(auth);
      delete auth["access"]
      delete auth["refresh"]
      dispatch({
        type: "LOGIN_WITH_JWT",
        auth
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
      const auth = {
        ...res.data
      }
      localStorageService.setUserValues(auth);
      dispatch({
        type: "LOGIN_WITH_JWT",
        auth
      })
    } catch (e) {
      console.log(e)
      // history.push("/pages/login")
    }
  }
}

export const logoutWithJWT = () => {
  return dispatch => {
    dispatch({ type: "LOGOUT_WITH_JWT" })
    history.push("/pages/login")
    localStorageService.clearToken();
    localStorageService.clearUserValues();
  }
}

