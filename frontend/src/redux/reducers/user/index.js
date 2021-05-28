const initialState = {
    id: null,
    username: null,
    first_name: "",
    last_name: "",
    email: "",
    is_active: true,
    is_staff: false,
    is_superuser: false,
    celphone: "",
    phone: "",
    company: null,
    picture: null,
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