import React from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup
} from "reactstrap"
import { connect } from "react-redux"
import { createCompany } from "../../../../redux/actions/company"
import isValidAddress from "../../../../validators/address"
import isValidPhone from "../../../../validators/phone"
import isValidNit from "../../../../validators/nit"
import { displayAlert } from "../../../../redux/actions/alerts"
// import { POST_COMPANY_ENDPOINT } from "../../../../config"
import { GET_CITIES_ENDPOINT } from "../../../../config"
import axios from "axios"
import AutoComplete from "../../../../components/@vuexy/autoComplete/AutoCompleteComponent"
// import { requestInterceptor, responseInterceptor } from "../../../../axios/axiosInstance"

class Company extends React.Component {

  state = {
    name: "",
    nit: "",
    address: "",
    phone: "",
    city: "",
    // hierarchy: "",
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
    this.props.createCompany(data)
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
      const res = await axios.get(GET_CITIES_ENDPOINT)
      const cities = res.data
      const cityNames = []
      Object.values(cities).forEach(city => {
        const name = `${city.name}, ${city.state}`
        cityNames.push({ name })
        this.state.cityMap[name] = city.id
      })
      this.setState({ suggestions: cityNames })
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
                    suggestionLimit={20}
                    onChange={e => {

                      this.setState({ city: e.target.value })
                      console.log(e.target.value)
                    }}
                    onSuggestionClick={e => {

                      this.setState({ city: e.target.innerText })
                      console.log(e.target.innerText)
                    }}
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


              <Col md="6" sm="12">
                <FormGroup mh="6">
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
                  Registrar Empresa
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
    users: state.users,
    auth: state.auth
  }
}

export default connect(mapStateToProps, { createCompany, displayAlert })(Company) // tODO change redux actions
