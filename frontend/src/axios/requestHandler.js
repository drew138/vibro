const parsePostError = (error) => {

}

const parsePatchError = (error) => {

}

const parsePutError = (error) => {

}

const parseGetError = (error) => {

}

const parseDeleteError = (error) => {

}


const parseErrorData = (error) => {
    switch (error.config.method) {
        case "post":
            return parsePostError(error);
        case "patch":
            return parsePatchError(error);
        case "put":
            return parsePutError(error);
        case "get":
            return parseGetError(error);
        case "delete":
            return parseDeleteError(error);
        default:
            return ""
    }
}


const alertErrorHandler = (error) => {
    const alertData = {
        title: "",
        success: false,
        show: true,
        alertText: ""
    }
    if (error.response) {
        switch (error.response.status) {
            case 500:
                alertData.title = "Error De Conexión";
                alertData.alertText = "Ha Surgido Un Error De Servidor Al Realizar Esta Acción.";
                break;
            case 401:
                alertData.title = "Error De Autorización";
                alertData.alertText = parseErrorData(error);
                break;
            case 400:
                alertData.title = "Error De Validación";
                alertData.alertText = parseErrorData(error);
                break;
            default:
                alertData.title = "Error";
                alertData.alertText = "Ha Surgido Al Realizar Esta Acción.";
                break;
        }
        return alertData
    }

    alertData.title = "Error"
    alertData.alertText = "Ha Surgido Al Realizar Esta Acción."
    return alertData
}


const alertResponseHandler = (title, message) => {
    return {
        title: title,
        success: true,
        show: true,
        alertText: message
    }
}


const requestHandler = async (func, args, title, message) => {
    try {
        const res = await func(...args)
        return [res.data, alertResponseHandler(title, message)]
    } catch (e) {
        return [null, alertErrorHandler(e)]
    }
}

export default requestHandler