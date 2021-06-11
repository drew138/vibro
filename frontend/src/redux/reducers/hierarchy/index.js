const initialState = {
    id: 0,
    parent: 0,
    company: 0,
    name: "",
    parentName: ""
}

const hierarchy = (state = initialState, action) => {
    switch (action.type) {
        case "SET_HIERARCHY_STATE":
            return { ...action.payload }
        case "CLEAR_HIERARCHY_STATE":
            return { ...initialState }
        default:
            return state
    }
}


export default hierarchy