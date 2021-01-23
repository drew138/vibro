import { combineReducers } from "redux"
import calenderReducer from "./calendar/"
import customizer from "./customizer/"
import auth from "./auth"
import navbar from "./navbar/Index"
import dataList from "./data-list/"
import user from "./user"
import alerts from "./alert"
import machine from "./machine"
import company from "./company"

const rootReducer = combineReducers({
  calendar: calenderReducer,
  customizer,
  auth,
  navbar,
  dataList,
  user,
  alerts,
  company,
  machine
})

export default rootReducer
