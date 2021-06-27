import React from "react"
import {
  // Media,
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  Card,
  CardBody,
  CardImg,

} from "reactstrap"
import { connect } from "react-redux"
// import { createMachine } from "../../../../redux/actions/machine"
import { displayAlert } from "../../../../redux/actions/alerts"
import { GET_HIERARCHIES_ENDPOINT, CREATE_MACHINE_ENDPOINT } from "../../../../config"
import axios from "axios"
// import { CustomInput } from "reactstrap"

import defaultDiagramOrImage from "../../../../assets/img/machine/default.png"

const initialState = {

  identifier: "",
  name: "",
  code: "",
  electric_feed: "",
  brand: "",
  power: "",
  power_units: "KW",
  norm: "",
  company: 0,
  companyName: "Seleccione una opción",
  rpm: "",
  severity: "purple",
  severityName: "No Asignada (Morado)",
  image: undefined,
  diagram: undefined,
  hierarchy: 0,
  hierarchyName: "Seleccione una opción",
  hierarchies: [{ id: 0, name: "Seleccione una opción" }],

}


class MachineAdd extends React.Component {

  constructor(props) {
    super(props)
    // this.imageInputRef = React.createRef();
    // this.fileSelectedHandler = this.fileSelectedHandler.bind(this)


    this.diagramInputRef = React.createRef();
    this.imageInputRef = React.createRef();
    this.imageSelectedHandler = this.imageSelectedHandler.bind(this);
    this.diagramSelectedHandler = this.diagramSelectedHandler.bind(this);
  }

  state = {
    // id: 0,
    ...initialState
    // parent: 0,
    // parentName: "N/A",
    // parents: [{ id: 0, name: "N/A" }],
  }

  handleSubmit = async e => {
    e.preventDefault()
    const alertData = {
      title: "Error de Validación",
      success: false,
      show: true,
      alertText: ""
    }
    // console.log(this.state)
    const {
      identifier,
      name,
      code,
      electric_feed,
      brand,
      power,
      power_units,
      norm,
      company,
      hierarchy,
      rpm,
      image,
      diagram,
      severity
    } = this.state

    if (!identifier) {
      alertData.alertText = "Cada Máquina Debe Contar Con Un Identificador Único"
      this.props.displayAlert(alertData)
      return
    }

    if (!name) {
      alertData.alertText = "Cada Máquina Debe Contar Con Un Nombre"
      this.props.displayAlert(alertData)
      return
    }

    if (!brand) {
      alertData.alertText = "Cada Máquina Debe Contar Con Una Marca"
      this.props.displayAlert(alertData)
      return
    }
    // add more validators

    const machine = {
      identifier,
      name,
      code,
      electric_feed,
      brand,
      power,
      power_units,
      norm,
      company,
      hierarchy,
      rpm,
      image,
      diagram,
      severity
    }
    if (!hierarchy) {
      delete machine["hierarchy"]
    }

    try {
      const data = new FormData();
      Object.keys(machine).forEach(key => data.append(key, machine[key]));
      const res = await axios.post(CREATE_MACHINE_ENDPOINT, data)
      const alertData = {
        title: "Máquina Creada Exitosamente",
        success: true,
        show: true,
        alertText: `${res.data.name} ha sido agregado a la lista de maquinas de esta empresa`
      }
      this.props.displayAlert(alertData)
      this.setState({ ...initialState })
    } catch (e) {
      console.log(e.response.data)
      const alertData = {
        title: "Error de Validación",
        success: false,
        show: true,
        alertText: Object.entries(e.response.data)[0][1]
      }
      this.props.displayAlert(alertData)
    }
  }


  imageSelectedHandler = (event) => {
    this.setState({
      image: event.target.files[0]
    })
    // console.log(this.state)
  }

  imageUploadHandler = () => {
    this.imageInputRef.current.click()
  }

  removeImage = () => {
    this.imageInputRef.current.value = null
    this.setState({
      image: undefined
    })
  }




  diagramSelectedHandler = (event) => {
    this.setState({
      diagram: event.target.files[0]
    })
  }

  diagramUploadHandler = () => {
    this.diagramInputRef.current.click()
  }

  removeDiagram = () => {
    this.diagramInputRef.current.value = null
    this.setState({
      diagram: undefined
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

  async getHierarchies(id) {
    if (!id) {
      this.setState({
        hierarchies: [{ id: 0, name: "Seleccione una opción" }],
        hierarchy: 0,
        hierarchyName: "Seleccione una opción"
      })
      return
    }
    try {
      const res = await axios.get(GET_HIERARCHIES_ENDPOINT, {
        params: {
          company_id: id
        }
      });
      this.setState({ hierarchies: [{ id: 0, name: "Seleccione una opción" }, ...res.data] })
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <Row>
        <Col lg="6" md="6" sm="12">
          <Card>
            <CardBody>
              <CardImg
                className="img-fluid mb-2"
                height="300"
                src={this.state.image ? URL.createObjectURL(this.state.image) : defaultDiagramOrImage}
                alt="card image cap"
              />
              <input
                style={{ display: "none" }}
                type="file"
                onChange={this.imageSelectedHandler}
                ref={this.imageInputRef} />
              <h3>Imagen De Máquina</h3>

              <hr className="my-1" />
              <div className="card-btns d-flex justify-content-between mt-2">
                <Button.Ripple type="button" color="primary" onClick={this.imageUploadHandler}>
                  Cambiar
                </Button.Ripple>
                <Button.Ripple color="danger" outline type="button" onClick={this.removeImage}>
                  Quitar Foto
                </Button.Ripple>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6" md="6" sm="12">
          <Card>
            <CardBody>
              <CardImg
                className="img-fluid mb-2"
                src={this.state.diagram ? URL.createObjectURL(this.state.diagram) : defaultDiagramOrImage}
                alt="card image cap"
              />
              <input
                style={{ display: "none" }}
                type="file"
                onChange={this.diagramSelectedHandler}
                ref={this.diagramInputRef} />
              <h3>Diagrama Esquematico</h3>
              <hr className="my-1" />
              <div className="card-btns d-flex justify-content-between mt-2">
                <Button.Ripple type="button" color="primary" onClick={this.diagramUploadHandler}>
                  Cambiar
                </Button.Ripple>
                <Button.Ripple color="danger" type="button" outline onClick={this.removeDiagram}>
                  Quitar Foto
                </Button.Ripple>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12">
          <hr />
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="id">Identificador</Label>
                  <Input
                    type="number"
                    id="id"
                    placeholder="Identificador"
                    value={this.state.identifier}
                    onChange={e => this.setState({ identifier: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="name">Nombre</Label>
                  <Input
                    type="text"
                    id="machine-name"
                    placeholder="Nombre"
                    value={this.state.name}
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="code">Código</Label>
                  <Input
                    type="select"
                    id="code"
                    placeholder="Código"
                    value={this.state.code}
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const value = e.target.childNodes[idx].getAttribute("value");
                      this.setState({ code: value });
                    }}
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
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const value = e.target.childNodes[idx].getAttribute("value");
                      this.setState({ electric_feed: value })
                    }}
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
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const value = e.target.childNodes[idx].getAttribute("value");
                      this.setState({ power_units: value })
                    }}
                  >
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
                    id="machine-hierarchy"
                    placeholder="Jerarquía"
                    value={this.state.hierarchyName}
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const hierarchyId = parseInt(e.target.childNodes[idx].getAttribute("hierarchyid"))
                      this.setState({
                        hierarchyName: e.target.value,
                        hierarchy: hierarchyId
                      })
                    }}
                  >
                    {
                      this.state.hierarchies.map((hierarchy) => (
                        <option hierarchyid={hierarchy.id} key={hierarchy.id}>{hierarchy.name}</option>
                      ))
                    }
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="rpm">RPM</Label>
                  <Input
                    type="text"
                    id="rpm"
                    placeholder="RPM"
                    value={this.state.rpm}
                    onChange={e => this.setState({ rpm: e.target.value })}
                  >
                  </Input>
                </FormGroup>
              </Col>
              {/* <Col md="6" sm="12">
                <FormGroup>
                <Label for="customFile">Imagen</Label>
                <CustomInput
                type="file"
                id="image"
                name="Imagen"
                onChange={e => {
                  this.setState({ image: e.target.files[0] ?? "" })
                }}
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
                    onChange={e => {
                      this.setState({ diagram: e.target.files[0] ?? "" })
                    }}
                    />
                    </FormGroup>
                  </Col> */}


              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="company-hierarchy">Empresa</Label>
                  <Input
                    type="select"
                    id="company-hierarchy"
                    value={this.state.companyName}
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const companyId = parseInt(e.target.childNodes[idx].getAttribute('companyid'));
                      this.getHierarchies(companyId);
                      this.setState({ company: companyId, companyName: e.target.value });
                    }}
                  >
                    {
                      this.props.companies.map((company) => (
                        <option companyid={company.id} key={company.id}>{company.name}</option>
                      ))
                    }
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="norm">Severidad</Label>
                  <Input
                    type="select"
                    id="severity"
                    placeholder="Severidad"
                    value={this.state.severityName}
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const severity = e.target.childNodes[idx].getAttribute('severity');
                      this.setState({
                        severity,
                        severityName: e.target.value
                      })
                    }}
                  >
                    <option severity="green">OK (Verde)</option>
                    <option severity="yellow">Alerta (Amarillo)</option>
                    <option severity="red">Alarma (Rojo)</option>
                    <option severity="purple">No Asignada (Morado)</option>
                    <option severity="black">No Medido (Negro)</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col
                className="d-flex justify-content-end flex-wrap mt-2"
                sm="12"
              >
                <Button.Ripple className="mr-1" color="primary">
                  Crear Máquina
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
    auth: state.auth,
    company: state.company
  }
}

export default connect(mapStateToProps, { displayAlert })(MachineAdd)
