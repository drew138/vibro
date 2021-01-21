const celphone_regex = /^(((\(\+?\d{2,3}\))|(\+\d{2,3}))[\s-])?\d{3}[\s-]\d{3}[\s-]\d{4}$/


const isValidCelphone = (celphone) => {
    const regex = new RegExp(celphone_regex)
    return regex.test(celphone)
}


export default isValidCelphone