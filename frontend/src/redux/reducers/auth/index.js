import localStorageService from "../../../axios/localStorageService"

const initialState = localStorageService.getUserValues();


const auth = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_WITH_JWT": {
      return {
        // ...state,
        // values: action.values,
        ...action.auth
      }
    }
    case "LOGOUT_WITH_JWT": {
      return {
        // ...state,
        // values: action.payload,
        // tokens: action.payload
        ...initialState
      }
    }
    case "UPDATE_USER_PROFILE": {
      return {
        ...state,
        // values: { ...state.values, ...action.values }
        ...action.auth
      }
    }
    default: {
      return state
    }
  }
}

export default auth