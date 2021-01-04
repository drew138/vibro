import ListQuery from "../../../ui-elements/search/ListQuery";
import React from 'react'
import { history } from "../../../../history"


const columnDefs = [
  {
    headerName: "ID",
    field: "id",
    width: 150,
    filter: true,
  },
  {
    headerName: "Nombre",
    field: "name",
    filter: true,
    width: 300
  },
  {
    headerName: "Ciudad",
    field: "city",
    filter: true,
    width: 300
  },
  {
    headerName: "Nit",
    field: "nit",
    filter: true,
    width: 300
  }
]


class CompaniesList extends React.Component {
  

    render() {
      return (
        <React.Fragment>
          <ListQuery columnDefs={columnDefs} dataEndpoint={"api/users/list"}/>
        </React.Fragment>
      )
    }
  }
  
  export default CompaniesList