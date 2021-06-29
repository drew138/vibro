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
  // Card,
  // CardBody,
  // CardImg,

} from "reactstrap"
import { connect } from "react-redux"
import { displayAlert } from "../../../../redux/actions/alerts"
import { GET_HIERARCHIES_ENDPOINT, GET_MACHINES_ENDPOINT, CREATE_POINT_ENDPOINT } from "../../../../config"
import axios from "axios"


const initialState = {
  company: 0,
  companyName: "Seleccione una opción",
  severity: "purple",
  severityName: "No Asignado (Morado)",
  hierarchy: 0,
  hierarchyName: "Seleccione una opción",
  hierarchies: [{ id: 0, name: "Seleccione una opción" }],
  machines: [{ id: 0, name: "Seleccione una opción" }],
  machine: 0,
  machineName: "Seleccione una opción",
  position: 0,
  positionName: "Seleccione una opción",
  directionName: "Seleccione una opción",
  direction: "",
  point_type: 0,
  pointTypeName: "Seleccione una opción"
}


class PointAdd extends React.Component {

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

    const point = {
      machine: this.state.machine,
      position: this.state.position,
      direction: this.state.direction,
      point_type: this.state.point_type,
      severity: this.state.severity,
    }
    if (!point.machine) {
      alertData.alertText = "Cada Punto Debe Tener Una Máquina Asignada.";
      this.props.displayAlert(alertData);
      return
    }
    if (!point.position) {
      alertData.alertText = "Cada Punto Debe Tener Una Posición Asignada.";
      this.props.displayAlert(alertData);
      return
    }
    if (!point.direction) {
      alertData.alertText = "Cada Punto Debe Tener Una Dirección Asignada.";
      this.props.displayAlert(alertData);
      return
    }
    if (!point.point_type) {
      alertData.alertText = "Cada Punto Debe Tener Un Tipo Asignado.";
      this.props.displayAlert(alertData);
      return
    }
    try {

      const res = await axios.post(CREATE_POINT_ENDPOINT, point)
      const alertData = {
        title: "Punto Creado Exitosamente",
        success: true,
        show: true,
        alertText: `${res.data.position}-${res.data.direction}-${res.data.point_type} Ha Sido Agregado A La Lista De Puntos De Esta Máquina.`
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

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  async getHierarchies(id) {
    this.setState({
      hierarchy: 0,
      hierarchyName: "Seleccione una opción",
      machine: 0,
      machineName: "Seleccione una opción",
      machines: [{ id: 0, name: "Seleccione una opción" }]
    })
    if (!id) {
      this.setState({
        hierarchies: [{ id: 0, name: "Seleccione una opción" }],
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

  async getMachines(id) {
    this.setState({
      machine: 0,
      machineName: "Seleccione una opción"
    })
    if (!id) {
      this.setState({
        machines: [{ id: 0, name: "Seleccione una opción" }]
      })
      return
    }
    try {
      const res = await axios.get(GET_MACHINES_ENDPOINT, {
        params: {
          hierarchy: id
        }
      });
      this.setState({ machines: [{ id: 0, name: "Seleccione una opción" }, ...res.data] })
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <Row>
        <Col sm="12">
          <Form onSubmit={this.handleSubmit}>
            <Row>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="company">Empresa</Label>
                  <Input
                    type="select"
                    id="company"
                    value={this.state.companyName}
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const companyId = parseInt(e.target.childNodes[idx].getAttribute('companyid'));
                      this.setState({
                        companyName: e.target.value,
                        company: companyId
                      });
                      this.getHierarchies(companyId);
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
                  <Label for="hierarchy">Jerarquía</Label>
                  <Input
                    type="select"
                    id="hierarchy"
                    value={this.state.hierarchyName}
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const hierarchy = parseInt(e.target.childNodes[idx].getAttribute("hierarchy"));
                      const newState = { hierarchy, hierarchyName: e.target.value }
                      this.setState({ ...newState })
                      this.getMachines(hierarchy)
                    }}
                  >
                    {
                      this.state.hierarchies.map((hierarchy) => (
                        <option hierarchy={hierarchy.id} key={hierarchy.id}>{hierarchy.name}</option>
                      ))
                    }
                  </Input>
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="machine">Máquina</Label>
                  <Input
                    type="select"
                    id="machine"
                    value={this.state.machineName}
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const machine = parseInt(e.target.childNodes[idx].getAttribute("machine"));
                      this.setState({ machine, machineName: e.target.value })
                    }}
                  >
                    {
                      this.state.machines.map((machine) => (

                        <option machine={machine.id}>{machine.name}</option>
                      ))
                    }

                  </Input>
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="position">Posición</Label>
                  <Input
                    type="select"
                    id="position"
                    placeholder="Posición"
                    value={this.state.positionName}
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const position = parseInt(e.target.childNodes[idx].getAttribute("position"));
                      this.setState({ position, positionName: e.target.value })
                    }}
                  >
                    <option position="0">Seleccione una opción</option>
                    <option position="1">1</option>
                    <option position="2">2</option>
                    <option position="3">3</option>
                    <option position="4">4</option>
                    <option position="5">5</option>
                    <option position="6">6</option>
                    <option position="7">7</option>
                    <option position="8">8</option>
                    <option position="9">9</option>
                    <option position="10">10</option>
                    <option position="11">11</option>
                    <option position="12">12</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="direction">Dirección</Label>
                  <Input
                    type="select"
                    id="direction"
                    placeholder="Dirección"
                    value={this.state.directionName}
                    onChange={e => {
                      const idx = e.target.selectedIndex;
                      const direction = e.target.childNodes[idx].getAttribute("direction");
                      this.setState({ direction, directionName: e.target.value })
                    }}
                  >
                    <option >Seleccione una opción</option>
                    <option direction="V">Vertical</option>
                    <option direction="H">Horizontal</option>
                    <option direction="A">Axial</option>
                    <option direction="O">Ortogonal</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="point_type">Tipo</Label>
                  <Input
                    type="select"
                    id="point_type"
                    value={this.state.pointTypeName}
                    onChange={e => {

                      const idx = e.target.selectedIndex;
                      const point_type = e.target.childNodes[idx].getAttribute("point_type");
                      this.setState({ point_type, pointTypeName: e.target.value })
                    }}
                  >
                    <option >Seleccione una opción</option>
                    <option point_type="A">Aceleración</option>
                    <option point_type="V">Velocidad</option>
                    <option point_type="D">Desplazamiento</option>
                    <option point_type="T">Temperatura</option>
                    <option point_type="E">Envolvente</option>
                    <option point_type="H">HFD</option>
                    <option point_type="M">Manual</option>
                    <option point_type="C">Calculado</option>
                  </Input>
                </FormGroup>
              </Col>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="severity">Severidad</Label>
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

export default connect(mapStateToProps, { displayAlert })(PointAdd)
