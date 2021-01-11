import React from "react"
import {
  Card,
  CardBody,
  // CardHeader,
  // CardTitle,
  // FormGroup,
  // Label,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  // UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  // Collapse,
  // Spinner
} from "reactstrap"
import axios from "axios"
import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  // Edit,
  // Trash2,
  ChevronDown,
  // Clipboard,
  // Printer,
  // Download,
  // RotateCw,
  // X
} from "react-feather"
// import classnames from "classnames"
import { history } from "../../../../history"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import ListQuery from "../../../ui-elements/search/ListQuery";
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"

const columnDefs = [
  {
    headerName: "ID",
    field: "id",
    width: 150,
    filter: true,
    // checkboxSelection: true,
    // headerCheckboxSelectionFilteredOnly: true,
    // headerCheckboxSelection: true
  },
  {
    headerName: "Nombre",
    field: "name",
    filter: true,
    width: 250,
    cellRendererFramework: params => {
      return (
        <div
          className="d-flex align-items-center cursor-pointer"
          onClick={() => history.push("/app/user/edit")}
        >
          <img
            className="rounded-circle mr-50"
            src={params.data.avatar}
            alt="user avatar"
            height="30"
            width="30"
          />
          <span>{params.data.name}</span>
        </div>
      )
    }
  },
  {
    headerName: "Código",
    field: "code",
    filter: true,
    width: 250
  },
  {
    headerName: "Jerarquía",
    field: "name",
    filter: true,
    width: 250
  },
  {
    headerName: "Marca",
    field: "brand",
    filter: true,
    width: 250
  }
]

class UsersList extends React.Component {
  

  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Monitoreo en Linea"
          breadCrumbParent="Servicios"
          breadCrumbActive="Monitoreo"
        />
        <ListQuery columnDefs={columnDefs} dataEndpoint={"api/users/list"}/>
      </React.Fragment>
    )
  }
}

export default UsersList
