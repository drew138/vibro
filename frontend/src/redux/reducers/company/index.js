const initialState = {
	id: null,
	name: "",
	nit: "",
	address: "",
	phone: "",
	city: "",
	hierarchy: ""
}

const company = (state = initialState, action) => {
	switch (action.type) {
		case "CLEAR_COMPANY_STATE":
			return { ...initialState }
		case "SET_COMPANY_STATE":
			return { ...action.payload }
		case "SELECT_COMPANY_FOR_UPDATE":
			return { ...action.payload }
		default:
			return state
	}
}

export default company