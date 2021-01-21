const initialState = {
    id: 0,
    identifier: 0,
    company: "",
    name: "",
    code: "",
    electric_feed: "",
    brand: "",
    power: "",
    power_units: "",
    norm: "",
    hierarchy: "",
    rpm: "",
    image: "",
    diagram: ""
}

const machine = (state = initialState, action) => {
    switch(action.type) {
        case "CLEAR_MACHINE_STATE":
            return {...initialState}
        case "SET_MACHINE_STATE":
            return {...action.payload}
        default:
            return state
    }
}


export default machine 