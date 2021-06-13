import React from "react"
import { Form, FormGroup, Input, Label, Button } from "reactstrap"
import { connect } from "react-redux"
import { signupWithJWT } from "../../../../redux/actions/auth/registerActions"
import { history } from "../../../../history"
import isValidCelphone from "../../../../validators/celphone"
import isValidPassword from "../../../../validators/password"
import { displayAlert } from "../../../../redux/actions/alerts"

class RegisterJWT extends React.Component {
  state = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPass: "",
    celphone: "",
  }

  handleRegister = e => {
    e.preventDefault()
    const alertProps = {
      title: "Error de Validación",
      success: false,
      show: true,
      alertText: ""
    }
    if (this.state.password !== this.state.confirmPass) {
      alertProps.alertText = "Las contraseñas no coinciden"
      this.props.displayAlert(alertProps)
      return
    }
    if (!isValidPassword(this.state.password)) {
      alertProps.alertText = "La contraseña debe contener por lo menos 8 caracteres, un numero y una mayuscula."
      this.props.displayAlert(alertProps)
      return
    }
    if (!isValidCelphone(this.state.celphone)) {
      alertProps.alertText = "El número de celular debe ser entrado en el formato:  xxxxxxxxxx."
      this.props.displayAlert(alertProps)
      return
    }

    this.props.signupWithJWT({
      username: this.state.username,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
      celphone: this.state.celphone
    })
  }

  render() {
    return (
      <Form action="/" onSubmit={this.handleRegister}>
        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Usuario"
            required
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
          />
          <Label>Usuario</Label>
        </FormGroup>

        <FormGroup className="form-label-group">
          <Input
            type="email"
            placeholder="Email"
            required
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <Label>Email</Label>
        </FormGroup>

        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Celular"
            required
            value={this.state.celphone}
            onChange={e => this.setState({ celphone: e.target.value })}
          />
          <Label>Celular</Label>
        </FormGroup>

        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Nombre"
            required
            value={this.state.first_name}
            onChange={e => this.setState({ first_name: e.target.value })}
          />
          <Label>Nombre</Label>
        </FormGroup>

        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Apellido"
            required
            value={this.state.last_name}
            onChange={e => this.setState({ last_name: e.target.value })}
          />
          <Label>Apellido</Label>
        </FormGroup>


        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Contraseña"
            required
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
          />
          <Label>Contraseña</Label>
        </FormGroup>


        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Confirma Contraseña"
            required
            value={this.state.confirmPass}
            onChange={e => this.setState({ confirmPass: e.target.value })}
          />
          <Label>Confirma Contraseña</Label>
        </FormGroup>




        <div className="d-flex justify-content-between">
          <Button.Ripple
            color="primary"
            outline
            onClick={() => {
              history.push("/pages/login")
            }}
          >
            Ingresar
          </Button.Ripple>
          <Button.Ripple color="primary" type="submit">
            Registrarse
          </Button.Ripple>
        </div>
      </Form>
    )
  }
}
const mapStateToProps = state => {
  return {
    values: state.auth.register
  }
}
export default connect(mapStateToProps, { signupWithJWT, displayAlert })(RegisterJWT)
