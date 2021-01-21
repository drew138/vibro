import { history } from "../../../history"
import axios from "axios"
import { 
  LOGIN_WITH_JWT_ENDPOINT, 
  GET_USER_WITH_JWT_ENDPOINT, 
  REFRESH_JWT_ENDPOINT } from '../../../config'


export const loginWithJWT = user => {
  return async dispatch => {

    try {
      const res = await axios.post(LOGIN_WITH_JWT_ENDPOINT, {
      username: user.username,
      password: user.password
      })
      localStorage.setItem("access", res.data.access)
      localStorage.setItem("refresh", res.data.refresh)
      const tokens = {
        access: res.data.access,
        refresh: res.data.refresh
      }
      dispatch({
        type: "SET_JWTS",
        payload: tokens  
      })
      dispatch({
        type: "CHANGE_ROLE",
        userRole: res.data.user_type  
      })
      const values = {
        ...res.data
      }
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

export const refreshJWT = ( refresh ) => {
  return async dispatch => {
    // const refresh = localStorage.getItem("refresh")
    const res = axios.get(REFRESH_JWT_ENDPOINT, { refresh })
    localStorage.setItem("access", res.data.access)
    localStorage.setItem("refresh", res.data.refresh)
    dispatch({
      type: "SET_JWTS",
      payload: { ...res.data } 
    })
    // history.push("/pages/login")
  }
}

export const refreshJWTAndLogin = async (refresh) => {
  return async dispatch => {

    try {
      // const refresh = localStorage.getItem("refresh")
      let res = axios.get(REFRESH_JWT_ENDPOINT, { refresh })
      localStorage.setItem("access", res.data.access)
      localStorage.setItem("refresh", res.data.refresh)
      dispatch({
        type: "SET_JWTS",
        payload: { ...res.data } 
      })
      res = await axios.post(LOGIN_WITH_JWT_ENDPOINT, 
        { headers: {'Authorization': `Bearer ${res.data.access}`} })
      const values = {
        ...res.data
      }
      dispatch({
        type: "CHANGE_ROLE",
        userRole: res.data.user_type  
      })
      delete values["access"]
      delete values["refresh"]
      dispatch({
        type: "LOGIN_WITH_JWT",
        values
      })
    } catch (e) {

      history.push("/pages/login")
    }
  }
}


export const getUserWithJWT = ( access ) => {
  return async dispatch => {
    try {
      // const access = localStorage.getItem("access")
      const res = axios.get(
        GET_USER_WITH_JWT_ENDPOINT, 
        { headers: {'Authorization': `Bearer ${access}`} })
      dispatch({
          type: "LOGIN_WITH_JWT",
          values: { ...res.data } 
      })
      dispatch({
        type: "CHANGE_ROLE",
        userRole: res.data.user_type  
      })
    } catch (e) {

    }
  }
}

export const logoutWithJWT = () => {
  return dispatch => {
    dispatch({ type: "LOGOUT_WITH_JWT", payload: {} })
    history.push("/pages/login")
  }
}

export const changeRole = role => {
  return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
}
