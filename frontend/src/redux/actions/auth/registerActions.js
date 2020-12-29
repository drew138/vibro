import * as firebase from "firebase/app"
import { history } from "../../../history"
import "firebase/auth"
import "firebase/database"
import axios from "axios"
import { config } from "../../../authServices/firebase/firebaseConfig"

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

export const signupWithJWT = (username, first_name, last_name, email, password, celphone) => {
  return async dispatch => {
    try {
      let res = await axios.post("http://127.0.0.1:8000/api/auth/register", {
      username,
      first_name,
      last_name,
      email,
      password,
      celphone
    })
    localStorage.setItem("token", res.data.access)
    localStorage.setItem("refresh", res.data.refresh)
    let user = res.data.user
    user["access"] = res.data["access"]
    user["refresh"] = res.data["refresh"]
    dispatch({
      type: "LOGIN_WITH_JWT",
      payload: { ...user, loggedInWith: "jwt" }
    })
    history.push("/")
    } catch (e) {
      console.log(e)
    }
  }
}
