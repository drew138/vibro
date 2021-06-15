export const setMeasurement = (measurement) => {
  return dispatch => {
    dispatch({
      type: "SET_MEASUREMENT_STATE",
      payload: measurement
    })
  }
}

export const clearMeasurement = () => {
  return dispatch => {
    dispatch({
      type: "CLEAR_MEASUREMENT_STATE"
    })
  }
}

