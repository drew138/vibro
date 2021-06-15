const initialState = {
    id: 0,
    service: "predictivo",
    measurement_type: "vibración",
    date: null,
    analysis: "",
    diagnostic: "",
    severity: "purple",
    engineer_one: 0,
    engineer_two: 0,
    analyst: 0,
    certifier: 0,
    machine: 0,
    revised: false,
    resolve: false,
    prev_changes: "",
    prev_changes_date: null
}

const measurement = (state = initialState, action) => {
    switch (action.type) {
        case "CLEAR_MEASUREMENT_STATE":
            return { ...initialState }
        case "SET_MEASUREMENT_STATE":
            return { ...action.payload }
        default:
            return state
    }
}


export default measurement