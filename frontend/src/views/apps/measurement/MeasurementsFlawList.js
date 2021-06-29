import React from "react"
import { history } from "../../../history"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import { GET_MEASUREMENTS_ENDPOINT } from "../../../config"
import {
  Card,
  CardBody,
  Row,
  Col,
  Table
} from "reactstrap"
import { connect } from "react-redux"
import axios from "axios"
import { setMeasurement } from "../../../redux/actions/measurement"
import { displayAlert } from "../../../redux/actions/alerts"
import { updateProfile } from "../../../redux/actions/auth/updateActions"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"


class MeasurementList extends React.Component {

  constructor(props) {
    super(props)
    if (!props.machine.id) {
      history.push("/")
    }
  }

  state = {
    rowData: [],
  }

  createPill(severity) {
    switch (severity) {
      case "red":
        return (
          <div className="badge badge-pill badge-light-danger w-100">
            R
          </div>
        )
      case "yellow":
        return (
          <div className="badge badge-pill badge-light-warning w-100">
            A
          </div>
        )
      case "green":
        return (
          <div className="badge badge-pill badge-light-success w-100">
            V
          </div>
        )
      case "purple":
        return (
          <div className="badge badge-pill badge-light-primary w-100">
            M
          </div>
        )
      case "black":
        return (
          <div
            className="badge badge-pill w-100"
            style={{
              backgroundColor: "#43393A",
              color: "#F0E5E6",
              fontWeight: "500",
              textTransform: "uppercase"
            }}>
            N
          </div>
        )
      default:
        return (
          <div className="badge badge-pill badge-light-primary w-100">
            M
          </div>
        )
    }

  }

  async componentDidMount() {
    if (!this.props.machine.id) {
      return
    }
    try {
      const res = await axios.get(GET_MEASUREMENTS_ENDPOINT, {
        params: {
          machine: this.props.machine.id
        }
      })
      this.setState({
        rowData: [...res.data]
      })
    } catch (e) {
      console.log(e)
      // console.log(e.response.data)
      const alertData = {
        title: "Error de Conexión",
        success: false,
        show: true,
        alertText: "Error al Conectar al Servidor"
      }
      this.props.displayAlert(alertData)
      this.setState({ rowData: [] })
    }
  }



  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Fallas"
          breadCrumbParent="Lista de Máquinas"
          breadCrumbParent2={`${this.props.machine.name} (ID: ${this.props.machine.identifier})`}
          breadCrumbActive="Fallas"
        />
        <div className="content-header row">
          <div className="content-header-left col-md-9 col-12 mb-2">
            <div className="row breadcrumbs-top">
              <div className="col-12">
                <h4 className="content-header-title float-left mb-0">
                  {this.props.hierarchy.fullHierarchy}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <Row className="app-user-list">
          <Col sm="12">
            <Card>
              <CardBody>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Bal</th>
                      <th>Ali</th>
                      <th>Ten</th>
                      <th>Lub</th>
                      <th>Rod</th>
                      <th>Hol</th>
                      <th>Exc</th>
                      <th>Sol</th>
                      <th>Fra</th>
                      <th>Vac</th>
                      <th>Elec</th>
                      <th>Ins</th>
                      <th>Estr</th>
                      <th>Res</th>
                      <th>Otro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.rowData.map((row) => (
                      <tr key={row.id}>
                        <th scope="row">{row.date}</th>
                        <td>{this.createPill(row.balanceo)}</td>
                        <td>{this.createPill(row.alineacion)}</td>
                        <td>{this.createPill(row.tension)}</td>
                        <td>{this.createPill(row.lubricacion)}</td>
                        <td>{this.createPill(row.rodamientos)}</td>
                        <td>{this.createPill(row.holgura)}</td>
                        <td>{this.createPill(row.excentricidad)}</td>
                        <td>{this.createPill(row.soltura)}</td>
                        <td>{this.createPill(row.fractura)}</td>
                        <td>{this.createPill(row.vacio)}</td>
                        <td>{this.createPill(row.electrico)}</td>
                        <td>{this.createPill(row.inspeccion)}</td>
                        <td>{this.createPill(row.estructural)}</td>
                        <td>{this.createPill(row.resonancia)}</td>
                        <td>{this.createPill(row.otro)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>


      </React.Fragment >
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    machine: state.machine,
    hierarchy: state.hierarchy
  }
}

export default connect(mapStateToProps, { setMeasurement, displayAlert, updateProfile })(MeasurementList)

