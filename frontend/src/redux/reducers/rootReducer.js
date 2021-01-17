import { combineReducers } from "redux"
import calenderReducer from "./calendar/"
import customizer from "./customizer/"
import auth from "./auth/"
import navbar from "./navbar/Index"
import dataList from "./data-list/"
import users from "./users"
import alerts from "./alerts"

const rootReducer = combineReducers({
  calendar: calenderReducer,
  customizer,
  auth,
  navbar,
  dataList,
  users,
  alerts
})

export default rootReducer
