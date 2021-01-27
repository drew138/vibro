const initialState = {
    id: 0,
    name: "",
    nit: "",
    address: "",
    phone: "",
    city: "",
    hierarchy: ""
  }
  
const calenderReducer = (state = initialState, action) => {
switch (action.type) {
    case "CLEAR_COMPANY_STATE":
        return { ...initialState }
    case "SET_COMPANY_STATE":
        return { ...action.payload }
    default:
        return state
    }
}

export default calenderReducer