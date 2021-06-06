import localStorageService from "../../../axios/localStorageService"

const values = localStorageService.getUserValues();


const auth = (state = { values }, action) => {
  switch (action.type) {
    case "LOGIN_WITH_JWT": {
      return {
        ...state,
        values: action.values,
      }
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
        values: { ...state.values, ...action.values }
      }
    }
    default: {
      return state
    }
  }
}

export default auth