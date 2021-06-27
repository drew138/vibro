import React from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  Card,
  CardBody,
  CardHeader,
  CardImg
} from "reactstrap"
import { connect } from "react-redux"
import { displayAlert } from "../../../redux/actions/alerts"
import { GET_USERS_ENDPOINT, CREATE_MEASUREMENT_ENDPOINT } from "../../../config"
import axios from "axios"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import { history } from "../../../history"
import Img from "../../../assets/img/machine/default.png"
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
var DatePicker = require("reactstrap-date-picker");

const severityMap = {
  purple: "No Asignado (Morado)",
  green: "OK (Verde)",
  yellow: "Alerta (Amarillo)",
  red: "Alarma (Rojo)",
  black: "No Medido (Negro)"
}

const initialState = {
  service: "predictivo",
  serviceName: "Predictivo",
  measurement_type: "vibración",
  measurementTypeName: "Vibración",
  date: "",
  formattedDate: "",
  prev_changes_date: "",
  formattedPrevChangesDate: "",
  analysis: "",
  diagnostic: "",
  engineers: [{ id: 0, first_name: "Seleccione", last_name: "una opción" }],
  engineer_one: 0,
  engineerOneName: "Seleccione una opción",
  engineer_two: 0,
  engineerTwoName: "Seleccione una opción",
  analyst: 0,
  analystName: "Seleccione una opción",
  certifier: 0,
  certifierName: "Seleccione una opción",
  prev_changes: "",
  severity: "purple",
  severityName: severityMap["purple"],



  balanceo: "green",
  alineacion: "green",
  tension: "green",
  lubricacion: "green",
  rodamientos: "green",
  holgura: "green",
  excentricidad: "green",
  soltura: "green",
  fractura: "green",
  vacio: "green",
  electrico: "green",
  inspeccion: "green",
  estructural: "green",
  resonancia: "green",
  otro: "green"
}


class MeasurementAdd extends React.Component {

  constructor(props) {
    super(props)

    if (!props.machine.id) {
      history.push("/")
    }
  }

  state = {
    ...initialState,
  }

  handleSubmit = async e => {
    e.preventDefault()
    const alertData = {
      title: "Error de Validación",
      success: false,
      show: true,
      alertText: ""
    }
    if (!this.state.date) {
      alertData.alertText = "El Campo De Fecha No Puede Estar En Blanco."
      this.props.displayAlert(alertData)
      return
    }


    const measurement = {
      service: this.state.service,
      measurement_type: this.state.measurement_type,
      machine: this.props.machine.id,
      prev_changes: this.state.prev_changes,
      analysis: this.state.analysis,
      diagnostic: this.state.diagnostic,
      severity: this.state.severity,
      date: this.state.date,

      balanceo: this.state.balanceo,
      alineacion: this.state.alineacion,
      tension: this.state.tension,
      lubricacion: this.state.lubricacion,
      rodamientos: this.state.rodamientos,
      holgura: this.state.holgura,
      excentricidad: this.state.excentricidad,
      soltura: this.state.soltura,
      fractura: this.state.fractura,
      vacio: this.state.vacio,
      electrico: this.state.electrico,
      inspeccion: this.state.inspeccion,
      estructural: this.state.estructural,
      resonancia: this.state.resonancia,
      otro: this.state.otro
    }
    if (this.state.prev_changes_date) {
      measurement.prev_changes_date = this.state.prev_changes_date
    }
    if (this.state.engineer_one) {
      measurement.engineer_one = this.state.engineer_one
    }
    if (this.state.engineer_two) {
      measurement.engineer_two = this.state.engineer_two
    }
    if (this.state.analyst) {
      measurement.analyst = this.state.analyst
    }
    if (this.state.certifier) {
      measurement.certifier = this.state.certifier
    }

    try {

      const res = await axios.post(CREATE_MEASUREMENT_ENDPOINT, measurement)
      const alertData = {
        title: "Registro Exitoso",
        success: true,
        show: true,
        alertText: "Medición creada exitosamente"
      }
      this.props.displayAlert(alertData)
      this.setState({ ...initialState })
    } catch (e) {
      console.log(e.response.data)
      const alertData = {
        title: "Error de Validación",
        success: false,
        show: true,
        alertText: Object.entries(e.response.data)[0][1][0]
      }
      this.props.displayAlert(alertData)
    }


  }


  createCheckers(field, title) {
    return (
      <FormGroup>
        <Label for={field}>{title}</Label>
        <div className={field}>
          <div className="d-inline-block mr-1 ml-1">
            <Checkbox
              color="success"
              label="Ok"
              disabled={this.state.severity === "black"}
              checked={this.state[field] === "green"}
              onChange={() => this.setState({ [field]: "green" })
              }
            />
          </div>
          <div className="d-inline-block mr-1">
            <Checkbox
              color="warning"
              label="Alerta"
              disabled={this.state.severity === "black" || this.state.severity === "green"}
              checked={this.state[field] === "yellow"}
              onChange={() => this.setState({ [field]: "yellow" })}
            />
          </div>
          <div className="d-inline-block mr-1">
            <Checkbox
              color="danger"
              label="Alarma"
              disabled={this.state.severity === "black" || this.state.severity === "green"}
              checked={this.state[field] === "red"}
              onChange={() => this.setState({ [field]: "red" })}
            />
          </div>
          <div className="d-inline-block mr-1">
            <Checkbox
              color="dark"
              label="No Medido"
              checked={this.state[field] === "black"}
              disabled={this.state.severity === "green"}
              onChange={() => this.setState({ [field]: "black" })}
            />
          </div>
        </div>
      </FormGroup>
    )
  }

  handleDateChange(value, formattedValue) {
    this.setState({
      date: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedDate: formattedValue // Formatted String, ex: "11/19/2016"
    })
  }

  handlePrevChangesDateChange(value, formattedValue) {
    this.setState({
      prev_changes_date: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedPrevChangesDate: formattedValue // Formatted String, ex: "11/19/2016"
    })
  }


  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  async componentDidMount() {
    if (!this.props.machine.id) {
      return
    }

    try {
      const res = await axios.get(GET_USERS_ENDPOINT, {
        params: {
          user_type: "engineer"
        }
      })
      // console.log(res.data)
      this.setState({ engineers: [{ id: 0, first_name: "Seleccione", last_name: "una opción" }, ...res.data] })
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



  render() {
    return (
      <Row>
        <Col sm="12">
          <Breadcrumbs
            breadCrumbTitle="Agregar Medición"
            breadCrumbParent="Máquina"
            breadCrumbActive="Agregar Medición"
          />






          <Row>
            <Col lg="12" md="6" sm="12">
              <Card>
                <CardHeader className="mx-auto flex-column">
                </CardHeader>
                <CardBody className="text-center pt-0">
                  <Row >
                    <Col lg="12" md="6" sm="12">
                      <Row className="d-flex justify-content-center text-center mb-3">
                        <h1 className="font-large-2 content-header-title">Información De Máquina</h1>
                      </Row>
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


          <Card>
            <CardBody>
              <Form onSubmit={this.handleSubmit}>
                <Row>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="name">Servicio</Label>
                      <Input
                        type="select"
                        id="service"
                        placeholder="Servicio"
                        value={this.state.serviceName}
                        onChange={e => {
                          const idx = e.target.selectedIndex;
                          const service = e.target.childNodes[idx].getAttribute('service');
                          this.setState({ serviceName: e.target.value, service })
                        }} >
                        <option service="predictivo">Predictivo</option>
                        <option service="correctivo">Correctivo</option>
                        <option service="ingeniería">Ingeniería</option>
                        <option service="monitoreo">Monitoreo en Línea</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="name">Tipo</Label>
                      <Input
                        type="select"
                        id="measurement_type"
                        placeholder="Tipo"
                        value={this.state.measurementTypeName}
                        onChange={e => {
                          const idx = e.target.selectedIndex;
                          const measurement_type = e.target.childNodes[idx].getAttribute('measurement_type');
                          this.setState({ measurement_type, measurementTypeName: e.target.value })
                        }} >
                        <option measurement_type="ultrasonido">Ultrasonido</option>
                        <option measurement_type="termografía">Termografía</option>
                        <option measurement_type="vibración">Vibración</option>
                        <option measurement_type="análisis de aceite">Análisis de Aceite</option>
                        <option measurement_type="alineacion laser polea">Alineacion Laser Polea</option>
                        <option measurement_type="tensión de bandas">Tensión de Bandas</option>
                        <option measurement_type="correción montajes poleas">Correción Montajes Poleas</option>
                        <option measurement_type="alineación laser acople">Alineación Laser Acople</option>
                        <option measurement_type="alineación laser cardan">Alineación Laser Cardan</option>
                        <option measurement_type="alineación engranes">Alineación Engranes</option>
                        <option measurement_type="alineación rodamientos">Alineación Rodamientos</option>
                        <option measurement_type="balanceo">Balanceo</option>
                        <option measurement_type="chequeo mecánico">Chequeo Mecánico</option>
                        <option measurement_type="medición especial">Medición Especial</option>
                        <option measurement_type="aire y caudal">Aire y Caudal</option>
                        <option measurement_type="suministro">Suministro</option>
                      </Input>
                    </FormGroup>
                  </Col>


                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="engineer_one">Ingeniero Uno</Label>
                      <Input
                        type="select"
                        id="engineer_one"
                        placeholder="Ingeniero Uno"
                        value={this.state.engineerOneName}
                        onChange={e => {
                          const idx = e.target.selectedIndex;
                          const engineerid = parseInt(e.target.childNodes[idx].getAttribute('engineerid'));

                          this.setState({ engineer_one: engineerid, engineerOneName: e.target.value })
                        }} >
                        {
                          this.state.engineers.map((engineer) =>

                            <option engineerid={engineer.id} key={engineer.id}>{
                              `${this.toTitleCase(engineer.first_name)} ${engineer.last_name}`}
                            </option>
                          )
                        }
                      </Input>
                    </FormGroup>
                  </Col>


                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="engineer_two">Ingeniero Dos</Label>
                      <Input
                        type="select"
                        id="engineer_two"
                        placeholder="Ingeniero Dos"
                        value={this.state.engineerTwoName}
                        onChange={e => {
                          const idx = e.target.selectedIndex;
                          const engineerid = parseInt(e.target.childNodes[idx].getAttribute('engineerid'));
                          this.setState({ engineer_two: engineerid, engineerTwoName: e.target.value })
                        }} >
                        {
                          this.state.engineers.map((engineer) =>
                            <option engineerid={engineer.id} key={engineer.id}>
                              {`${this.toTitleCase(engineer.first_name)} ${engineer.last_name}`}
                            </option>
                          )
                        }
                      </Input>
                    </FormGroup>
                  </Col>

                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="analyst">Analista</Label>
                      <Input
                        type="select"
                        id="analyst"
                        placeholder="Analista"
                        value={this.state.analystName}
                        onChange={e => {
                          const idx = e.target.selectedIndex;
                          const analystid = parseInt(e.target.childNodes[idx].getAttribute('analystid'));
                          this.setState({ analyst: analystid, analystName: e.target.value })
                        }} >
                        {
                          this.state.engineers.map((engineer) =>
                            <option analystid={engineer.id} key={engineer.id}>
                              {`${this.toTitleCase(engineer.first_name)} ${engineer.last_name}`}
                            </option>
                          )
                        }
                      </Input>
                    </FormGroup>
                  </Col>

                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="certifier">Certifica</Label>
                      <Input
                        type="select"
                        id="certifier"
                        placeholder="Certifica"
                        value={this.state.certifierName}
                        onChange={e => {
                          const idx = e.target.selectedIndex;
                          const certifierid = parseInt(e.target.childNodes[idx].getAttribute('engineerid'));
                          this.setState({ certifier: certifierid, certifierName: e.target.value })
                        }} >
                        {
                          this.state.engineers.map((engineer) =>
                            <option certifierid={engineer.id} key={engineer.id}>
                              {`${this.toTitleCase(engineer.first_name)} ${engineer.last_name}`}
                            </option>
                          )
                        }
                      </Input>
                    </FormGroup>
                  </Col>


                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="date">Fecha</Label>
                      <DatePicker
                        id="date"
                        value={this.state.date}
                        calendarPlacement="top"
                        onChange={(v, f) => this.handleDateChange(v, f)} />
                    </FormGroup>
                  </Col>

                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="prev-date">Fecha De Cambios Previos</Label>
                      <DatePicker
                        id="prev-date"
                        value={this.state.prev_changes_date}
                        calendarPlacement="top"
                        onChange={(v, f) => this.handlePrevChangesDateChange(v, f)} />
                    </FormGroup>
                  </Col>


                  {/* <Col md="6" sm="12">
                    <FormGroup>
                    <Label for="norm">Revisado</Label>
                    <Input
                    type="select"
                    id="severity"
                    placeholder="Severidad"
                    value={this.state.severityName}
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const severity = e.target.childNodes[idx].getAttribute('severity');
                          this.setState({
                            severity,
                            severityName: e.target.value
                          })
                        }}
                        >
                        <option severity="green">Si</option>
                        <option severity="yellow">No</option>
                        </Input>
                        </FormGroup>
                      </Col> */}

                  <Col md="12" sm="12">
                    <FormGroup>
                      <Label for="severity">Severidad</Label>
                      <Input
                        type="select"
                        id="severity"
                        placeholder="Severidad"
                        value={this.state.severityName}
                        onChange={e => {
                          const idx = e.target.selectedIndex;
                          const severity = e.target.childNodes[idx].getAttribute('severity');
                          let newState = {

                            severity,
                            severityName: e.target.value
                          }
                          if (severity === "green") {
                            newState = {
                              ...newState,
                              balanceo: "green",
                              alineacion: "green",
                              tension: "green",
                              lubricacion: "green",
                              rodamientos: "green",
                              holgura: "green",
                              excentricidad: "green",
                              soltura: "green",
                              fractura: "green",
                              vacio: "green",
                              electrico: "green",
                              inspeccion: "green",
                              estructural: "green",
                              resonancia: "green",
                              otro: "green"
                            }
                          } else if (severity === "black") {
                            newState = {
                              ...newState,
                              balanceo: "black",
                              alineacion: "black",
                              tension: "black",
                              lubricacion: "black",
                              rodamientos: "black",
                              holgura: "black",
                              excentricidad: "black",
                              soltura: "black",
                              fractura: "black",
                              vacio: "black",
                              electrico: "black",
                              inspeccion: "black",
                              estructural: "black",
                              resonancia: "black",
                              otro: "black"
                            }
                          }
                          this.setState(newState
                          )
                        }}
                      >
                        <option severity="green">OK (Verde)</option>
                        <option severity="yellow">Alerta (Amarillo)</option>
                        <option severity="red">Alarma (Rojo)</option>
                        <option severity="purple">No Asignado (Morado)</option>
                        <option severity="black">No Medido (Negro)</option>
                      </Input>
                    </FormGroup>
                  </Col>

                  <Col md="12" sm="12">
                    <FormGroup>
                      <Label for="prev_changes">Cambios Previos</Label>
                      <Input
                        type="textarea"
                        id="prev_changes"
                        rows={7}
                        placeholder="Cambios Previos"
                        value={this.state.prev_changes}
                        onChange={e => this.setState({ prev_changes: e.target.value })} />
                    </FormGroup>
                  </Col>


                  <Col md="12" sm="12">
                    <FormGroup>
                      <Label for="analysis">Análisis</Label>
                      <Input
                        type="textarea"
                        id="analysis"
                        rows={7}
                        placeholder="Análisis"
                        value={this.state.analysis}
                        onChange={e => this.setState({ analysis: e.target.value })} />
                    </FormGroup>
                  </Col>


                  <Col md="12" sm="12">
                    <FormGroup>
                      <Label for="diagnostic">Diagnostico</Label>
                      <Input
                        type="textarea"
                        id="diagnostic"
                        rows={7}
                        placeholder="Diagnostico"
                        value={this.state.diagnostic}
                        onChange={e => this.setState({ diagnostic: e.target.value })} />
                    </FormGroup>
                  </Col>


                  <Col md="6" sm="12" >
                    <div className="ml-3">
                      {[
                        ["balanceo", "Balanceo"],
                        ["alineacion", "Alineación"],
                        ["tension", "Tensión"],
                        ["lubricacion", "Lubricación"],
                        ["rodamientos", "Rodamientos"],
                        ["holgura", "Holgura"],
                        ["excentricidad", "Excentricidad"],
                        ["soltura", "Soltura"],
                      ].map((vals) => (
                        <React.Fragment key={vals[0]}>
                          {this.createCheckers(...vals)}
                        </React.Fragment>
                      ))}


                    </div>
                  </Col>
                  <Col md="6" sm="12">
                    <div className="ml-3">
                      {[
                        ["fractura", "Fractura"],
                        ["vacio", "Vacío"],
                        ["electrico", "Eléctrico"],
                        ["inspeccion", "Inspección"],
                        ["estructural", "Estructural"],
                        ["resonancia", "Resonancia"],
                        ["otro", "Otro"],
                      ].map((vals) => (
                        <React.Fragment key={vals[0]}>
                          {this.createCheckers(...vals)}
                        </React.Fragment>
                      ))}


                    </div>
                  </Col>




                  <Col
                    className="d-flex justify-content-end flex-wrap mt-2"
                    sm="12"
                  >
                    <Button.Ripple className="mr-1" color="primary">
                      Agregar Medición
                    </Button.Ripple>
                  </Col>
                </Row>
              </Form>
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
  }
}

export default connect(mapStateToProps, { displayAlert })(MeasurementAdd) // tODO change redux actions
