export const closeAlert = () => {
    return dispatch => {
        dispatch({
            type: "SET_ALERT_SHOW_TO_FALSE",
        })
    }
}

export const displayAlert = (data) => {
    return dispatch => {
        dispatch({
            type: "DISPLAY_SWEET_ALERT",
            payload: data
        })
    }
}