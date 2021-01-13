const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

const isValidPassword = (password) => {
    const regex = new RegExp(password_regex)
    return regex.test(password)
}


export default isValidPassword