import React from "react"
// import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
// import ListViewConfig from "./DataListConfig"
// import queryString from "query-string"
import MachineList from './Machines'

class MonitoringSearch extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Monitoreo en Linea"
          breadCrumbParent="Servicios"
          breadCrumbActive="Monitoreo"
        />
        <MachineList/>
      </React.Fragment>
    )
  }
}

export default MonitoringSearch
