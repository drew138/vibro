import React from "react"
import {
  Button,
  Media,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col
} from "reactstrap"
import isValidCelphone from "../../../validators/celphone"
// import isValidPhone from "../../../validators/phone"
import { connect } from "react-redux"
import { updateProfile } from "../../../redux/actions/auth/updateActions"
import { getUserWithJWT } from "../../../redux/actions/auth/loginActions"
import { displayAlert } from "../../../redux/actions/alerts"


class General extends React.Component {

  constructor(props) {
    super(props)
    this.imageInputRef = React.createRef();
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
  }

  state = {
    id: this.props.auth?.id ?? undefined,
    first_name: this.props.auth?.first_name ?? undefined,
    last_name: this.props.auth?.last_name ?? undefined,
    email: this.props.auth?.email ?? undefined,
    // phone: this.props.auth?.phone ?? undefined,
    celphone: this.props.auth?.celphone ?? undefined,
    picture: undefined
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
      alertData.alertText = "El número de celular debe ser ingresado en el formato: xxxxxxxxxx."
      this.props.displayAlert(alertData)
      return
    }
    const user = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      celphone: this.state.celphone,
    }
    if (this.state.picture) {
      user.picture = this.state.picture
    }
    this.props.updateProfile(user, this.state.id)

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
    if (str) {

      return str.replace(
        /\w\S*/g,
        function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
      );
    }
    return "";
  }

  render() {
    return (
      <React.Fragment>
        <Media>
          <Media className="mr-1" left>
            <Media
              className="rounded-circle"
              object
              src={
                this.state.picture ?
                  URL.createObjectURL(this.state.picture)
                  : this.props.auth?.picture
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
        <Form className="mt-2" onSubmit={this.handleSubmit}>
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

            {/* <Col md="6" sm="12">
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
            </Col> */}

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


            <Col className="d-flex justify-content-start flex-wrap" sm="12">
              <Button.Ripple className="mr-50" type="submit" color="primary">
                Guardar Cambios
              </Button.Ripple>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, { updateProfile, displayAlert, getUserWithJWT })(General)
