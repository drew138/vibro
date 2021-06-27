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

export const setFullHierarchy = (fullHierarchy) => {
    return dispatch => {
        dispatch({
            type: "SET_FULL_HIERARCHY_STATE",
            payload: fullHierarchy
        })
    }
}

export const clearFullHierarchy = () => {
    return dispatch => {
        dispatch({
            type: "CLEAR_FULL_HIERARCHY_STATE",
        })
    }
}

