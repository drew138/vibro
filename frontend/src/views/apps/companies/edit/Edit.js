import React from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap"
import classnames from "classnames"
import { Briefcase, List, Upload } from "react-feather"
import CompanyTab from "./Company"
import "../../../../assets/scss/pages/users.scss"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import ListMachines from "./List"
import AddMachine from "./AddMachine"

class CompanyEdit extends React.Component {
  state = {
    activeTab: "1"
  }

  toggle = tab => {
    this.setState({
      activeTab: tab
    })
  }

  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Editar Empresa"
          breadCrumbParent="Lista"
          breadCrumbActive="Editar"
        />
      <Row>
        <Col sm="12">
          <Card>
            <CardBody className="pt-2">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "1"
                    })}
                    onClick={() => {
                      this.toggle("1")
                    }}
                    >
                    <Briefcase size={16} />
                    <span className="align-middle ml-50">Editar</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "2"
                    })}
                    onClick={() => {
                      this.toggle("2")
                    }}
                    >
                    <List size={16} />
                    <span className="align-middle ml-50">Maquinas</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "3"
                    })}
                    onClick={() => {
                      this.toggle("3")
                    }}
                    >
                    <Upload size={16} />
                    <span className="align-middle ml-50">Agregar Máquina</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <CompanyTab />
                </TabPane>
                <TabPane tabId="2">
                  <ListMachines/>
                </TabPane>
                <TabPane tabId="3">
                  <AddMachine/>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
      </React.Fragment>
    )
  }
}
export default CompanyEdit
