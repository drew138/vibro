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
import { CustomInput } from "reactstrap"


class CompanyTab extends React.Component {

  // constructor(props) {
  //   super(props)
  //   this.imageInputRef = React.createRef();
  //   this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
  // }

  state = {
    id: null,
    name: "",
    code: "",
    electric_feed: "",
    brand: "",
    power: "",
    power_units: "",
    norm: "",
    hierarchy: "",
    rpm: "",
    image: "",
    diagram: "",
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
                  <Label for="id">Identificador</Label>
                  <Input
                    type="number"
                    id="id"
                    placeholder="Identificador"
                    value={this.state.id}
                    onChange={e => this.setState({ id: e.target.value })}
                  />
                </FormGroup>
              </Col>

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
                  <Label for="nit">Código</Label>
                  <Input
                    type="select"
                    id="code"
                    placeholder="Código"
                    value={this.state.power_units}
                    onChange={e => this.setState({ code: e.target.value })}
                  >
                    <option value="">Seleccione una opción</option> 
                    <option value="interno">Interno</option> 
                    <option value="sap">SAP</option> 
                  </Input>
                </FormGroup>
              </Col>            
              
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="electric_feed">Alimentación Eléctrica</Label>
                  <Input
                    type="select"
                    id="electric_feed"
                    placeholder="Alimentación Eléctrica"
                    value={this.state.electric_feed}
                    onChange={e => this.setState({ electric_feed: e.target.value })}
                  >
                    <option value="">Seleccione una opción</option> 
                    <option value="directa">Directa</option>
                    <option value="variador">Variador</option> 
                  </Input>
                </FormGroup>
              </Col>

              
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="power">Potencia</Label>
                  <Input
                    type="number"
                    id="power"
                    placeholder="Potencia"
                    value={this.state.power}
                    onChange={e => this.setState({ power: e.target.value })}
                  >
                  </Input>
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="power_units">Unidades de Potencia</Label>
                  <Input
                    type="select"
                    id="power_units"
                    placeholder="Unidades de Potencia"
                    value={this.state.power_units}
                    onChange={e => this.setState({ power_units: e.target.value })}
                  >
                    <option value="">Seleccione una opción</option> 
                    <option value="KW">KiloWatts</option>
                    <option value="HP">HorsePower</option> 
                  </Input>
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="brand">Marca</Label>
                  <Input
                    type="text"
                    id="brand"
                    placeholder="Marca"
                    value={this.state.brand}
                    onChange={e => this.setState({ brand: e.target.value })}
                  />
                </FormGroup>
              </Col>

              <Col md="6" sm="12"> 
                <FormGroup>
                  <Label for="norm">Norma</Label>
                  <Input
                    type="select"
                    id="norm"
                    placeholder="Norma"
                    value={this.state.norm}
                    onChange={e => this.setState({ norm: e.target.value })}
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
                    placeholder="Jerarquía"
                    value={this.state.hierarchy}
                    onChange={e => this.setState({ hierarchy: e.target.value })}
                  >
                    <option></option>
                  </Input>
                </FormGroup>
              </Col>
              
              <Col md="6" sm="12"> 
                <FormGroup>
                  <Label for="rpm">RPM</Label>
                  <Input
                    type="select"
                    id="rpm"
                    placeholder="RPM"
                    value={this.state.rpm}
                    onChange={e => this.setState({ rpm: e.target.value })}
                  >
                    <option></option>
                  </Input>
                </FormGroup>
              </Col>


              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="customFile">Imagen</Label>
                  <CustomInput
                    type="file"
                    id="image"
                    name="Imagen"
                  />
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="customFile">Diagrama</Label>
                  <CustomInput
                    type="file"
                    id="diagram"
                    name="Diagrama"
                  />
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
