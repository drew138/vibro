import React from "react"
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
import { POST_COMPANY_ENDPOINT } from "../../../../config"
import axios from "axios"

class Company extends React.Component {


  state = {
    name: "",
    nit: "",
    address: "",
    phone: "",
    city: "",
    hierarchy: "",
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
    this.props.createCompany(this.state, this.props.auth.tokens.access)
    
  }



  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  // async componentDidMount() {
  //   const res = await axios.get(GET_COMPANIES_ENDPOINT, {
  //     headers: { 'Authorization': `Bearer ${this.props.auth.login.tokens.access}` }})
  //   const companies = [{id:"N/A", name:"N/A"}, ...res.data.results]
  //   this.setState({ companies })
  // }

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
                    id="name"
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
              
              <Col md="6" sm="12">
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
              </Col>

              <Col md="6" sm="12"> 
                <FormGroup>
                  <Label for="hierarchy">Jerarquía</Label>
                  <Input
                    type="select"
                    id="hierarchy"
                    placeholder="Empresa"
                    value={this.state.hierarchy}
                    onChange={e => this.setState({ hierarchy: e.target.value })}
                  >
                    <option></option>
                  </Input>
                </FormGroup>
              </Col>
              

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
