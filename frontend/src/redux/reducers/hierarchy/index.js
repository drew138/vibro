const initialState = {
    id: 0,
    parent: 0,
    company: 0,
    name: "",
    parentName: "",
    fullHierarchy: ""
}

const hierarchy = (state = initialState, action) => {
    switch (action.type) {
        case "SET_HIERARCHY_STATE":
            return { ...action.payload }
        case "CLEAR_HIERARCHY_STATE":
            return { ...initialState }
        case "SET_FULL_HIERARCHY_STATE":
            return { ...state, fullHierarchy: action.payload }
        case "CLEAR_FULL_HIERARCHY_STATE":
            return { ...state, fullHierarchy: "" }
        default:
            return state
    }
}


export default hierarchy