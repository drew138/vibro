const phone_regex = /^(((\(\+?\d{2,3}\))|(\+\d{2,3}))[\s-])?\d{3}[\s-]\d{4}([\s-]ext[\s-]\d{1,3})?$/

const isValidPhone = (phone) => {
    const regex = new RegExp(phone_regex)
    return regex.test(phone)
}


export default isValidPhone