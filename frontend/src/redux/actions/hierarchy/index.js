export const setHierarchy = (hierarchy) => {
    return dispatch => {
        dispatch({
            type: "SET_HIERARCHY_STATE",
            payload: hierarchy
        })
    }
}

export const clearHierarchy = () => {
    return dispatch => {
        dispatch({
            type: "CLEAR_HIERARCHY_STATE",
        })
    }
}

