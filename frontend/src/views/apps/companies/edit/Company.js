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
import { GET_CITIES_ENDPOINT } from "../../../../config"
import axios from "axios"
import { history } from "../../../../history"


class CompanyTab extends React.Component {

  constructor(props) {
    super(props);
    if (!props.company.id) {
      history.push("/app/companies/list")
    }
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
    suggestions: [{ name: "" }],
    cityMap: {}

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
      alertData.alertText = "El número NIT debe ser ingresado en el formato: xxxxxxxxx-x"
      this.props.displayAlert(alertData)
      return
    }
    if (this.state.phone && !isValidPhone(this.state.phone)) {
      alertData.alertText = "El número de teléfono debe ser ingresado en el formato: (+xxx) xxx xxxx ext xxx siendo el código de área y la extensión opcionales."
      this.props.displayAlert(alertData)
      return
    }
    if (this.state.address && !isValidAddress(this.state.address)) {
      alertData.alertText = "La dirección ingresada debe ser valida para Colombia"
      this.props.displayAlert(alertData)
      return
    }
    if (!this.state.cityMap[this.state.city]) {
      console.log(this.state.city)
      console.log(this.state.cityMap[this.state.city])
      alertData.alertText = "La ciudad ingresada no es valida."
      this.props.displayAlert(alertData)
      return
    }
    const data = {
      id: this.state.id,
      name: this.state.name,
      nit: this.state.nit,
      address: this.state.address,
      phone: this.state.phone,
      city: this.state.cityMap[this.state.city]
    }
    this.props.updateCompany(data)
  }

  fileSelectedHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  fileUploadHandler = () => {
    this.imageInputRef.current.click()
  }

  removePicture = () => {
    this.imageInputRef.current.value = null
    this.setState({
      selectedFile: null
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
    if (!this.state.id) {
      return
    }
    try {
      const res = await axios.get(GET_CITIES_ENDPOINT)
      const cities = res.data
      const cityNames = []
      const cityMap = {}
      Object.values(cities).forEach(city => {
        const name = `${city.name}, ${city.state}`
        cityNames.push({ name })
        cityMap[name] = city.id
      })
      console.log(cityMap)
      this.setState({ suggestions: cityNames, cityMap })
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
                    className="form-control"
                    filterKey="name"
                    placeholder="Ciudad"
                    onChange={e => {

                      this.setState({ city: e.target.value })
                      console.log(e.target.value)
                    }}
                    onSuggestionClick={e => {

                      this.setState({ city: e.target.activeSuggestion })
                      console.log(e.target.activeSuggestion)
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

              {/* <Col md="6" sm="12">
                <FormGroup>
                  <Label for="hierarchy">Jerarquía</Label>
                  <Input
                    type="select"
                    id="company-hierarchy"
                    placeholder="Empresa"
                    value={this.state.hierarchy}
                    onChange={e => this.setState({ hierarchy: e.target.value })}
                  >
                    <option></option>
                  </Input>
                </FormGroup>
              </Col> */}

              <Col
                className="d-flex justify-content-end flex-wrap mt-2"
                sm="12"
              >
                <Button.Ripple className="mr-1" color="primary">
                  Guardar Cambios
                </Button.Ripple>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
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
