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

class UserAccountTab extends React.Component {

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

  async componentDidMount() {
    const res = await axios.get(GET_COMPANIES_ENDPOINT, {
      headers: { 'Authorization': `Bearer ${this.props.auth.login.tokens.access}` }})
    const companies = [{id:"N/A", name:"N/A"}, ...res.data.results]
    this.setState({ companies })
  }

  render() {
    return (
      <Row>
        <Col sm="12">
          <Media className="mb-2">
            <Media className="mr-2 my-25" left>
              <Media
                className="users-avatar-shadow rounded"
                object
                src={
                  this.state.selectedFile ? URL.createObjectURL(this.state.selectedFile) :
                  this.props.users.user.picture
                }
                alt="user profile image"
                height="84"
                width="84"
              />
            </Media>
            <Media className="mt-2" body>
              <Media className="font-medium-1 text-bold-600" tag="p" heading>
                {`${this.toTitleCase(this.props.users.user.first_name)} 
                ${this.toTitleCase(this.props.users.user.last_name)}`}
              </Media>
              <div className="d-flex flex-wrap">
                <input 
                style={{display: "none"}} 
                type="file" 
                onChange={this.fileSelectedHandler} 
                ref={this.imageInputRef}/>
                <Button.Ripple className="mr-1" color="primary" outline
                 onClick={this.fileUploadHandler}
                 >
                  Cambiar
                </Button.Ripple>
                <Button.Ripple color="flat-danger" onClick={this.removePicture}>Quitar Foto</Button.Ripple>
              </div>
            </Media>
          </Media>
        </Col>
        <Col sm="12">
          <Form onSubmit={this.handleSubmit}>
            <Row>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="first_name">Nombre</Label>
                  <Input
                    type="text"
                    id="first_name"
                    placeholder="Nombre"
                    value={this.state.first_name}
                    onChange={e => this.setState({ first_name: e.target.value })}
                  />
                </FormGroup>
              </Col>
              
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="last_name">Apellido</Label>
                  <Input
                    type="text"
                    id="last_name"
                    placeholder="Apellido"
                    value={this.state.last_name}
                    onChange={e => this.setState({ last_name: e.target.value })}
                  />
                </FormGroup>
              </Col>
              
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="phone">Telefono</Label>
                  <Input
                    type="text"
                    id="phone"
                    placeholder="Telefono"
                    value={this.state.phone}
                    onChange={e => this.setState({ phone: e.target.value })}
                  />
                </FormGroup>
              </Col>
              
              
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="celphone">Celular</Label>
                  <Input
                    type="text"
                    id="celphone"
                    placeholder="Celular"
                    value={this.state.celphone}
                    onChange={e => this.setState({ celphone: e.target.value })}
                  />
                </FormGroup>
              </Col>
              
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="text"
                    id="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={e => this.setState({ email: e.target.value })}
                  />
                </FormGroup>
              </Col>

              <Col md="6" sm="12"> 
                <FormGroup>
                  <Label for="company">Empresa</Label>
                  <Input
                    type="select"
                    id="company"
                    placeholder="Empresa"
                    value={this.state.companyName}
                    onChange={e => this.setState({ 
                      companyName: e.target.value, 
                      companyId: e.target.id}
                      )}
                  >
                    {this.state.companies.map((company) => (
                        <option key={company.id} id={company.id} value={company.name}>{company.name}</option>
                      ))}
                  </Input>
                </FormGroup>
              </Col>
              
              <Col md="6" sm="12"> 
                <FormGroup>
                  <Label for="company">Tipo</Label>
                  <Input
                    type="select"
                    id="company"
                    placeholder="Empresa"
                    value={this.state.companyName}
                    onChange={e => this.setState({ user_type: e.target.value})}
                  >
                    <option value="admin">Administrativo</option>
                    <option value="engineer">Ingeniero</option>
                    <option value="client">Cliente</option>
                    <option value="support">Soporte</option>
                    <option value="arduino">Arduino</option>
                  </Input>
                </FormGroup>
              </Col>
              
              <Col md="6" sm="12"> 
                <FormGroup>
                  <Label for="company">Estado</Label>
                  <Input
                    type="select"
                    id="company"
                    placeholder="Empresa"
                    value={this.state.companyName}
                    onChange={e => this.setState({ is_active: e.target.value === "activo" })}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
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

export default connect(mapStateToProps, { updateUser, displayAlert })(UserAccountTab)
