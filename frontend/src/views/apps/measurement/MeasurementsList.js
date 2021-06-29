import React from "react"
import { history } from "../../../history"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import { GET_MEASUREMENTS_ENDPOINT, DELETE_MEASUREMENT_ENDPOINT } from "../../../config"
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from "reactstrap"
import { AgGridReact } from "ag-grid-react"
import { connect } from "react-redux"
import axios from "axios"
import {
  ChevronDown,
} from "react-feather"
import { ContextLayout } from "../../../utility/context/Layout"
import { setMeasurement } from "../../../redux/actions/measurement"
import { displayAlert } from "../../../redux/actions/alerts"
import { Activity, Edit, Trash2 } from "react-feather"
import { updateProfile } from "../../../redux/actions/auth/updateActions"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import SweetAlert from 'react-bootstrap-sweetalert';


class MeasurementList extends React.Component {

  constructor(props) {
    super(props)
    if (!props.machine.id) {
      history.push("/")
    }
  }



  state = {
    show: false,
    rowData: [],
    pageSize: 20,
    isVisible: true,
    reload: false,
    collapse: true,
    is_active: "All",
    userType: "All",
    selectStatus: "All",
    verified: "All",
    department: "All",
    defaultColDef: {
      sortable: true
    },
    searchVal: "",
    columnDefs: [
      {
        width: 150,
        cellRendererFramework: params => {
          return (
            <div
              className="d-flex align-items-center justify-content-around cursor-pointer"
            >
              <span>
                <Activity
                  className="fonticon-container"
                  style={{ color: "#6b6b6b" }}
                  onClick={() => {
                    this.props.setMeasurement(params.data)
                    history.push("/app/measurement/view")
                  }}
                />
                {
                  this.props.auth.user_type !== "client" && this.props.auth.user_type !== "arduino" &&
                  <Edit className="ml-1 mr-1"
                    style={{ color: "#6b6b6b" }}
                    onClick={
                      () => {
                        this.props.setMeasurement(params.data)
                        history.push("/app/measurement/edit")
                      }
                    } />
                }
                {this.props.auth.user_type === "admin" &&
                  <Trash2 style={{ color: "#F9596E" }}
                    onClick={
                      () => this.setState({
                        name: params.data.name,
                        id: params.data.id,
                        show: true
                      })
                    }
                  />}

              </span>
            </div>
          )
        }
      },
      {
        headerName: "Severidad",
        width: 150,
        cellRendererFramework: params => {
          switch (params.data.severity) {
            case "red":
              return (
                <div className="badge badge-pill badge-light-danger w-100">
                  Alarma
                </div>
              )
            case "yellow":
              return (
                <div className="badge badge-pill badge-light-warning w-100">
                  Alerta
                </div>
              )
            case "green":
              return (
                <div className="badge badge-pill badge-light-success w-100">
                  Ok
                </div>
              )
            case "purple":
              return (
                <div className="badge badge-pill badge-light-primary w-100">
                  No Asignada
                </div> // ! TODO cambiar a valor por defecto
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
                  No Medido
                </div>
              )
            default:
              return (
                <div className="badge badge-pill badge-light-primary w-100">
                  No Asignada
                </div> // ! TODO cambiar a valor por defecto
              )
          }
        }
      },
      {
        headerName: "Fecha",
        field: "date",
        filter: true,
        width: 125,
      },
      {
        headerName: "Servicio",
        field: "service",
        filter: true,
        width: 200
      },
      {
        headerName: "Tipo",
        field: "measurement_type",
        filter: true,
        width: 200
      }
    ]
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

  deleteMeasurement = async () => {
    this.setState({ show: false })
    if (!this.state.id) {
      return
    }

    try {
      const res = await axios.delete(`${DELETE_MEASUREMENT_ENDPOINT}${this.state.id}/`)
      const alertData = {
        title: "Medición Borrada Exitosamente",
        success: true,
        show: true,
        alertText: `Se Ha Borrado ${this.state.name} De La Lista de Mediciones.`
      }
      this.props.displayAlert(alertData)
      const tmp = this.state.id;
      this.setState({
        rowData: [...this.state.rowData.filter((measurement) => measurement.id !== tmp)],
        id: 0,
        name: ""
      })
    } catch (e) {
      const alertData = {
        title: "Error Al Borrar Medición ",
        success: false,
        show: true,
        alertText: "Ha Surgido Un Error Al Intentar Borrar Esta Medición"
      }
      this.props.displayAlert(alertData)
    }
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }

  filterData = (column, val) => {
    var filter = this.gridApi.getFilterInstance(column)
    var modelObj = null
    if (val !== "all") {
      modelObj = {
        type: "equals",
        filter: val
      }
    }
    filter.setModel(modelObj)
    this.gridApi.onFilterChanged()
  }

  filterSize = val => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val))
      this.setState({
        pageSize: val
      })
    }
  }
  updateSearchQuery = val => {
    this.gridApi.setQuickFilter(val)
    this.setState({
      searchVal: val
    })
  }

  refreshCard = () => {
    this.setState({ reload: true })
    setTimeout(() => {
      this.setState({
        reload: false,
        role: "All",
        selectStatus: "All",
        verified: "All",
        department: "All"
      })
    }, 500)
  }

  toggleCollapse = () => {
    this.setState(state => ({ collapse: !state.collapse }))
  }
  onEntered = () => {
    this.setState({ status: "Opened" })
  }
  onEntering = () => {
    this.setState({ status: "Opening..." })
  }

  onEntered = () => {
    this.setState({ status: "Opened" })
  }
  onExiting = () => {
    this.setState({ status: "Closing..." })
  }
  onExited = () => {
    this.setState({ status: "Closed" })
  }
  removeCard = () => {
    this.setState({ isVisible: false })
  }

  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Mediciones"
          breadCrumbParent="Lista de Máquinas"
          breadCrumbParent2={`${this.props.machine.name} (ID: ${this.props.machine.identifier})`}
          breadCrumbActive="Mediciones"
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
                <div className="ag-theme-material ag-grid-table">
                  <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                    <div className="d-flex justify-content-between flex-wrap">
                      <div className="ml-1 mt-1 mr-1">Paginación</div>
                      <div className="sort-dropdown">
                        <UncontrolledDropdown className="ag-dropdown p-1">
                          <DropdownToggle tag="div">
                            {pageSize}
                            <ChevronDown className="ml-50" size={15} />
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem
                              tag="div"
                              onClick={() => this.filterSize(10)}
                            >
                              10
                            </DropdownItem>
                            <DropdownItem
                              tag="div"
                              onClick={() => this.filterSize(20)}
                            >
                              20
                            </DropdownItem>
                            <DropdownItem
                              tag="div"
                              onClick={() => this.filterSize(30)}
                            >
                              30
                            </DropdownItem>
                            <DropdownItem
                              tag="div"
                              onClick={() => this.filterSize(40)}
                            >
                              40
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </div>
                    <div className="filter-actions d-flex">
                      <Input
                        className="w-100 mr-1 mb-1 mb-sm-0"
                        type="text"
                        placeholder="search..."
                        onChange={e => this.updateSearchQuery(e.target.value)}
                        value={this.state.searchVal}
                      />
                    </div>
                  </div>
                  {this.state.rowData !== null ? (
                    <ContextLayout.Consumer>
                      {context => (
                        <AgGridReact
                          gridOptions={{}}
                          rowSelection="multiple"
                          defaultColDef={defaultColDef}
                          columnDefs={columnDefs}
                          rowData={rowData}
                          onGridReady={this.onGridReady}
                          colResizeDefault={"shift"}
                          animateRows={true}
                          floatingFilter={true}
                          pagination={true}
                          pivotPanelShow="always"
                          paginationPageSize={pageSize}
                          resizable={true}
                          enableRtl={context.state.direction === "rtl"}
                        />
                      )}
                    </ContextLayout.Consumer>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {this.props.auth.user_type === "admin" && <SweetAlert
          warning
          title="¿Estas Seguro Que Deseas Borrar Este Elemento?"
          showCancel
          show={this.state.show}
          cancelBtnText="Cancelar"
          confirmBtnText="Borrar Medición"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="primary"
          onConfirm={this.deleteMeasurement}
          onCancel={() => this.setState({ show: false })}
        >

          <p className="sweet-alert-text">
            Todos Los Valores Asociados Serán Borrados Junto Con Esta Medición.
          </p>
        </SweetAlert>}

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

