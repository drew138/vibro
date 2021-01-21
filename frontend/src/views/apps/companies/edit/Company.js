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
import { updateUser } from "../../../../redux/actions/users"
import isValidCelphone from "../../../../validators/celphone"
import isValidPhone from "../../../../validators/phone"
import { displayAlert } from "../../../../redux/actions/alerts"
import { GET_COMPANIES_ENDPOINT } from "../../../../config"
import axios from "axios"

class CompanyTab extends React.Component {

  constructor(props) {
    super(props)
    this.imageInputRef = React.createRef();
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
  }

  state = {
    id: this.props.users.user.id,
    first_name: this.props.users.user.first_name,
    last_name: this.props.users.user.last_name,
    email: this.props.users.user.email,
    phone: this.props.users.user.phone,
    celphone: this.props.users.user.celphone,
    selectedFile: null,
    companyName: this.props.users.user.company ? this.props.users.user.company.name : "N/A",
    companyId: this.props.users.user.company ? this.props.users.user.company.id : null,
    companies: [],
    is_active: this.props.users.user.is_active,
    user_type: this.props.users.user.user_type
  }

  handleSubmit = e => {
    e.preventDefault()
    const alertData = {
      title: "Error de Validación",
      success: false,
      show: true,
      alertText: ""
    }
    if (this.state.celphone && !isValidCelphone(this.state.celphone)) {
      alertData.alertText = "El número de celular debe ser entrado en el formato: (+xxx) xxx xxxx xxxx siendo el código de país opcional"
      this.props.displayAlert(alertData)
      return
    }
    if (this.state.phone && !isValidPhone(this.state.phone)) {
      alertData.alertText = "El número de teléfono debe ser entrado en el formato: (+xxx) xxx xxxx ext xxx siendo el código de área y la extensión opcionales." 
      this.props.displayAlert(alertData)
      return
    }
    this.props.updateUser(this.state, this.props.auth.login.tokens.access)
    
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
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  // async componentDidMount() {
  //   const res = await axios.get(GET_COMPANIES_ENDPOINT, {
  //     headers: { 'Authorization': `Bearer ${this.props.auth.login.tokens.access}` }})
  //   const companies = [{id:"N/A", name:"N/A"}, ...res.data]
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
    users: state.users,
    auth: state.auth
  }
}

export default connect(mapStateToProps, { updateUser, displayAlert })(CompanyTab)
