
const initialState = {
    title: "",
    success: true,
    show: false,
    alertText: ""
}

const alerts = (state = initialState, action) => {
    switch(action.type) {
        case "SET_ALERT_SHOW_TO_FALSE":
            return {...initialState}
        case "DISPLAY_SWEET_ALERT":
            return {...action.payload}
        default:
            return state
    }
}


export default alerts 