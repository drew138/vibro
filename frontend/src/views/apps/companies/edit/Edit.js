import React from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  // TabContent,
  // TabPane
} from "reactstrap"
import classnames from "classnames"
import { User
  // , Info, Share 
} from "react-feather"
import AccountTab from "./Account"
// import InfoTab from "./Information"
// import SocialTab from "./Social"
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
          breadCrumbTitle="Editar Usuario"
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
                    })}>
                    <User size={16} />
                    <span className="align-middle ml-50">Cuenta</span>
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
