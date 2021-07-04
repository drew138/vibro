import React from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  // CardHeader,
  CardImg,
  Table,
  Button
} from "reactstrap"
import { connect } from "react-redux"
import { displayAlert } from "../../../redux/actions/alerts"
import { GET_USERS_ENDPOINT, GET_VALUES_ENDPOINT } from "../../../config"
import axios from "axios"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import Img from "../../../assets/img/machine/default.png"


class MeasurementView extends React.Component {

  constructor(props) {
    super(props)

  }

  state = {
    engineerOneName: "N/A",
    engineerTwoName: "N/A",
    analystName: "N/A",
    certifierName: "N/A",
    points: []
  }


  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }


  async getValues() {

    try {
      const res = await axios.get(GET_VALUES_ENDPOINT, {
        params: {
          machine: this.props.machine.id,
          measurement: this.props.measurement.id,
          date: this.props.measurement.date
        }
      })
      const points = {}
      console.log(res.data)
      res.data.current.forEach((value) => {
        // console.log(value.point)
        points[value.point.id] = {
          position: value.point.position,
          direction: value.point.direction,
          point_type: value.point.point_type,
          current: {
            tendency: parseFloat(value.tendency),
            severity: value.severity
          },

        }
      })
      res.data.previous.forEach((value) => {
        if (value.point.id in points) {
          points[value.point.id].previous = {
            tendency: parseFloat(value.tendency),
            severity: value.severity
          }
        }
      })

      this.setState({ points })
    } catch (e) {
      console.log(e);
      const alertData = {
        title: "Error de Conexión",
        success: false,
        show: true,
        alertText: "Error al Conectar al Servidor"
      }
      this.props.displayAlert(alertData)
    }
  }

  async getEngineers() {
    try {
      const res = await axios.get(GET_USERS_ENDPOINT, {
        params: {
          user_type: "engineer"
        }
      })
      const newState = {}
      res.data.forEach((engineer) => {
        if (engineer.id === this.props.measurement.engineer_one) {
          newState.engineerOneName = `${engineer.first_name} ${engineer.last_name}`
        } else if (engineer.id === this.props.measurement.engineer_two) {
          newState.engineerOneName = `${engineer.first_name} ${engineer.last_name}`
        } else if (engineer.id === this.props.measurement.analyst) {
          newState.analystName = `${engineer.first_name} ${engineer.last_name}`
        } else if (engineer.id === this.props.measurement.certifier) {
          newState.certifierName = `${engineer.first_name} ${engineer.last_name}`
        }
      })
      this.setState({ ...newState })
    } catch (e) {
      console.log(e);
      const alertData = {
        title: "Error de Conexión",
        success: false,
        show: true,
        alertText: "Error al Conectar al Servidor"
      }
      this.props.displayAlert(alertData)
    }

  }

  componentDidMount() {
    this.getEngineers();
    this.getValues();
  }

  getValueChange(current, previous) {
    if (!(current && previous)) {
      return "N/A"
    }
    return `${((current - previous) / previous * 100).toFixed(2)} %`
  }

  createPill(severity) {
    switch (severity) {
      case "red":
        return (
          <div
            className="badge badge-pill badge-light-danger w-100">
            Alarma
          </div>
        )
      case "yellow":
        return (
          <div
            className="badge badge-pill badge-light-warning w-100">
            Alerta
          </div>
        )
      case "green":
        return (
          <div
            className="badge badge-pill badge-light-success w-100">
            Ok
          </div>
        )
      case "purple":
        return (
          <div
            className="badge badge-pill badge-light-primary w-100">
            No Asignado
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
            No Medido
          </div>
        )
      default:
        return (
          <div
            className="badge badge-pill badge-light-primary w-100">
            No Asignado
          </div>
        )
    }

  }

  render() {
    return (
      <Row>
        <Col sm="12">
          <Breadcrumbs
            breadCrumbTitle="Medición"
            breadCrumbParent="Lista de Máquinas"
            breadCrumbParent2={`${this.props.machine.name} (ID: ${this.props.machine.identifier})`}
            breadCrumbParent3="Mediciones"
            breadCrumbActive={this.props.measurement.date}
          />
          <Row>
            <Col lg="12" md="6" sm="12">
              <Card>
                <CardBody className="text-center pt-0">
                  <Row>
                    <Col lg="12" md="6" sm="12">
                      <Row className="d-flex justify-content-center text-center mb-2 mt-2">
                        <h1 className="font-large-2 content-header-title mt-2">Información De Máquina</h1>
                      </Row>
                      <hr />
                    </Col>
                    <Col className="mt-3" lg="4" md="6" sm="12">
                      <Row>
                        <Col >
                          <div className="uploads mt-1 mb-1">
                            <span>Máquina</span>
                            <p className="font-weight-bold font-medium-2 mb-0">
                              {this.props.machine.name ? this.props.machine.name : "N/A"}
                            </p>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col >
                          <div className="uploads mt-1 mb-1">
                            <span>Código</span>
                            <p className="font-weight-bold font-medium-2 mb-0">
                              {this.props.machine.code ? this.props.machine.code : "N/A"}
                            </p>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col >
                          <div className="uploads mt-1 mb-1">
                            <span>Alimentación Eléctrica</span>
                            <p className="font-weight-bold font-medium-2 mb-0">
                              {this.props.machine.electric_feed ? this.props.machine.electric_feed : "N/A"}
                            </p>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col >
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
                                      </div>
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
                                      </div>
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
                        <Col >
                          <CardImg
                            className="img-fluid"
                            src={
                              this.props.machine.image ? this.props.machine.image : Img
                            }
                            alt="card image cap"
                          />
                        </Col>
                      </Row>
                    </Col>


                    <Col lg="4" md="6" sm="12" className="mt-3">
                      <Row>
                        <Col >
                          <div className="uploads mt-1 mb-1">
                            <span>Marca</span>
                            <p className="font-weight-bold font-medium-2 mb-0">
                              {this.props.machine.brand ? this.props.machine.brand : "N/A"}
                            </p>
                          </div>
                        </Col>
                      </Row>
                      <Row >
                        <Col >
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
                        <Col >
                          <div className="uploads mt-1 mb-1">
                            <span>Norma</span>
                            <p className="font-weight-bold font-medium-2 mb-0">
                              {this.props.machine.norm ? this.props.machine.norm : "N/A"}
                            </p>
                          </div>
                        </Col>
                      </Row>
                      <Row >
                        <Col >
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


          <Card>
            <CardBody>
              <Row className="mt-2 text-center pt-0">
                <Col lg="12" md="6" sm="12">
                  <Row className="d-flex justify-content-center text-center mb-2">
                    <h1 className="font-large-2 content-header-title">Información De Medición</h1>
                  </Row>
                  <hr />
                </Col>
                <Col lg="4" md="6" sm="12">
                  <Row>
                    <Col>
                      <div className="uploads mt-1 mb-1">
                        <span>Servicio</span>
                        <p className="font-weight-bold font-medium-2 mb-0">
                          {function (service) {
                            switch (service) {
                              case "predictivo":
                                return "Predictivo"
                              case "correctivo":
                                return "Correctivo"
                              case "ingeniería":
                                return "Ingeniería"
                              case "monitoreo":
                                return "Monitoreo en Línea"
                              default:
                                return "Predictivo"
                            }
                          }(this.props.measurement.service)}
                        </p>
                      </div>
                    </Col>
                  </Row>


                  <Row>
                    <Col>
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
                                  </div>
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
                                  </div>
                                )
                            }
                          }(this.props.measurement.severity)
                          }
                        </div>
                      </div>
                    </Col>
                  </Row>


                  <Row>
                    <Col>
                      <div className="uploads mt-1 mb-1">
                        <span>Tipo</span>
                        <p className="font-weight-bold font-medium-2 mb-0">
                          {function (measurement_type) {
                            switch (measurement_type) {
                              case "ultrasonido":
                                return "Ultrasonido"
                              case "termografía":
                                return "Termografía"
                              case "vibración":
                                return "Vibración"
                              case "análisis de aceite":
                                return "Análisis de Aceite"
                              case "alineacion laser polea":
                                return "Alineacion Laser Polea"
                              case "tensión de bandas":
                                return "Tensión de Bandas"
                              case "correción montajes poleas":
                                return "Correción Montajes Poleas"
                              case "alineación laser acople":
                                return "Alineación Laser Acople"
                              case "alineación laser cardan":
                                return "Alineación Laser Cardan"
                              case "alineación engranes":
                                return "Alineación Engranes"
                              case "alineación rodamientos":
                                return "Alineación Rodamientos"
                              case "balanceo":
                                return "Balanceo"
                              case "chequeo mecánico":
                                return "Chequeo Mecánico"
                              case "medición especial":
                                return "Medición Especial"
                              case "aire y caudal":
                                return "Aire y Caudal"
                              case "suministro":
                                return "Suministro"
                              default:
                                return "Vibración"
                            }
                          }(this.props.measurement.measurement_type)}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Col>


                <Col lg="4" md="6" sm="12">
                  <Row>
                    <Col>
                      <div className="uploads mt-1 mb-1">
                        <span>Ingeniero Uno</span>
                        <p className="font-weight-bold font-medium-2 mb-0">
                          {this.state.engineerOneName}
                        </p>
                      </div>
                    </Col>
                  </Row>


                  <Row>
                    <Col>
                      <div className="uploads mt-1 mb-1">
                        <span>Ingeniero Dos</span>
                        <p className="font-weight-bold font-medium-2 mb-0">
                          {this.state.engineerTwoName}
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <Row>


                    <Col>
                      <div className="uploads mt-1 mb-1">
                        <span>Analista</span>
                        <p className="font-weight-bold font-medium-2 mb-0">
                          {this.state.analystName}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Col>


                <Col lg="4" md="6" sm="12">
                  <Row>
                    <Col>
                      <div className="uploads mt-1 mb-1">
                        <span>Certifica</span>
                        <p className="font-weight-bold font-medium-2 mb-0">
                          {this.state.certifierName}
                        </p>
                      </div>
                    </Col>
                  </Row>


                  <Row>
                    <Col>
                      <div className="uploads mt-1 mb-1">
                        <span>Fecha</span>
                        <p className="font-weight-bold font-medium-2 mb-0">
                          {this.props.measurement.date ? this.props.measurement.date : "N/A"}
                        </p>
                      </div>
                    </Col>
                  </Row>


                  <Row>
                    <Col>
                      <div className="uploads mt-1 mb-1">
                        <span>Fecha De Cambios Previos</span>
                        <p className="font-weight-bold font-medium-2 mb-0">
                          {this.props.measurement.prev_changes_date ? this.props.measurement.prev_changes_date : "N/A"}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <div className="divider">
                <div className="divider-text">Puntos</div>
              </div>




              <Row className="m-5 text-left pt-0">

                {/* <Button.Ripple>Graficas Aceleración</Button.Ripple>
                <Button.Ripple>Graficas Velocidad</Button.Ripple>
                <Button.Ripple>Graficas</Button.Ripple> */}
                <Table hover>
                  <thead>
                    <tr>
                      <th>Punto</th>
                      <th>Valor</th>
                      <th>Valor Anterior</th>
                      <th>Cambio</th>
                      <th>Severidad</th>
                      <th>Severidad Previa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      Object.values(this.state.points).map((point) => {
                        console.log(point)
                        return (
                          <tr>
                            <th scope="row">{`${point.position}${point.direction}${point.point_type}`}</th>
                            <td>{point.current?.tendency ?? "N/A"}</td>
                            <td>{point.previous?.tendency ?? "N/A"}</td>
                            <td>{this.getValueChange(point.current?.tendency, point.previous?.tendency)}</td>
                            <td>{point.current && this.createPill(point.current.severity)}</td>
                            <td>{point.previous && this.createPill(point.previous.severity)}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>

              </Row>
              <hr />
              <Row className="m-5 text-left pt-0">
                <Col >
                  <Row>
                    <Col lg="12" md="6" sm="12">
                      <div className="uploads mt-1 mb-1">
                        <span>Cambios Previos:</span>
                        <p className="font-weight-bold font-medium-1 mb-0">
                          {
                            this.props.measurement.prev_changes ? this.props.measurement.prev_changes : "N/A."
                          }
                        </p>
                      </div>
                    </Col>
                  </Row>


                  <Row>
                    <Col lg="12" md="6" sm="12">
                      <div className="uploads mt-1 mb-1">
                        <span>Análisis:</span>
                        <p className="font-weight-bold font-medium-1 mb-0">
                          {
                            this.props.measurement.analysis ? this.props.measurement.analysis : "N/A."
                          }
                        </p>
                      </div>
                    </Col>
                  </Row>


                  <Row>
                    <Col lg="12" md="6" sm="12">
                      <div className="uploads mt-1 mb-1">
                        <span>Diagnostico:</span>
                        <p className="font-weight-bold font-medium-1 mb-0">
                          {
                            this.props.measurement.diagnostic ? this.props.measurement.diagnostic : "N/A."
                          }
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
    )
  }
}

const mapStateToProps = state => {
  return {
    machine: state.machine,
    measurement: state.measurement
  }
}

export default connect(mapStateToProps, { displayAlert })(MeasurementView) // tODO change redux actions
