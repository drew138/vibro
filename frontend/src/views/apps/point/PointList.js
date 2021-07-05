import React from "react"
import { history } from "../../../history"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import { GET_POINTS_ENDPOINT } from "../../../config"
import {
  Card,
  CardBody,
  Row,
  Col,
  Table,
  CardImg
} from "reactstrap"
import { connect } from "react-redux"
import axios from "axios"
import { setMeasurement } from "../../../redux/actions/measurement"
import { displayAlert } from "../../../redux/actions/alerts"
import { updateProfile } from "../../../redux/actions/auth/updateActions"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import Img from "../../../assets/img/machine/default.png"


class MeasurementList extends React.Component {

  constructor(props) {
    super(props)
    if (!props.machine.id) {
      history.push("/")
    }
  }

  state = {
    rowData: [],
  }

  createPill(severity) {
    switch (severity) {
      case "red":
        return (
          <div className="badge badge-pill badge-light-danger w-100">
            R
          </div>
        )
      case "yellow":
        return (
          <div className="badge badge-pill badge-light-warning w-100">
            A
          </div>
        )
      case "green":
        return (
          <div className="badge badge-pill badge-light-success w-100">
            V
          </div>
        )
      case "purple":
        return (
          <div className="badge badge-pill badge-light-primary w-100">
            M
          </div>
        )
      case "black":
        return (
          <div
            className="badge badge-pill w-100"
            style={{
              backgroundColor: "#43393A",
              color: "#F0E5E6",
              fontWeight: "500",
              textTransform: "uppercase"
            }}>
            N
          </div>
        )
      default:
        return (
          <div className="badge badge-pill badge-light-primary w-100">
            M
          </div>
        )
    }

  }

  async componentDidMount() {
    if (!this.props.machine.id) {
      return
    }
    try {
      const res = await axios.get(GET_POINTS_ENDPOINT, {
        params: {
          machine: this.props.machine.id
        }
      })
      this.setState({
        rowData: [...res.data]
      })
    } catch (e) {
      console.log(e)
      // console.log(e.response.data)
      const alertData = {
        title: "Error de Conexión",
        success: false,
        show: true,
        alertText: "Error al Conectar al Servidor"
      }
      this.props.displayAlert(alertData)
      this.setState({ rowData: [] })
    }
  }



  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Puntos"
          breadCrumbParent="Lista de Máquinas"
          breadCrumbParent2={`${this.props.machine.name} (ID: ${this.props.machine.identifier})`}
          breadCrumbActive="Puntos"
        />
        <div className="content-header row">
          <div className="content-header-left col-md-9 col-12 mb-2">
            <div className="row breadcrumbs-top">
              <div className="col-12">
                <h4 className="content-header-title float-left mb-0">
                  {this.props.hierarchy.fullHierarchy}
                </h4>
              </div>
            </div>
          </div>
        </div>



        <Row>
          <Col lg="12" md="6" sm="12">
            <Card>
              <CardBody className="text-center pt-0">
                <Row >
                  <Col lg="12" md="6" sm="12">
                    <Row className="d-flex justify-content-center text-center mb-2 mt-2">
                      <h1 className="font-large-2 content-header-title">Información De Máquina</h1>
                    </Row>
                    <hr />
                  </Col>

                  <Col className="mt-3" lg="4" md="6" sm="12">
                    <Row >
                      <Col lg="12" md="6" sm="12">
                        <div className="uploads mt-1 mb-1">
                          <span>Máquina</span>
                          <p className="font-weight-bold font-medium-2 mb-0">
                            {this.props.machine.name ? this.props.machine.name : "N/A"}
                          </p>
                        </div>
                      </Col>
                    </Row>
                    <Row >
                      <Col lg="12" md="6" sm="12">
                        <div className="uploads mt-1 mb-1">
                          <span>Código</span>
                          <p className="font-weight-bold font-medium-2 mb-0">
                            {this.props.machine.code ? this.props.machine.code : "N/A"}
                          </p>
                        </div>
                      </Col>
                    </Row>
                    <Row >
                      <Col lg="12" md="6" sm="12">
                        <div className="uploads mt-1 mb-1">
                          <span>Alimentación Eléctrica</span>
                          <p className="font-weight-bold font-medium-2 mb-0">
                            {this.props.machine.electric_feed ? this.props.machine.electric_feed : "N/A"}
                          </p>
                        </div>
                      </Col>
                    </Row>
                    <Row >
                      <Col lg="12" md="6" sm="12">
                        <div className="uploads mt-1 mb-1">
                          <span>Severidad</span>
                          <div className="font-weight-bold font-medium-2 mb-0">
                            {function (severity) {
                              switch (severity) {
                                case "red":
                                  return (
                                    <div className="badge badge-pill badge-light-danger">
                                      Alarma
                                    </div>
                                  )
                                case "yellow":
                                  return (
                                    <div className="badge badge-pill badge-light-warning">
                                      Alerta
                                    </div>
                                  )
                                case "green":
                                  return (
                                    <div className="badge badge-pill badge-light-success">
                                      Ok
                                    </div>
                                  )
                                case "purple":
                                  return (
                                    <div className="badge badge-pill badge-light-primary">
                                      No Asignado
                                    </div> // ! TODO cambiar a valor por defecto
                                  )
                                case "black":
                                  return (
                                    <div
                                      className="badge badge-pill"
                                      style={{
                                        backgroundColor: "#43393A",
                                        color: "#F0E5E6",
                                        fontWeight: "500",
                                        textTransform: "uppercase"
                                      }}>
                                      No Medido
                                    </div>
                                  )
                                default:
                                  return (
                                    <div className="badge badge-pill badge-light-primary">
                                      No Asignado
                                    </div> // ! TODO cambiar a valor por defecto
                                  )
                              }
                            }(this.props.machine.severity)
                            }
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>



                  <Col lg="4" md="6" sm="12">
                    <Row>
                      <Col lg="12" md="6" sm="12">
                        <CardImg
                          className="img-fluid"
                          // style={{ maxHeight: "100%" }}
                          src={
                            this.props.machine.image ? this.props.machine.image : Img
                          }
                          alt="card image cap"
                        />
                      </Col>
                    </Row>
                  </Col>


                  <Col lg="4" md="6" sm="12" className="mt-3">
                    <Row >
                      <Col lg="12" md="6" sm="12">
                        <div className="uploads mt-1 mb-1">
                          <span>Marca</span>
                          <p className="font-weight-bold font-medium-2 mb-0">
                            {this.props.machine.brand ? this.props.machine.brand : "N/A"}
                          </p>
                        </div>
                      </Col>
                    </Row>
                    <Row >
                      <Col lg="12" md="6" sm="12">
                        <div className="uploads mt-1 mb-1">
                          <span>Potencia</span>
                          <p className="font-weight-bold font-medium-2 mb-0">
                            {`${this.props.machine.power} ${this.props.machine.power_units}`.length > 3 ?
                              `${this.props.machine.power} ${this.props.machine.power_units}` : "N/A"}
                          </p>
                        </div>
                      </Col>
                    </Row>
                    <Row >
                      <Col lg="12" md="6" sm="12">
                        <div className="uploads mt-1 mb-1">
                          <span>Norma</span>
                          <p className="font-weight-bold font-medium-2 mb-0">
                            {this.props.machine.norm ? this.props.machine.norm : "N/A"}
                          </p>
                        </div>
                      </Col>
                    </Row>
                    <Row >
                      <Col lg="12" md="6" sm="12">
                        <div className="uploads mt-1 mb-1">
                          <span>RPM</span>
                          <p className="font-weight-bold font-medium-2 mb-0">
                            {this.props.machine.rpm ? this.props.machine.rpm : "N/A"}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>


        <Row className="app-user-list">
          <Col sm="12">
            <Card>
              <CardBody>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Punto</th>
                      <th>Severidad</th>

                    </tr>
                  </thead>
                  <tbody>
                    {this.state.rowData.map((row) => (
                      <tr key={row.id}>
                        <th scope="row">{row.date}</th>
                        <td>{this.createPill(row.balanceo)}</td>

                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>


      </React.Fragment >
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    machine: state.machine,
    hierarchy: state.hierarchy
  }
}

export default connect(mapStateToProps, { setMeasurement, displayAlert, updateProfile })(MeasurementList)

