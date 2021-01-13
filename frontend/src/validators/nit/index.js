const nit_regex = /^[0-9]+-{1}[0-9]{1}$/

const isValidNit = (nit) => {
    const regex = new RegExp(nit_regex)
    return regex.test(nit)
}


export default isValidNit