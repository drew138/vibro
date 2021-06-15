// import { CREATE_MACHINE_ENDPOINT, PATCH_MACHINE_ENDPOINT } from "../../../config"
// import axios from "axios"

export const setMachine = (machine) => {
  return dispatch => {


    dispatch({
      type: "SET_MACHINE_STATE",
      payload: machine
    })


  }
}

export const clearMachine = () => {
  return dispatch => {
    dispatch({
      type: "CLEAR_MACHINE_STATE"
    })
  }
}

// export const createMachine = (machine) => {
//   return async dispatch => {
//     try {
//       const data = new FormData();
//       for (const [key, value] of Object.entries(machine)) {
//         if (value && value !== "N/A") {
//           if (key === "image" || key === "diagram") {
//             data.append(key, value)
//           } else {
//             // console.log(key)
//             data.append(key, value)
//           }
//         }
//       }
//       const res = await axios.post(CREATE_MACHINE_ENDPOINT, data)
//       dispatch({
//         type: "SET_MACHINE_STATE",
//         payload: res.data
//       })
//       const alerData = {
//         title: "Máquina Creada Exitosamente",
//         success: true,
//         show: true,
//         alertText: `${res.data.name} ha sido agregado a la lista de maquinas de esta empresa`
//       }
//       dispatch({
//         type: "DISPLAY_SWEET_ALERT",
//         payload: alerData
//       })
//     } catch (e) {
//       console.log(e.response.data)
//       const alerData = {
//         title: "Error de Validación",
//         success: false,
//         show: true,
//         alertText: Object.entries(e.response.data)[0][1]
//       }
//       dispatch({
//         type: "DISPLAY_SWEET_ALERT",
//         payload: alerData
//       })
//     }

//   }
// }

// export const updateMachine = (machine, id) => {
//   return async dispatch => {
//     try {
//       const data = new FormData();
//       for (const [key, value] of Object.entries(machine)) {
//         if (value && value !== "N/A") {
//           if (key === "image" || key === "diagram") {
//             data.append(key, value)
//           } else {
//             console.log(key)
//             data.append(key, value)
//           }
//         }
//       }
//       const res = await axios.patch(`${PATCH_MACHINE_ENDPOINT}${id}`, data)
//       dispatch({
//         type: "SET_MACHINE_STATE",
//         payload: res.data
//       })

//       const alerData = {
//         title: "Máquina Actualizada Exitosamente",
//         success: true,
//         show: true,
//         alertText: `${res.data.name} ha sido actualizada`
//       }


//       dispatch({
//         type: "DISPLAY_SWEET_ALERT",
//         payload: alerData
//       })
//     } catch (e) {
//       console.log(e.response.data)
//       const alerData = {
//         title: "Error de Validación",
//         success: false,
//         show: true,
//         alertText: Object.entries(e.response.data)[0][1]
//       }
//       dispatch({
//         type: "DISPLAY_SWEET_ALERT",
//         payload: alerData
//       })
//     }

//   }
// }


