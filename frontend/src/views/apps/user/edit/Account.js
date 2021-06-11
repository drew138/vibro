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
import { history } from "../../../../history"

class UserAccountTab extends React.Component {

  constructor(props) {
    super(props)
    if (!props.user.id) {
      history.push("/");
      return;
    }
    this.imageInputRef = React.createRef();
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
  }

  state = {
    id: this.props.user.id,
    first_name: this.props.user.first_name,
    last_name: this.props.user.last_name,
    email: this.props.user.email,
    phone: this.props.user.phone,
    celphone: this.props.user.celphone,
    selectedFile: null,
    companyName: this.props.user.company?.name ?? "N/A",
    company: this.props.user.company?.id ?? 0,
    companies: [],
    is_active: this.props.user.is_active,
    isActiveText: this.props.user.is_active ? "Activo" : "Inactivo",
    user_type: this.props.user.user_type
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
      alertData.alertText = "El número de celular debe ser ingresado en el formato: (+xxx) xxx xxxx xxxx siendo el código de país opcional"
      this.props.displayAlert(alertData)
      return
    }
    if (this.state.phone && !isValidPhone(this.state.phone)) {
      alertData.alertText = "El número de teléfono debe ser ingresado en el formato: (+xxx) xxx xxxx ext xxx siendo el código de área y la extensión opcionales."
      this.props.displayAlert(alertData)
      return
    }
    this.props.updateUser(this.state)

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
    if (this.props.user.id) {
      // add try catch
      const res = await axios.get(GET_COMPANIES_ENDPOINT)
      const companies = [{ id: 0, name: "N/A" }, ...res.data]
      this.setState({ companies })
    }
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
                    this.props.user.picture
                }
                alt="user profile image"
                height="84"
                width="84"
              />
            </Media>
            <Media className="mt-2" body>
              <Media className="font-medium-1 text-bold-600" tag="p" heading>
                {`${this.toTitleCase(this.props.user.first_name)} 
                ${this.toTitleCase(this.props.user.last_name)}`}
              </Media>
              <div className="d-flex flex-wrap">
                <input
                  style={{ display: "none" }}
                  type="file"
                  onChange={this.fileSelectedHandler}
                  ref={this.imageInputRef} />
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
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const companyId = e.target.childNodes[idx].getAttribute("companyid");

                      this.setState({
                        companyName: e.target.value,
                        company: companyId
                      }
                      )
                    }}
                  >
                    {this.state.companies.map((company) => (
                      <option key={company.id} companyid={company.id} value={company.name}>{company.name}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="user_type">Tipo</Label>
                  <Input
                    type="select"
                    id="user_type"
                    // placeholder="Empresa"
                    value={this.state.user_type}
                    onChange={e => this.setState({ user_type: e.target.value })}
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
                  <Label for="state">Estado</Label>
                  <Input
                    type="select"
                    id="state"
                    // placeholder="Empresa"
                    value={this.state.isActiveText}
                    onChange={e => this.setState({
                      isActiveText: e.target.value,
                      is_active: e.target.value === "Activo"
                    })}
                  >
                    <option>Activo</option>
                    <option>Inactivo</option>
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
    user: state.user,
    auth: state.auth
  }
}

export default connect(mapStateToProps, { updateUser, displayAlert })(UserAccountTab)
