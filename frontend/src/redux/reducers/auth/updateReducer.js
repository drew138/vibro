export const update = (state = {}, action) => {
    switch (action.type) {
      case "UPDATE_USER_PROFILE":
        return {
          ...state,
          values: {...state.values, ...action.payload}
        }
      default: {
        return state
      }
    }
  }