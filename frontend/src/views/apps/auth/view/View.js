import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Media,
  Row,
  Col,
  Button,
  // Table
} from "reactstrap"
import { Edit, 
  // Trash
  // , Lock, Check 
} from "react-feather"
import { Link } from "react-router-dom"
// import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
// import userImg from "../../../../assets/img/portrait/small/avatar-s-18.jpg"
import "../../../../assets/scss/pages/users.scss"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import { connect } from "react-redux"



const user_type_map = {
  'admin': "Admin",
  'engineer': "Ingeniero",
  'client': "Cliente",
  'support': "Soporte",
  'arduino': "Arduino"
}


class UserView extends React.Component {
  //  componentWillMount = () => {
    
  //   if (!this.props.user.login.values) {
  //     history.push("/pages/login")
  //   }
  // }

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  getFullName() {
    if (this.props.user.login.values.first_name && this.props.user.login.values.last_name) {
      return `${this.props.user.login.values.first_name} ${this.props.user.login.values.last_name}`
    } else if (this.props.user.login.values.first_name) {
      return this.props.user.login.values.first_name
    } else {
      return "N/A"
    }
  }

  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Perfil de Usuario"
          breadCrumbParent="Usuario"
          breadCrumbActive="Perfil"
        />
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
              </CardHeader>
              <CardBody>
                <Row className="mx-0" col="12">
                  <Col className="pl-0" sm="12">
                    <Media className="d-sm-flex d-block">
                      <Media className="mt-md-1 mt-0" left>
                        <Media
                          className="rounded mr-2"
                          object
                          src={
                            this.props.user.login.values.picture
                          }
                          alt="Generic placeholder image"
                          height="112"
                          width="112"
                        />
                      </Media>
                      <Media body>
                        <Row>
                          <Col sm="9" md="6" lg="5">
                            <div className="users-page-view-table">
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Usuario
                                </div>
                                <div>{this.props.user.login.values.username}</div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Nombre
                                </div>
                                <div>
                                {
                                this.toTitleCase(this.getFullName())
                                }
                                </div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Email
                                </div>
                                <div className="text-truncate">
                                  <span>{!this.props.user.login.values.email ? "N/A" : this.props.user.login.values.email}</span>
                                </div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Celular
                                </div>
                                <div className="text-truncate">
                                  <span>{!this.props.user.login.values.celphone ? "N/A" : this.props.user.login.values.celphone}</span>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col md="12" lg="5">
                            <div className="users-page-view-table">
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Status
                                </div>
                                <div>
                                  {
                                    this.props.user.login.values.is_active ? "ACTIVO" : "INACTIVO"
                                  }
                                  </div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Tipo
                                </div>
                                <div>{user_type_map[this.props.user.login.values.user_type].toUpperCase()}</div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Empresa
                                </div>
                                <div>
                                  <span>
                                    {!this.props.user.login.values.company ?
                                     "N/A" : this.toTitleCase(this.props.user.login.values.company)}
                                  </span>
                                </div>
                              </div>
                              <div className="d-flex user-info">
                                <div className="user-info-title font-weight-bold">
                                  Telefono
                                </div>
                                <div>
                                  <span>
                                  {this.props.user.login.values.phone ? this.props.user.login.values.phone : "N/A"}
                                  </span>
                                </div>
                              </div>
                             {/* TODO add certifications */}
                            </div>
                          </Col>
                        </Row>
                      </Media>
                    </Media>
                  </Col>
                  <Col className="mt-1 pl-0" sm="12">
                    <Button.Ripple className="mr-1" color="primary" outline>
                      <Link to="/app/user/edit">
                        <Edit size={15} />
                        <span className="align-middle ml-50">Editar</span>
                      </Link>
                    </Button.Ripple>
                    {/* <Button.Ripple color="danger" outline>
                      <Trash size={15} />
                      <span className="align-middle ml-50">Borrar</span>
                    </Button.Ripple> */}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => {
  return {
    user: state.auth
  }
}

export default connect(mapStateToProps)(UserView)
