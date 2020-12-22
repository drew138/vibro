import React from "react"
import { Form, FormGroup, Input, Label, Button } from "reactstrap"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check } from "react-feather"
import { connect } from "react-redux"
import { signupWithJWT } from "../../../../redux/actions/auth/registerActions"
import { history } from "../../../../history"
import Slider from "../../../../extensions/sweet-alert/SweetAlert"
import SweetAlert from 'react-bootstrap-sweetalert';
class RegisterJWT extends React.Component {
  state = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPass: "",
    celphone: undefined,
    infoAlert: true
  }

  handleRegister = e => {
    e.preventDefault()
    this.props.signupWithJWT(
      this.state.username,
      this.state.first_name,
      this.state.last_name,
      this.state.email,
      this.state.password,
      this.state.celphone
    )
  }

  handleAlert = (state, value) => {
    this.setState({ [state] : value })
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

        <FormGroup className="form-label-group">
          <Input
            type="number"
            placeholder="Celular"
            required
            value={this.state.celphone}
            onChange={e => this.setState({ celphone: e.target.value })}
          />
          <Label>Celular</Label>
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
        <SweetAlert info title="Info!"
          show={this.state.infoAlert} 
          onConfirm={() => this.handleAlert("infoAlert", false)}
        >
            <p className="sweet-alert-text">
              You clicked the button!
            </p>
        </SweetAlert>
      </Form>
    )
  }
}
const mapStateToProps = state => {
  return {
    values: state.auth.register
  }
}
export default connect(mapStateToProps, { signupWithJWT })(RegisterJWT)
