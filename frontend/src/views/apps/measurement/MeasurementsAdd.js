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
  // CardImg
} from "reactstrap"
import { connect } from "react-redux"
import { displayAlert } from "../../../redux/actions/alerts"
import { GET_USERS_ENDPOINT, BULK_CREATE_MEASUREMENT_ENDPOINT } from "../../../config"
import axios from "axios"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import { history } from "../../../history"
import companyImg from "../../../assets/img/company/default.png"
var DatePicker = require("reactstrap-date-picker");



const initialState = {

  service: "predictivo",
  serviceName: "Predictivo",
  measurement_type: "vibración",
  measurementTypeName: "Vibración",
  date: "",
  formattedDate: "",
  engineers: [{ id: 0, first_name: "Seleccione", last_name: "una opción" }],
  engineer_one: 0,
  engineerOneName: "Seleccione una opción",
  engineer_two: 0,
  engineerTwoName: "Seleccione una opción"
}


class MeasurementsAdd extends React.Component {

  constructor(props) {
    super(props)
    if (!this.props.company.id) {
      history.push("/")
    }
  }

  state = {
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


    if (!this.state.date) {
      alertData.alertText = "El Campo De Fecha No Puede Estar En Blanco."
      this.props.displayAlert(alertData)
      return
    }


    const measurement = {
      service: this.state.service,
      measurement_type: this.state.measurement_type,
      severity: this.state.severity,
      date: this.state.date,
    }
    if (this.state.engineer_one) {
      measurement.engineer_one = this.state.engineer_one
    }
    if (this.state.engineer_two) {
      measurement.engineer_two = this.state.engineer_two
    }
    try {

      // const res = await axios.post(BULK_CREATE_MEASUREMENT_ENDPOINT, measurement) // TODO endpoint
      const alertData = {
        title: "Registro Exitoso",
        success: true,
        show: true,
        alertText: "Esta Funcionalidad Aun Esta En Desarrollo."
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

  handleDateChange(value, formattedValue) {
    this.setState({
      date: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedDate: formattedValue // Formatted String, ex: "11/19/2016"
    })
  }

  // handlePrevChangesDateChange(value, formattedValue) {
  //   this.setState({
  //     prev_changes_date: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
  //     formattedPrevChangesDate: formattedValue // Formatted String, ex: "11/19/2016"
  //   })
  // }


  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  async componentDidMount() {
    if (!this.props.company.id) {
      return
    }

    try {
      const res = await axios.get(GET_USERS_ENDPOINT, {
        params: {
          user_type: "engineer"
        }
      })
      this.setState({
        engineers: [{ id: 0, first_name: "Seleccione", last_name: " una opción" }, ...res.data]
      })
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
                  <Col lg="12" md="6" sm="12">
                    <Row className="d-flex justify-content-center text-center mb-2">
                      <h1 className="font-large-2 content-header-title mt-2">Información De Empresa</h1>
                    </Row>
                    <hr />
                  </Col>
                  <h1 className="font-large-1 content-header-title mt-1">{this.props.company.name ? this.props.company.name : "N/A"}</h1>
                </CardHeader>
                <CardBody className="text-center pt-0">
                  <div className="avatar mr-1 avatar-xl mt-1 mb-1">
                    <img src={this.props.company.picture ? this.props.company.picture : companyImg} alt="avatarImg" />
                  </div>
                  <div className="uploads mt-1 mb-1">
                    <span>Ciudad</span>
                    <p className="font-weight-bold font-medium-2 mb-0">
                      {this.props.company.city ? this.props.company?.city : "N/A"}
                    </p>
                  </div>
                  <div className="followers mt-1 mb-1">
                    <span>Dirección</span>
                    <p className="font-weight-bold font-medium-2 mb-0">
                      {this.props.company.address ? this.props.company.address : "N/A"}
                    </p>
                  </div>
                  <div className="uploads mt-1 mb-1">
                    <span>Telefono</span>
                    <p className="font-weight-bold font-medium-2 mb-0">
                      {this.props.company.phone ? this.props.company.phone : "N/A"}
                    </p>
                  </div>
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
                      <Label for="date">Fecha</Label>
                      <DatePicker
                        id="date"
                        value={this.state.date}
                        calendarPlacement="top"
                        onChange={(v, f) => this.handleDateChange(v, f)} />
                    </FormGroup>
                  </Col>

                  {/* <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="prev-date">Fecha De Cambios Previos</Label>
                      <DatePicker
                        id="prev-date"
                        value={this.state.prev_changes_date}
                        calendarPlacement="top"
                        onChange={(v, f) => this.handlePrevChangesDateChange(v, f)} />
                    </FormGroup>
                  </Col> */}

                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="engineer_one" >CSV Tendencia</Label>
                      <CustomInput type="file" id="file-2" />
                    </FormGroup>
                  </Col>
                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="engineer_one" >CSV Espectros de Frecuencia</Label>
                      <CustomInput type="file" id="file-1" />
                    </FormGroup>
                  </Col>


                  <Col md="6" sm="12">
                    <FormGroup>
                      <Label for="engineer_one" >CSV Señales En El Tiempo</Label>
                      <CustomInput type="file" id="file-3" />
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
    company: state.company
  }
}

export default connect(mapStateToProps, { displayAlert })(MeasurementsAdd)
