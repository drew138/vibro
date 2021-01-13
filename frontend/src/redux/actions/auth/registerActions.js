import * as firebase from "firebase/app"
import { history } from "../../../history"
import "firebase/auth"
import "firebase/database"
import axios from "axios"
import { config } from "../../../authServices/firebase/firebaseConfig"
import { REGISTER_WITH_JWT_ENDPOINT } from "../../../config"

// Init firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

let firebaseAuth = firebase.auth()

export const signupWithFirebase = (email, password, name) => {
  return dispatch => {
    let userEmail = null,
      loggedIn = false
    // userName = null

    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        firebaseAuth.onAuthStateChanged(user => {
          result.user.updateProfile({
            displayName: name
          })
          if (user) {
            userEmail = user.email
            // let userName = user.displayName
            loggedIn = true
            dispatch({
              type: "SIGNUP_WITH_EMAIL",
              payload: {
                email: userEmail,
                name,
                isSignedIn: loggedIn
              }
            })
            dispatch({
              type: "LOGIN_WITH_EMAIL",
              payload: {
                email: userEmail,
                name
              }
            })
          }
        })
        history.push("/")
      })
      .catch(error => {
        console.log(error.message)
      })
  }
}

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
