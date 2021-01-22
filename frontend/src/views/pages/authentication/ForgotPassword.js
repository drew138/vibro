import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  Button,
  Label
} from "reactstrap"
import fgImg from "../../../assets/img/pages/forgot-password.png"
import { history } from "../../../history"
import "../../../assets/scss/pages/authentication.scss"
import { RESET_PASSWORD_ENDPOINT } from "../../../config"
import axios from "axios"
import { displayAlert } from "../../../redux/actions/alerts/"
import { connect } from "react-redux"

class ForgotPassword extends React.Component {
  state = {
    email: ""
  }

  onSubmit = async () => {
    try {
      await axios.post(RESET_PASSWORD_ENDPOINT, {email: this.state.email})
      const alertData = {
        title: "Solicitud de Cambio de Contraseña Enviada Exitosamente",
        success: true,
        show: true,
        alertText: "Se ha enviado un mensaje a tu correo electronico con instrucciones para cambiar tu contraseña"
      }
      this.props.displayAlert(alertData)
    } catch (e) {
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
      <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center"
              >
                <img src={fgImg} alt="fgImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2 py-1">
                  <CardHeader className="pb-1">
                    <CardTitle>
                      <h4 className="mb-0">Recupera tu Contraseña</h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title">
                    Por favor entra tu correo electronico y te enviaremos
                    instrucciones para cambiar tu contraseña.
                  </p>
                  <CardBody className="pt-1 pb-0">
                    <Form>
                      <FormGroup className="form-label-group">
                        <Input type="text" placeholder="Email" required onChange={(e) => {
                          this.setState({email: e.target.value})
                        }}/>
                        <Label>Email</Label>
                      </FormGroup>
                      <div className="float-md-left d-block mb-1">
                        <Button.Ripple
                          color="primary"
                          outline
                          className="px-75 btn-block"
                          onClick={() => history.push("/pages/login")}
                        >
                          Ingresar
                        </Button.Ripple>
                      </div>
                      <div className="float-md-right d-block mb-1">
                        <Button.Ripple
                          color="primary"
                          type="submit"
                          className="px-75 btn-block"
                          onClick={e => {
                            e.preventDefault()
                            history.push("/")
                          }}
                        >
                          Recuperar Contraseña
                        </Button.Ripple>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  }
}

// const mapStateToProps = state => {
//   return {
//     auth: state.auth
//   }
// }

export default connect((state) => (state), { displayAlert })(ForgotPassword)

