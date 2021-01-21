import React from "react"
import { Button, FormGroup, Row, Col } from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { connect } from "react-redux"
import { displayAlert } from "../../../redux/actions/alerts"
import { CHANGE_PASSWORD_ENDPOINT } from "../../../config"


const formSchema = Yup.object().shape({
  oldpass: Yup.string().required("Este campo es requerido"),
  newpass: Yup.string().required("Este campo es requerido"),
  confirmpass: Yup.string()
    .oneOf([Yup.ref("newpass"), null], "Las contraseñas deben coincidir")
    .required("Este campo es requerido")
})

class ChangePassword extends React.Component {

  onSubmit = async (values) => {
    try {
      console.log(this.props)
    const body = {
      password: values.oldpass,
      new_password: values.newpass
    }
    const headers = { headers: {'Authorization': `Bearer ${this.props.auth.tokens.access}`} }
    await axios.put(CHANGE_PASSWORD_ENDPOINT, body, headers)
    const alertData = {
      title: "Cambio de Contraseña Exitoso",
      success: true,
      show: true,
      alertText: "Su Contraseña Ha Sido Creada Exitosamente"
    }
    this.props.displayAlert(alertData)
    } catch (e) {
      console.log(e.response.data)
      const error = Array.isArray(Object.entries(e.response.data)[0][1]) ? Object.entries(e.response.data)[0][1][0] : Object.entries(e.response.data)[0][1]
      const alertData = {
        title: "Error al Cambiar su Contraseña",
        success: false,
        show: true,
        alertText: error
      }
      this.props.displayAlert(alertData)
    }
  }

  render() {
    return (
      <React.Fragment>
        <Row className="pt-1">
          <Col sm="12">
            <Formik
              initialValues={{
                oldpass: "",
                newpass: "",
                confirmpass: ""
              }}
              validationSchema={formSchema}
              onSubmit={this.onSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <FormGroup>
                    <Field
                      name="oldpass"
                      id="oldpass"
                      type="password"
                      className={`form-control ${errors.oldpass &&
                        touched.oldpass &&
                        "is-invalid"}`}
                      placeholder="Ingresa tu Contraseña"
                    />
                    {errors.oldpass && touched.oldpass ? (
                      <div className="text-danger">{errors.oldpass}</div>
                    ) : null}
                  </FormGroup>
                  <FormGroup>
                    <Field
                      name="newpass"
                      placeholder="Nueva Contraseña"
                      id="newpass"
                      type="password"
                      className={`form-control ${errors.newpass &&
                        touched.newpass &&
                        "is-invalid"}`}
                    />
                    {errors.newpass && touched.newpass ? (
                      <div className="text-danger">{errors.newpass}</div>
                    ) : null}
                  </FormGroup>
                  <FormGroup>
                    <Field
                      name="confirmpass"
                      id="confirmpass"
                      type="password"
                      className={`form-control ${errors.confirmpass &&
                        touched.confirmpass &&
                        "is-invalid"}`}
                      placeholder="Confirma tu Contraseña"
                    />
                    {errors.confirmpass && touched.confirmpass ? (
                      <div className="text-danger">{errors.confirmpass}</div>
                    ) : null}
                  </FormGroup>
                  <div className="d-flex justify-content-start flex-wrap">
                    <Button.Ripple
                      className="mr-1 mb-1"
                      color="primary"
                      type="submit"
                    >
                      Guardar Cambios
                    </Button.Ripple>
                    <Button.Ripple
                      className="mb-1"
                      color="danger"
                      type="reset"
                      outline
                    >
                      Cancelar
                    </Button.Ripple>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, {displayAlert})(ChangePassword)
