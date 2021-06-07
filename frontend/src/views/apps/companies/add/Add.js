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
import { Briefcase, Columns } from "react-feather"
import Company from "./Company"
import Hierarchy from "./Hierarchy"
import "../../../../assets/scss/pages/users.scss"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"

class AddCompany extends React.Component {
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
          breadCrumbTitle="Agregar"
          breadCrumbParent="Empresas"
          breadCrumbActive="Agregar"
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
                      onClick={() => { this.toggle("1") }}
                    >
                      <Briefcase size={16} />
                      <span className="align-middle ml-50">Empresa</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "2"
                      })}
                      onClick={() => { this.toggle("2") }}
                    >
                      <Columns size={16} />
                      <span className="align-middle ml-50">Jerarquía</span>
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <Company />
                  </TabPane>
                  <TabPane tabId="2">
                    <Hierarchy />
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
export default AddCompany
