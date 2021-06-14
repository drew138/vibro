import React from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  Media
} from "reactstrap"
import { connect } from "react-redux"
// import { createCompany } from "../../../../redux/actions/company"
import isValidAddress from "../../../../validators/address"
import isValidPhone from "../../../../validators/phone"
import isValidNit from "../../../../validators/nit"
import { displayAlert } from "../../../../redux/actions/alerts"
import { POST_COMPANY_ENDPOINT } from "../../../../config"
import { GET_CITIES_ENDPOINT } from "../../../../config"
import axios from "axios"
import AutoComplete from "../../../../components/@vuexy/autoComplete/AutoCompleteComponent"
// import { requestInterceptor, responseInterceptor } from "../../../../axios/axiosInstance"
import userImg from "../../../../assets/img/user/default.png"

const initialState = {
  name: "",
  nit: "",
  address: "",
  phone: "",
  city: "",
  picture: "",
  suggestions: [{ name: "" }],
  cityMap: {}
}


class Company extends React.Component {

  constructor(props) {
    super(props)
    this.imageInputRef = React.createRef();
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
  }

  state = {
    ...initialState
  }

  handleSubmit = async e => {
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
    const company = {
      name: this.state.name,
      nit: this.state.nit,
      address: this.state.address,
      phone: this.state.phone,
      city: this.state.cityMap[this.state.city]
    }
    if (this.state.picture) {
      company.picture = this.state.picture;
    }
    // console.log(data)
    try {
      const data = new FormData();
      Object.keys(company).forEach(key => data.append(key, company[key]));
      const res = await axios.post(POST_COMPANY_ENDPOINT, data)
      // dispatch({
      //   type: "SET_COMPANY_STATE",
      //   payload: { ...res.data }
      // })
      const alertData = {
        title: "Registro Exitoso",
        success: true,
        show: true,
        alertText: "Empresa creada exitosamente"
      }
      this.props.displayAlert(alertData)
      // dispatch({
      //   type: "DISPLAY_SWEET_ALERT",
      //   payload: alertData
      // })
      // history.push("/")
      this.setState({ ...initialState })
    } catch (e) {
      console.log(e)
      const alertData = {
        title: "Error de Validación",
        success: false,
        show: true,
        alertText: Object.entries(e.response.data)[0][1][0]
      }
      this.props.displayAlert(alertData)
      // dispatch({
      //   type: "DISPLAY_SWEET_ALERT",
      //   payload: alertData
      // })
    }


    // this.props.createCompany(data)
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

  render() {
    return (
      <Row>
        <Col sm="12">
          <Media className="mb-2 mt-2">
            <Media className="mr-1" left>
              <Media
                className="rounded-circle"
                object
                src={
                  this.state.picture ? URL.createObjectURL(this.state.picture) : userImg
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
                      // console.log(e.target.value)
                    }}
                    onSuggestionClick={e => {

                      this.setState({ city: e.target.innerText })
                      // console.log(e.target.innerText)
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

export default connect(mapStateToProps, { displayAlert })(Company) // tODO change redux actions
