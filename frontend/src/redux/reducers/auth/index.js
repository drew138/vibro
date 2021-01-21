const auth = (state = { userRole: "client" }, action) => {
  switch (action.type) {
    case "LOGIN_WITH_JWT": {
      return { 
        ...state, 
        values: action.values,
      }
    }
    case "SET_JWTS": {
      return { ...state, tokens: action.payload }
    }
    case "LOGOUT_WITH_JWT": {
      return { 
        ...state,
        values: action.payload,
        tokens: action.payload
      }
    }
    case "UPDATE_USER_PROFILE": {
      return {
        ...state,
        values: {...state.values, ...action.values}
      }
    }
    case "CHANGE_ROLE": {
      return { ...state, userRole: action.userRole }
    }
    default: {
      return state
    }
  }
}

export default auth