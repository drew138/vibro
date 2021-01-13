import ListQuery from "../../../ui-elements/search/ListQuery";
import React from 'react'
import { history } from "../../../../history"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import {GET_COMPANIES_ENDPOINT} from '../../../../config'

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
          <Breadcrumbs
          breadCrumbTitle="Lista de Empresas"
          breadCrumbParent="Empresas"
          breadCrumbActive="Lista"
          />
          <ListQuery columnDefs={columnDefs} dataEndpoint={GET_COMPANIES_ENDPOINT}/>
        </React.Fragment>
      )
    }
  }
  
  export default CompaniesList