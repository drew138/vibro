import React from "react"
import {
  // Media,
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
import { updateCompany } from "../../../redux/actions/company"
// import isValidAddress from "../../../validators/address"
// import isValidPhone from "../../../validators/phone"
// import isValidNit from "../../../validators/nit"
import { displayAlert } from "../../../redux/actions/alerts"
// import AutoComplete from "../../../components/@vuexy/autoComplete/AutoCompleteComponent"
// import { GET_CITIES_ENDPOINT, DELETE_COMPANY_ENDPOINT } from "../../../config"
// import axios from "axios"
// import { history } from "../../../history"
// import SweetAlert from 'react-bootstrap-sweetalert';

import Img from "../../../assets/img/machine/default.png"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
var DatePicker = require("reactstrap-date-picker");



const severityMap = {
  purple: "No Asignada (Morado)",
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
  certifierName: "Seleccione una opción"
}




class MeasurementEdit extends React.Component {

  constructor(props) {
    super(props);
    this.imageInputRef = React.createRef();
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
  }

  state = {
    // id: this.props.company.id,
    // name: this.props.company.name,
    // nit: this.props.company.nit,
    // address: this.props.company.address,
    // phone: this.props.company.phone,
    // city: this.props.company.city,
    // picture: undefined,
    // suggestions: [{ name: "" }],
    // cityMap: {},
    // show: false
    ...initialState,
    severity: this.props.machine.severity,
    severityName: severityMap[this.props.machine.severity],
    machine: this.props.machine.id,
  }

  handleSubmit = e => {
    e.preventDefault()
    const alertData = {
      title: "Error de Validación",
      success: false,
      show: true,
      alertText: ""
    }
    // if (this.state.nit && !isValidNit(this.state.nit)) {
    //   alertData.alertText = "El número NIT debe ser ingresado en el formato: xxxxxxxxx-x."
    //   this.props.displayAlert(alertData)
    //   return
    // }
    // if (this.state.phone && !isValidPhone(this.state.phone)) {
    //   alertData.alertText = "El número de teléfono debe ser ingresado en el formato: xxxxxxx."
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
    // const data = {
    //   name: this.state.name,
    //   nit: this.state.nit,
    //   address: this.state.address,
    //   phone: this.state.phone,
    //   city: this.state.cityMap[this.state.city]
    // }
    // if (this.state.picture) {
    //   data.picture = this.state.picture
    // }
    // // console.log(data)
    // this.props.updateCompany(data, this.state.id)
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

  fileSelectedHandler = (event) => {
    this.setState({
      picture: event.target.files[0]
    })
  }

  fileUploadHandler = () => {
    this.imageInputRef.current.click()
  }

  removePicture = () => {
    this.imageInputRef.current.value = null
    this.setState({
      picture: undefined
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
    // console.log(this.state)
    // if (!this.state.id) {
    //   history.push("/app/companies/list")
    //   return
    // }
    // console.log("here")
    // this._isMounted = true;
    // try {
    //   if (this.state.id) {

    //     const res = await axios.get(GET_CITIES_ENDPOINT)
    //     const cities = res.data
    //     const cityNames = []
    //     const cityMap = {}
    //     Object.values(cities).forEach(city => {
    //       const name = `${city.name}, ${city.state}`
    //       cityNames.push({ name })
    //       cityMap[name] = city.id
    //     })
    //     // console.log(this.props.company)
    //     this.setState({ suggestions: cityNames, cityMap })
    //   }
    // } catch (e) {
    //   console.log(e);
    //   const alertData = {
    //     title: "Error de Conexión",
    //     success: false,
    //     show: true,
    //     alertText: "Error al Conectar al Servidor"
    //   }
    //   this.props.displayAlert(alertData)
    // }
  }

  // deleteCompany = async () => {
  //   this.setState({ show: false })
  //   if (!this.state.id) {
  //     return
  //   }

  //   try {
  //     const res = await axios.delete(`${DELETE_COMPANY_ENDPOINT}${this.state.id}/`)
  //     const alertData = {
  //       title: "Empresa Borrada Exitosamente",
  //       success: true,
  //       show: true,
  //       alertText: `Se Ha Borrado ${this.state.name} De La Lista de Empresas.`
  //     }
  //     history.push("/app/companies/list")
  //     this.props.displayAlert(alertData)
  //   } catch (e) {
  //     const alertData = {
  //       title: "Error Al Borrar Empresa",
  //       success: false,
  //       show: true,
  //       alertText: "Ha Surgido Un Error Al Intentar Borrar Esta Empresa."
  //     }
  //     this.props.displayAlert(alertData)
  //   }
  // }

  render() {

    return (
      <React.Fragment>
        <Row>
          <Col sm="12">
            <Breadcrumbs
              breadCrumbTitle="Editar Medición"
              breadCrumbParent="Máquina"
              breadCrumbActive="Editar Medición"
            />
            <Row>
              <Col lg="12" md="6" sm="12">
                <Card>
                  <CardHeader className="mx-auto flex-column">
                    {/* <h1>{this.props.company.name !== "" ? this.props.company.name : "N/A"}</h1> */}
                  </CardHeader>
                  <CardBody className="text-center pt-0">
                    {/* <div className="avatar mr-1 avatar-xl mt-1 mb-1">
                    <img src={this.props.company.picture !== "" ? this.props.company.picture : companyImg} alt="avatarImg" />
                  </div>
                  <div className="followers mt-1 mb-1">
                  <span>Dirección</span>
                  <p className="font-weight-bold font-medium-2 mb-0">
                  {this.props.company.address !== "" ? this.props.company.address : "N/A"}
                  </p>
                  </div>
                  <div className="uploads mt-1 mb-1">
                  <span>Telefono</span>
                  <p className="font-weight-bold font-medium-2 mb-0">
                  {this.props.company.phone !== "" ? this.props.company.phone : "N/A"}
                  </p>
                </div> */}
                    {/* <Col lg="6" md="6" sm="12">

                    <Row lg="6" md="6" sm="12">
                      <div className="uploads mt-1 mb-1">
                        <span>Máquina</span>
                        <p className="font-weight-bold font-medium-2 mb-0">
                          {this.props.machine.name !== "" ? this.props.machine.name : "N/A"}
                        </p>
                      </div>

                    </Row>
                    <Row lg="6" md="6" sm="12">

                      <div className="uploads mt-1 mb-1">
                        <span>Código</span>
                        <p className="font-weight-bold font-medium-2 mb-0">
                          {this.props.machine.code !== "" ? this.props.machine.code : "N/A"}
                        </p>
                      </div>

                    </Row>
                  </Col>

                  <Col>
                  </Col>

                  <Col>

                    <Row lg="6" md="6" sm="12">
                      <div className="uploads mt-1 mb-1">
                        <span>Alimentación Eléctrica</span>
                        <p className="font-weight-bold font-medium-2 mb-0">
                          {this.props.machine.electric_feed !== "" ? this.props.machine.electric_feed : "N/A"}
                        </p>
                      </div>

                    </Row>
                  </Col> */}

                    <Row >
                      <Col className="mt-3" lg="4" md="6" sm="12">
                        <Row >
                          <Col lg="12" md="6" sm="12">
                            <div className="uploads mt-1 mb-1">
                              <span>Máquina</span>
                              <p className="font-weight-bold font-medium-2 mb-0">
                                {this.props.machine.name !== "" ? this.props.machine.name : "N/A"}
                              </p>
                            </div>
                          </Col>
                        </Row>
                        <Row >
                          <Col lg="12" md="6" sm="12">
                            <div className="uploads mt-1 mb-1">
                              <span>Código</span>
                              <p className="font-weight-bold font-medium-2 mb-0">
                                {this.props.machine.code !== "" ? this.props.machine.code : "N/A"}
                              </p>
                            </div>
                          </Col>
                        </Row>
                        <Row >
                          <Col lg="12" md="6" sm="12">
                            <div className="uploads mt-1 mb-1">
                              <span>Alimentación Eléctrica</span>
                              <p className="font-weight-bold font-medium-2 mb-0">
                                {this.props.machine.electric_feed !== "" ? this.props.machine.electric_feed : "N/A"}
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
                                          No Asignada
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
                                          No Asignada
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
                            {/* <div className="uploads mt-1 mb-1">
                            <span>Marca</span>
                            <p className="font-weight-bold font-medium-2 mb-0">
                              {this.props.machine.brand !== "" ? this.props.machine.brand : "N/A"}
                            </p>
                          </div> */}
                            <CardImg
                              className="img-fluid"
                              // style={{ maxHeight: "100%" }}
                              src={
                                // this.state.image ? URL.createObjectURL(this.state.image) : this.props.machine.image
                                Img
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
                                {this.props.machine.brand !== "" ? this.props.machine.brand : "N/A"}
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
                                {this.props.machine.norm !== "" ? this.props.machine.norm : "N/A"}
                              </p>
                            </div>
                          </Col>
                        </Row>
                        <Row >
                          <Col lg="12" md="6" sm="12">
                            <div className="uploads mt-1 mb-1">
                              <span>RPM</span>
                              <p className="font-weight-bold font-medium-2 mb-0">
                                {this.props.machine.rpm !== "" ? this.props.machine.rpm : "N/A"}
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>







                    {/* <Row>
                    <Col lg="4" md="4" sm="6">

                      <div className="uploads mt-1 mb-1">
                        <span>Marca</span>
                        <p className="font-weight-bold font-medium-2 mb-0">
                          {this.props.machine.brand !== "" ? this.props.machine.brand : "N/A"}
                        </p>
                      </div>
                    </Col>


                  </Row> */}







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


                    {/* <Col md="6" sm="12">
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
                  </Col> */}



                    <Col md="6" sm="12">
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
                            this.setState({
                              severity,
                              severityName: e.target.value
                            })
                          }}
                        >
                          <option severity="green">OK (Verde)</option>
                          <option severity="yellow">Alerta (Amarillo)</option>
                          <option severity="red">Alarma (Rojo)</option>
                          <option severity="purple">No Asignada (Morado)</option>
                          <option severity="black">No Medido (Negro)</option>
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





                    <Col md="6" sm="12">
                      <FormGroup>
                        <Label for="analysis">Análisis</Label>
                        <Input
                          type="textarea"
                          id="analysis"
                          rows={10}
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
                          rows={10}
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
                        Registrar Cambios
                      </Button.Ripple>
                    </Col>
                  </Row>
                </Form>
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
    auth: state.auth,
    company: state.company,

    users: state.users,
    machine: state.machine,
  }
}

export default connect(mapStateToProps, { updateCompany, displayAlert })(MeasurementEdit)
