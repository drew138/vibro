import { combineReducers } from "redux"
import { login } from "./loginReducer"
import { register } from "./registerReducers"
import { update } from './updateReducer'

const authReducers = combineReducers({
  login,
  register,
  update
})

export default authReducers
