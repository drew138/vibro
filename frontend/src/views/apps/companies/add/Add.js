import React from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink
} from "reactstrap"
import classnames from "classnames"
import { Briefcase } from "react-feather"
import AccountTab from "./Account"
import "../../../../assets/scss/pages/users.scss"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"

class UserEdit extends React.Component {
  state = {
    activeTab: "1"
  }

  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Agregar Empresa"
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
                    })}>
                    <Briefcase size={16} />
                    <span className="align-middle ml-50">Empresa</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <AccountTab />
            </CardBody>
          </Card>
        </Col>
      </Row>
      </React.Fragment>
    )
  }
}
export default UserEdit
