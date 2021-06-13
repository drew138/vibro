const phone_regex = /^\d{7}$/

const isValidPhone = (phone) => {
    const regex = new RegExp(phone_regex)
    return regex.test(phone)
}


export default isValidPhone