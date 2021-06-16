import React from "react"
import { history } from "../../../history"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import { GET_MEASUREMENTS_ENDPOINT, DELETE_MEASUREMENT_ENDPOINT } from "../../../config"
import {
  Card,
  CardBody,
  // CardHeader,
  // CardTitle,
  // FormGroup,
  // Label,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  // Collapse,
  // Spinner,
  // Button
} from "reactstrap"
import { AgGridReact } from "ag-grid-react"
import { connect } from "react-redux"
import axios from "axios"
import {
  ChevronDown,
  // RotateCw,
  // X
} from "react-feather"
// import classnames from "classnames"
import { ContextLayout } from "../../../utility/context/Layout"
import { setMachine } from "../../../redux/actions/machine"
import { setCompany } from "../../../redux/actions/company"
import { displayAlert } from "../../../redux/actions/alerts"
import { Activity, Edit, Trash2 } from "react-feather"
import { updateProfile } from "../../../redux/actions/auth/updateActions"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import SweetAlert from 'react-bootstrap-sweetalert';


class MeasurementList extends React.Component {

  constructor(props) {
    super(props)
    // if (!props.machine.id) {
    //   history.push("/")
    // }
  }



  state = {
    show: false,
    rowData: [{ severity: "black" }],
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
    // companies: [{ id: 0, name: "Seleccione una opción" }],
    // companiesMap: {},
    // companyName: "Seleccione una opción",
    // title: "",
    // company: 0,
    // buttonDisabled: true,
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
                  onClick={() => {
                    this.props.setCompany(this.state.companiesMap[this.state.company])
                    this.props.setMachine(params.data)
                    history.push("/services/monitoring/machine")
                  }}



                />

                <Edit className="ml-1 mr-1"
                  onClick={
                    () => {

                      this.props.setCompany(params.data)
                      history.push("/app/companies/list/edit")
                    }
                  } />
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
                <div className="badge badge-pill badge-light-danger">
                  Alarma
                </div>
              )
            case "yellow":
              return (
                <div className="badge badge-pill badge-light-warning">
                  Alerta
                </div>
              )
            case "green":
              return (
                <div className="badge badge-pill badge-light-success">
                  Ok
                </div>
              )
            case "purple":
              return (
                <div className="badge badge-pill badge-light-primary">
                  No Asignada
                </div> // ! TODO cambiar a valor por defecto
              )
            case "black":
              return (
                <div
                  className="badge badge-pill"
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
                <div className="badge badge-pill badge-light-primary">
                  No Asignada
                </div> // ! TODO cambiar a valor por defecto
              )
          }
        }
      },
      {
        headerName: "Fecha",
        field: "data",
        filter: false,
        width: 200,
      },
      // {
      //   headerName: "Máquina",
      //   // field: "code",
      //   filter: true,
      //   width: 200,
      //   cellRendererFramework: params => {
      //     return (
      //       <div
      //         className="d-flex align-items-center cursor-pointer"
      //       >
      //         {/* <img
      //           className="rounded-circle mr-50"
      //           src={params.data.avatar}
      //           alt="user avatar"
      //           height="30"
      //           width="30"
      //         /> */}
      //         <span>{params.data.machine?.name}</span>
      //       </div>
      //     )
      //   }
      // },
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

  // async getCompanyMachines(companyId) {
  //   if (!companyId) {
  //     this.setState({ rowData: [] })
  //     return
  //   }
  //   try {
  //     // console.log(companyId)
  //     const res = await axios.get(GET_MACHINES_ENDPOINT, {
  //       params: { company_id: companyId }
  //     })
  //     const rowData = [...res.data]
  //     this.setState({ rowData })
  //   } catch {
  //     const alertData = {
  //       title: "Error de Conexión",
  //       success: false,
  //       show: true,
  //       alertText: "Error al Conectar al Servidor"
  //     }
  //     this.props.displayAlert(alertData)
  //     this.setState({ rowData: [] })
  //   }
  // }

  async componentDidMount() {
    if (!this.props.machine.id) {
      return
    }



    // setTimeout(() => {
    //   // console.log(this.props.auth.company?.id)

    //   this.setState({
    //     company: this.props.auth.company ?? 0,
    //     // companyName: this.props.auth.company?.name ?? "Seleccione una opción",
    //   })
    //   this.getCompanyMachines(this.props.auth.company ?? 0);
    // }, 700)

    // if (this.props.auth.user_type === "client") {
    //   return
    // }

    try {
      const res = await axios.get(GET_MEASUREMENTS_ENDPOINT, {
        params: {
          machine: this.props.machine.id
        }
      })
      const companiesMap = {};
      res.data.forEach(
        comp => {
          companiesMap[comp.id] = comp
        }
      );
      const companies = [{ id: 0, name: "Seleccione una opción" }, ...res.data];
      const currentCompany = companies.filter((company) => company.id === this.props.auth.company);
      const title = currentCompany ? currentCompany[0].name : "";
      this.setState({
        companies,
        companiesMap,
        title,
        companyName: currentCompany ? currentCompany[0].name : "Seleccione una opción",
        company: currentCompany ? currentCompany[0].id : "Seleccione una opción"

      })

    } catch {
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
        title: "Empresa Borrada Exitosamente",
        success: true,
        show: true,
        alertText: `Se Ha Borrado ${this.state.name} De La Lista de Empresas.`
      }
      this.props.displayAlert(alertData)
      const tmp = this.state.id;
      this.setState({
        rowData: [...this.state.rowData.filter((company) => company.id !== tmp)],
        id: 0,
        name: ""
      })
    } catch (e) {
      const alertData = {
        title: "Error Al Borrar Empresa",
        success: false,
        show: true,
        alertText: "Ha Surgido Un Error Al Intentar Borrar Esta Empresa."
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
          breadCrumbParent="Máquina"
          breadCrumbActive="Mediciones"
        />
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
    machine: state.machine
  }
}

export default connect(mapStateToProps, { setMachine, setCompany, displayAlert, updateProfile })(MeasurementList)

