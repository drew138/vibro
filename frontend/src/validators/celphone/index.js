const celphone_regex = /^\d{10}$/


const isValidCelphone = (celphone) => {
    const regex = new RegExp(celphone_regex)
    return regex.test(celphone)
}


export default isValidCelphone