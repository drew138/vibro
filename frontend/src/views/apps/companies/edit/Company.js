import React from "react"
import {
  Media,
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup
} from "reactstrap"
import { connect } from "react-redux"
import { updateCompany } from "../../../../redux/actions/company"
import isValidAddress from "../../../../validators/address"
import isValidPhone from "../../../../validators/phone"
import isValidNit from "../../../../validators/nit"
import { displayAlert } from "../../../../redux/actions/alerts"
import AutoComplete from "../../../../components/@vuexy/autoComplete/AutoCompleteComponent"
import { GET_CITIES_ENDPOINT, DELETE_COMPANY_ENDPOINT } from "../../../../config"
import axios from "axios"
import { history } from "../../../../history"
import SweetAlert from 'react-bootstrap-sweetalert';

class CompanyTab extends React.Component {

  constructor(props) {
    super(props);
    this.imageInputRef = React.createRef();
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
  }

  state = {
    id: this.props.company.id,
    name: this.props.company.name,
    nit: this.props.company.nit,
    address: this.props.company.address,
    phone: this.props.company.phone,
    city: this.props.company.city,
    picture: undefined,
    suggestions: [{ name: "" }],
    cityMap: {},
    show: false

  }

  handleSubmit = e => {
    e.preventDefault()
    const alertData = {
      title: "Error de Validación",
      success: false,
      show: true,
      alertText: ""
    }
    if (this.state.nit && !isValidNit(this.state.nit)) {
      alertData.alertText = "El número NIT debe ser ingresado en el formato: xxxxxxxxx-x."
      this.props.displayAlert(alertData)
      return
    }
    if (this.state.phone && !isValidPhone(this.state.phone)) {
      alertData.alertText = "El número de teléfono debe ser ingresado en el formato: xxxxxxx."
      this.props.displayAlert(alertData)
      return
    }
    if (this.state.address && !isValidAddress(this.state.address)) {
      alertData.alertText = "La dirección ingresada debe ser valida para Colombia"
      this.props.displayAlert(alertData)
      return
    }
    if (!this.state.cityMap[this.state.city]) {
      alertData.alertText = "La ciudad ingresada no es valida."
      this.props.displayAlert(alertData)
      return
    }
    const data = {
      name: this.state.name,
      nit: this.state.nit,
      address: this.state.address,
      phone: this.state.phone,
      city: this.state.cityMap[this.state.city]
    }
    if (this.state.picture) {
      data.picture = this.state.picture
    }
    // console.log(data)
    this.props.updateCompany(data, this.state.id)
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
    if (!this.state.id) {
      history.push("/app/companies/list")
      return
    }
    // console.log("here")
    // this._isMounted = true;
    try {
      if (this.state.id) {

        const res = await axios.get(GET_CITIES_ENDPOINT)
        const cities = res.data
        const cityNames = []
        const cityMap = {}
        Object.values(cities).forEach(city => {
          const name = `${city.name}, ${city.state}`
          cityNames.push({ name })
          cityMap[name] = city.id
        })
        // console.log(this.props.company)
        this.setState({ suggestions: cityNames, cityMap })
      }
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

  deleteCompany = async () => {
    this.setState({ show: false })
    if (!this.state.id) {
      return
    }

    try {
      const res = await axios.delete(`${DELETE_COMPANY_ENDPOINT}${this.state.id}/`)
      const alertData = {
        title: "Empresa Borrada Exitosamente",
        success: true,
        show: true,
        alertText: `Se Ha Borrado ${this.state.name} De La Lista de Empresas.`
      }
      history.push("/app/companies/list")
      this.props.displayAlert(alertData)
    } catch (e) {
      const alertData = {
        title: "Error Al Borrar Empresa",
        success: false,
        show: true,
        alertText: "Ha Surgido Un Error Al Intentar Borrar Esta Empresa."
      }
      this.props.displayAlert(alertData)
    }
  }

  render() {

    return (
      <React.Fragment>
        <Row>
          <Col sm="12">
            <Media className="mt-1 mb-1">
              <Media className="mr-1" left>
                <Media
                  className="rounded-circle"
                  object
                  src={
                    this.state.picture ? URL.createObjectURL(this.state.picture) : this.props.company.picture
                  }
                  alt="User"
                  height="64"
                  width="64"
                />
              </Media>

              <Media className="mt-25" body>
                <Media className="font-medium-1 text-bold-600" tag="p" heading>
                  {`${this.toTitleCase(this.props.auth?.first_name)} 
              ${this.toTitleCase(this.props.auth?.last_name)}`}
                </Media>

                <div className="d-flex flex-sm-row flex-column justify-content-start px-0">
                  <input
                    style={{ display: "none" }}
                    type="file"
                    onChange={this.fileSelectedHandler}
                    ref={this.imageInputRef} />
                  <Button.Ripple
                    tag="label"
                    className="mr-50 cursor-pointer"
                    color="primary"
                    outline
                    onClick={this.fileUploadHandler}
                  >
                    Cambiar
                  </Button.Ripple>
                  <Button.Ripple color="flat-danger" onClick={this.removePicture}>Quitar Foto</Button.Ripple>
                </div>
              </Media>
            </Media>
            <Form onSubmit={this.handleSubmit}>
              <Row>

                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="name">Nombre</Label>
                    <Input
                      type="text"
                      id="company-name"
                      placeholder="Nombre"
                      value={this.state.name}
                      onChange={e => this.setState({ name: e.target.value })}
                    />
                  </FormGroup>
                </Col>

                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="nit">Nit</Label>
                    <Input
                      type="text"
                      id="nit"
                      placeholder="Nit"
                      value={this.state.nit}
                      onChange={e => this.setState({ nit: e.target.value })}
                    />
                  </FormGroup>
                </Col>

                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="address">Dirección</Label>
                    <Input
                      type="text"
                      id="address"
                      placeholder="Dirección"
                      value={this.state.address}
                      onChange={e => this.setState({ address: e.target.value })}
                    />
                  </FormGroup>
                </Col>

                <Col md="6" sm="12" style={{ maxHeight: 80 }} > {
                  /*! inline style needed because dropdown recommendations mess up component height*/
                }
                  <FormGroup>
                    <Label for="city">Ciudad</Label>
                    <AutoComplete
                      suggestions={this.state.suggestions}
                      userInput={this.state.city}
                      className="form-control"
                      filterKey="name"
                      placeholder="Ciudad"
                      onChange={e => {
                        console.log(this.state.city)
                        this.setState({ city: e.target.value })
                      }}
                      onSuggestionClick={e => {
                        this.setState({ city: e.target.innerText })
                      }}
                      suggestionLimit={20}
                    />
                  </FormGroup>
                </Col>

                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="phone">Teléfono</Label>
                    <Input
                      type="text"
                      id="phone"
                      placeholder="Teléfono"
                      value={this.state.phone}
                      onChange={e => this.setState({ phone: e.target.value })}
                    />
                  </FormGroup>
                </Col>

                {/* <Col md="6" sm="12">
                <FormGroup>
                  <Label for="city">Ciudad</Label>
                  <Input
                    type="select"
                    id="city"
                    placeholder="Ciudad"
                    value={this.state.city}
                    onChange={e => this.setState({ city: e.target.value })}
                  >
                    <option></option>
                  </Input>
                </FormGroup>
              </Col> */}


                <Col
                  className="d-flex justify-content-end flex-wrap mt-2"
                  sm="12"
                >
                  {this.props.auth.user_type === "admin" && <Button.Ripple className="mr-1" color="danger" type="button" onClick={() => this.setState({ show: true })} >
                    Borrar Empresa
                  </Button.Ripple>}
                  <Button.Ripple className="mr-1" color="primary">
                    Guardar Cambios
                  </Button.Ripple>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        {this.props.auth.user_type === "admin" && <SweetAlert
          warning
          title="¿Estas Seguro Que Deseas Borrar Este Elemento?"
          showCancel
          show={this.state.show}
          cancelBtnText="Cancelar"
          confirmBtnText="Borrar Empresa"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="primary"
          onConfirm={this.deleteCompany}
          onCancel={() => this.setState({ show: false })}
        >

          <p className="sweet-alert-text">
            Todas Las Máquinas Y Mediciones Serán Borradas Junto Con Esta Empresa.
          </p>
        </SweetAlert>}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    company: state.company
  }
}

export default connect(mapStateToProps, { updateCompany, displayAlert })(CompanyTab)
