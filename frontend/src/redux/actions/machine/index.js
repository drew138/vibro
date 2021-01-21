import { CREATE_MACHINE_ENDPOINT } from "../../../config"
import axios from "axios"

export const setMachine = (machine, access) => {
    return async dispatch => {
  
      try {
        const res = await axios.post(CREATE_MACHINE_ENDPOINT, {
        // username: user.username,
        // password: user.password
        })

        dispatch({
          type: "SET_MACHINE_STATE",
          payload: machine  
        })

      } catch (e) {
        // const alerData = {
        //   title: "Error de Validación",
        //   success: false,
        //   show: true,
        //   alertText: Object.entries(e.response.data)[0][1]
        // }
        // dispatch({
        //   type: "DISPLAY_SWEET_ALERT",
        //   payload: alerData
        // })
      }
      
    }
  }