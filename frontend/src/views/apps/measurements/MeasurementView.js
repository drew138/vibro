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
  CustomInput,
  CardHeader,
  CardImg
} from "reactstrap"
import { connect } from "react-redux"
import { displayAlert } from "../../../redux/actions/alerts"
// import { POST_COMPANY_ENDPOINT } from "../../../config"
import { GET_USERS_ENDPOINT } from "../../../config"
import axios from "axios"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"

import Img from "../../../assets/img/machine/default.png"
var DatePicker = require("reactstrap-date-picker");

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
  engineerTwoName: "Seleccione una opción"
}


class MeasurementAdd extends React.Component {

  constructor(props) {
    super(props)

  }

  state = {
    machine: this.props.machine.id,
    ...initialState
  }

  handleSubmit = async e => {
    e.preventDefault()
    const alertData = {
      title: "Error de Validación",
      success: false,
      show: true,
      alertText: ""
    }
    // if (this.state.nit && !isValidNit(this.state.nit)) {
    //   alertData.alertText = "El número NIT debe ser ingresado en el formato: xxxxxxxxx-x"
    //   this.props.displayAlert(alertData)
    //   return
    // }
    // if (this.state.phone && !isValidPhone(this.state.phone)) {
    //   alertData.alertText = "El número de teléfono debe ser ingresado en el formato: (+xxx) xxx xxxx ext xxx siendo el código de área y la extensión opcionales."
    //   this.props.displayAlert(alertData)
    //   return
    // }
    // if (this.state.address && !isValidAddress(this.state.address)) {
    //   alertData.alertText = "La dirección ingresada debe ser valida para Colombia"
    //   this.props.displayAlert(alertData)
    //   return
    // }
    // if (!this.state.cityMap[this.state.city]) {
    //   alertData.alertText = "La ciudad ingresada no es valida."
    //   this.props.displayAlert(alertData)
    //   return
    // }
    // const company = {
    //   name: this.state.name,
    //   nit: this.state.nit,
    //   address: this.state.address,
    //   phone: this.state.phone,
    //   city: this.state.cityMap[this.state.city]
    // }
    // if (this.state.picture) {
    //   company.picture = this.state.picture;
    // }
    // // console.log(data)
    // try {
    //   const data = new FormData();
    //   Object.keys(company).forEach(key => data.append(key, company[key]));
    //   const res = await axios.post(POST_COMPANY_ENDPOINT, data)
    //   // dispatch({
    //   //   type: "SET_COMPANY_STATE",
    //   //   payload: { ...res.data }
    //   // })
    //   const alertData = {
    //     title: "Registro Exitoso",
    //     success: true,
    //     show: true,
    //     alertText: "Empresa creada exitosamente"
    //   }
    //   this.props.displayAlert(alertData)
    //   // dispatch({
    //   //   type: "DISPLAY_SWEET_ALERT",
    //   //   payload: alertData
    //   // })
    //   // history.push("/")
    //   this.setState({ ...initialState })
    // } catch (e) {
    //   console.log(e)
    //   const alertData = {
    //     title: "Error de Validación",
    //     success: false,
    //     show: true,
    //     alertText: Object.entries(e.response.data)[0][1][0]
    //   }
    //   this.props.displayAlert(alertData)
    //   // dispatch({
    //   //   type: "DISPLAY_SWEET_ALERT",
    //   //   payload: alertData
    //   // })
    // }


    // this.props.createCompany(data)
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
    try {
      const res = await axios.get(GET_USERS_ENDPOINT, {
        params: {
          user_type: "engineer"
        }
      })
      // console.log(res.data)
      this.setState({ engineers: [{ id: 0, first_name: "Seleccione una opción", last_name: "" }, ...res.data] })
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
            breadCrumbTitle="Agregar Mediciones"
            breadCrumbParent="Empresa"
            breadCrumbActive="Agregar Mediciones"
          />

          <Row>
            <Col lg="12" md="6" sm="12">
              <Card>
                <CardHeader className="mx-auto flex-column">
                </CardHeader>
                <CardBody className="text-center pt-0">
                  <Row >
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
                          const service = parseInt(e.target.childNodes[idx].getAttribute('service'));
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
                          const measurement_type = parseInt(e.target.childNodes[idx].getAttribute('measurement_type'));
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

                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="engineer_one" ></Label>
                      <CustomInput type="file" id="file-1" />
                    </FormGroup>
                  </Col>

                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="engineer_one" ></Label>
                      <CustomInput type="file" id="file-2" />
                    </FormGroup>
                  </Col>

                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="engineer_one" ></Label>
                      <CustomInput type="file" id="file-3" />
                    </FormGroup>
                  </Col>


                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="analysis">Análisis</Label>
                      <Input
                        type="textarea"
                        id="analysis"
                        placeholder="Análisis"
                        value={this.state.analysis}
                        onChange={e => this.setState({ analysis: e.target.value })} />
                    </FormGroup>
                  </Col>


                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="diagnostic">Diagnostico</Label>
                      <Input
                        type="textarea"
                        id="diagnostic"
                        placeholder="Diagnostico"
                        value={this.state.diagnostic}
                        onChange={e => this.setState({ diagnostic: e.target.value })} />
                    </FormGroup>
                  </Col>

                  <Col
                    className="d-flex justify-content-end flex-wrap mt-2"
                    sm="12"
                  >
                    <Button.Ripple className="mr-1" color="primary">
                      Registrar Mediciones
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
    users: state.users,
    auth: state.auth,
    machine: state.machine,
    company: state.company
  }
}

export default connect(mapStateToProps, { displayAlert })(MeasurementAdd) // tODO change redux actions
