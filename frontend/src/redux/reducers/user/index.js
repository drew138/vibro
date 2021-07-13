const initialState = {
    id: 0,
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    is_active: false,
    is_staff: false,
    is_superuser: false,
    celphone: "",
    phone: "",
    company: "",
    picture: "",
    user_type: "client",
}

const user = (state = initialState, action) => {
    switch (action.type) {
        case "SELECT_USER_FOR_UPDATE":
            return { ...action.payload }
        case "UPDATE_USER":
            return { ...action.payload }
        default:
            return state
    }
}

export default user