
export const requestHelper = async (func, params) => {
    try {
        const res = await func(...params)
        return [res.data, null]
    } catch (e) {
        return [null, e]
    }
}