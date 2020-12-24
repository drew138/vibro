import React from "react"
import { Row, Col } from "reactstrap"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListViewConfig from "./DataListConfig"
import queryString from "query-string"
import UsersList from './View'

class MonitoringSearch extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Monitoreo en Linea"
          breadCrumbParent="Servicios"
          breadCrumbActive="Monitoreo"
        />
        <UsersList/>
        <Row>
          <Col sm="12">
            <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)}/>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default MonitoringSearch
