import axios from "axios"
// import { history } from "../../../history"
import {
  POST_COMPANY_ENDPOINT,
  PATCH_COMPANY_ENDPOINT
} from "../../../config"

// export const editCompany = () => {
//     return async dispatch => {
//         try {
//             const res = await axios.patch(PATCH_COMPANY_ENDPOINT)
//         } catch (e) {
//           console.log("Error al editar compañia")
//         }
//     }
// }

export const updateCompany = (company, id) => {
  return async dispatch => {

    try {
      const data = new FormData();
      Object.keys(company).forEach(key => data.append(key, company[key]));

      const res = await axios.patch(
        `${PATCH_COMPANY_ENDPOINT}${id}/`,
        data
      )
      dispatch({
        type: "UPDATE_COMPANY",
        payload: { ...res.data }
      })
      const alertData = {
        title: "Información de Empresa Actualizada Exitosamente",
        success: true,
        show: true,
        alertText: `Se Ha Actualizado Exitosamente la Información de ${res.data.name}`
      }
      dispatch({
        type: "DISPLAY_SWEET_ALERT",
        payload: alertData
      })
    } catch (e) {
      // console.log(e.response.data)
      const alerData = {
        title: "Error de Validación",
        success: false,
        show: true,
        alertText: Object.entries(e.response.data)[0][1][0]
      }
      dispatch({
        type: "DISPLAY_SWEET_ALERT",
        payload: alerData
      })
    }
  }
}

export const setCompany = (company) => {
  return dispatch => {
    dispatch({
      type: "SELECT_COMPANY_FOR_UPDATE",
      payload: company
    })
  }
}

export const createCompany = (company) => {
  return async dispatch => {
    try {
      const data = new FormData();
      Object.keys(company).forEach(key => data.append(key, company[key]));
      const res = await axios.post(POST_COMPANY_ENDPOINT, data)
      dispatch({
        type: "SET_COMPANY_STATE",
        payload: { ...res.data }
      })
      const alertData = {
        title: "Registro Exitoso",
        success: true,
        show: true,
        alertText: "Empresa creada exitosamente"
      }
      dispatch({
        type: "DISPLAY_SWEET_ALERT",
        payload: alertData
      })
      // history.push("/")
    } catch (e) {
      console.log(e)
      const alertData = {
        title: "Error de Validación",
        success: false,
        show: true,
        alertText: Object.entries(e.response.data)[0][1][0]
      }
      dispatch({
        type: "DISPLAY_SWEET_ALERT",
        payload: alertData
      })
    }
  }
}