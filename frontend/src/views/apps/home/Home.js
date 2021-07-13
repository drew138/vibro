import React from "react"
import { history } from "../../../history"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import {
  GET_MACHINES_ENDPOINT,
  GET_COMPANIES_ENDPOINT,
  GET_HIERARCHIES_ENDPOINT,
  DELETE_MACHINE_ENDPOINT
} from "../../../config"
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Collapse,
  Spinner,
  Button
} from "reactstrap"
import { AgGridReact } from "ag-grid-react"
import { connect } from "react-redux"
import axios from "axios"
import {
  ChevronDown,
  RotateCw,
  Edit,
  FilePlus,
  Trash2,
  Activity,
  List
} from "react-feather"
import classnames from "classnames"
import { ContextLayout } from "../../../utility/context/Layout"
import { setMachine } from "../../../redux/actions/machine"
import { setCompany } from "../../../redux/actions/company"
import { displayAlert } from "../../../redux/actions/alerts"
import { updateProfile } from "../../../redux/actions/auth/updateActions"
import SweetAlert from 'react-bootstrap-sweetalert';
import { setFullHierarchy } from "../../../redux/actions/hierarchy"

class MachineList extends React.Component {

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
    companies: [{ id: 0, name: "Seleccione una opción" }],
    companiesMap: {},
    companyName: "Seleccione una opción",
    title: "",
    company: 0,
    buttonDisabled: true,
    hierarchies: [],
    hierarchyMap: {},
    id: 0, // used to delete machine 
    name: "", // used to delete machine
    columnDefs: [
      {
        width: 180,
        cellRendererFramework: params => {
          return (
            <div
              className="d-flex align-items-center justify-content-around cursor-pointer"
            >
              <span>
                <Activity
                  style={{ color: "#6b6b6b" }}
                  onClick={() => {
                    this.props.setCompany(this.state.companiesMap[this.state.company])
                    this.props.setMachine(params.data)
                    this.props.setFullHierarchy(this.getFullHierarchy(params.data.hierarchy))
                    history.push("/app/measurement/list") // TODO change
                  }}
                />
                <List
                  style={{ color: "#6b6b6b" }}
                  className="ml-1"
                  onClick={() => {
                    this.props.setCompany(this.state.companiesMap[this.state.company])
                    this.props.setMachine(params.data)
                    this.props.setFullHierarchy(this.getFullHierarchy(params.data.hierarchy))
                    history.push("/app/point/list") // TODO change
                  }}
                />
                {this.props.auth.user_type !== "client" && <><Edit className="ml-1 mr-1"
                  style={{ color: "#6b6b6b" }}
                  onClick={
                    () => {
                      this.props.setCompany(this.state.companiesMap[this.state.company])
                      this.props.setMachine(params.data)
                      this.props.setFullHierarchy(this.getFullHierarchy(params.data.hierarchy))
                      history.push("/app/machine/edit")
                    }
                  } />
                  <FilePlus
                    style={{ color: "#6b6b6b" }}
                    className="mr-1"
                    onClick={
                      () => {
                        this.props.setCompany(this.state.companiesMap[this.state.company])
                        this.props.setFullHierarchy(this.getFullHierarchy(params.data.hierarchy))
                        this.props.setMachine(params.data)
                        history.push("/app/measurement/add")
                      }
                    } /></>}
                {
                  this.props.auth.user_type === "admin" &&
                  <Trash2
                    style={{ color: "#F9596E" }}
                    onClick={
                      () => this.setState({
                        name: params.data.name,
                        id: params.data.id,
                        show: true
                      })
                    }
                  />
                }
              </span>
            </div>
          )
        }
      },
      {
        headerName: "Severidad", // todos mismo tamano y texto centrado
        width: 150,
        cellRendererFramework: params => {
          switch (params.data.severity) {
            case "red":
              return (
                <div
                  onClick={
                    () => {
                      this.props.setCompany(this.state.companiesMap[this.state.company])
                      this.props.setMachine(params.data)
                      this.props.setFullHierarchy(this.getFullHierarchy(params.data.hierarchy))
                      history.push("/app/measurement/flaws")
                    }
                  }
                  className="badge badge-pill badge-light-danger w-100">
                  Alarma
                </div>
              )
            case "yellow":
              return (
                <div
                  onClick={
                    () => {
                      this.props.setCompany(this.state.companiesMap[this.state.company])
                      this.props.setMachine(params.data)
                      this.props.setFullHierarchy(this.getFullHierarchy(params.data.hierarchy))
                      history.push("/app/measurement/flaws")
                    }
                  }

                  className="badge badge-pill badge-light-warning w-100">
                  Alerta
                </div>
              )
            case "green":
              return (
                <div
                  onClick={
                    () => {
                      this.props.setCompany(this.state.companiesMap[this.state.company])
                      this.props.setMachine(params.data)
                      this.props.setFullHierarchy(this.getFullHierarchy(params.data.hierarchy))
                      history.push("/app/measurement/flaws")
                    }
                  }

                  className="badge badge-pill badge-light-success w-100">
                  Ok
                </div>
              )
            case "purple":
              return (
                <div

                  onClick={
                    () => {
                      this.props.setCompany(this.state.companiesMap[this.state.company])
                      this.props.setMachine(params.data)
                      this.props.setFullHierarchy(this.getFullHierarchy(params.data.hierarchy))
                      history.push("/app/measurement/flaws")
                    }
                  }
                  className="badge badge-pill badge-light-primary w-100">
                  No Asignado
                </div>
              )
            case "black":
              return (
                <div
                  onClick={
                    () => {
                      this.props.setCompany(this.state.companiesMap[this.state.company])
                      this.props.setMachine(params.data)
                      this.props.setFullHierarchy(this.getFullHierarchy(params.data.hierarchy))
                      history.push("/app/measurement/flaws")
                    }
                  }
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
                <div
                  onClick={
                    () => {
                      this.props.setCompany(this.state.companiesMap[this.state.company])
                      this.props.setMachine(params.data)
                      this.props.setFullHierarchy(this.getFullHierarchy(params.data.hierarchy))
                      history.push("/app/measurement/flaws")
                    }
                  }
                  className="badge badge-pill badge-light-primary w-100">
                  No Asignado
                </div>
              )
          }
        }
      },
      {
        headerName: "Nombre",
        field: "name",
        filter: true,
        width: 240,
        cellRendererFramework: params => {
          return (
            <div
              className="d-flex align-items-center cursor-pointer"
            >
              {/* <img
                className="rounded-circle mr-50"
                src={params.data.avatar}
                alt="user avatar"
                height="30"
                width="30"
              /> */}
              <span>{params.data.name}</span>
            </div>
          )
        }
      },
      {
        headerName: "Identificador",
        field: "identifier",
        filter: true,
        width: 175
      },

      {
        headerName: "Jerarquía",
        // field: "name",
        filter: false,
        width: 474,
        cellRendererFramework: params => {
          return (
            <div
              className="d-flex align-items-center cursor-pointer"
            >
              {/* <img
                className="rounded-circle mr-50"
                src={params.data.avatar}
                alt="user avatar"
                height="30"
                width="30"
              /> */}
              <span>{
                this.getFullHierarchy(params.data.hierarchy)
              }</span>
            </div>
          )
        }
      },
      // {
      //   headerName: "Marca",
      //   field: "brand",
      //   filter: true,
      //   width: 250
      // }
    ]
  }

  getFullHierarchy = (id) => {
    let fullHierarchy = ""
    // console.log(this.state.hierarchyMap)
    while (this.state.hierarchyMap.hasOwnProperty(id)) {
      const tmp = this.state.hierarchyMap[id]
      fullHierarchy = `/${tmp.name}` + fullHierarchy
      id = tmp.parent?.id
    }
    if (fullHierarchy === "") return "N/A"
    return fullHierarchy
  }


  async getCompanyMachines(companyId) {
    if (!companyId) {
      this.setState({ rowData: [] })
      return
    }
    try {
      const res = await axios.get(GET_MACHINES_ENDPOINT, {
        params: { company_id: companyId }
      })
      const rowData = [...res.data]
      this.setState({ rowData })
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

  async getCompanyHierarchies(company_id) {
    if (!company_id) {
      this.setState({ hierarchies: [] })
      return
    }

    try {
      const res = await axios.get(GET_HIERARCHIES_ENDPOINT, {
        params: { company_id }
      })
      const hierarchyMap = {}
      res.data.forEach((hierarchy) => {
        hierarchyMap[hierarchy.id] = hierarchy
      })


      this.setState({
        hierarchies: [...res.data],
        hierarchyMap
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

  deleteMachine = async () => {
    this.setState({ show: false })
    if (!this.state.id) {
      return
    }

    try {
      const res = await axios.delete(`${DELETE_MACHINE_ENDPOINT}${this.state.id}/`)
      const alertData = {
        title: "Máquina Borrada Exitosamente",
        success: true,
        show: true,
        alertText: `Se Ha Borrado ${this.state.name} De La Lista de Máquinas.`
      }
      // history.push("/app/companies/list")
      const rowData = this.state.rowDate.filter((row) => row.id !== this.state.id)
      this.setState({
        rowData,
        id: 0,
        name: ""
      })

      this.props.displayAlert(alertData)
    } catch (e) {
      const alertData = {
        title: "Error Al Borrar Máquina",
        success: false,
        show: true,
        alertText: "Ha Surgido Un Error Al Intentar Borrar Esta Máquina."
      }
      this.props.displayAlert(alertData)
    }
  }

  async componentDidMount() {
    setTimeout(async () => {
      this.setState({
        company: this.props.auth.company ?? 0,
        // companyName: this.props.auth.company?.name ?? "Seleccione una opción",
      })
      await this.getCompanyHierarchies(this.props.auth.company ?? 0)
      this.getCompanyMachines(this.props.auth.company ?? 0);
    }, 700)

    if (this.props.auth.user_type === "client") {
      try {
        const res = await axios.get(`${GET_COMPANIES_ENDPOINT}${this.props.auth.company}`);
        const title = res.data.name
        this.setState({
          title,
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
      return
    }


    try {
      const res = await axios.get(GET_COMPANIES_ENDPOINT)
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

        <div className="content-header row">
          <div className="content-header-left col-md-9 col-12 mb-2">
            <div className="row breadcrumbs-top">
              <div className="col-12">
                <h2 className="content-header-title float-left mb-0">
                  {this.state.title}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <Row className="app-user-list">
          {this.props.auth.user_type !== "client" && <Col sm="12">
            <Card
              className={classnames("card-action card-reload", {
                "d-none": this.state.isVisible === false,
                "card-collapsed": this.state.status === "Closed",
                closing: this.state.status === "Closing...",
                opening: this.state.status === "Opening...",
                refreshing: this.state.reload
              })}
            >
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
                <div className="actions">
                  <ChevronDown
                    className="collapse-icon mr-50"
                    size={15}
                    onClick={this.toggleCollapse}
                  />
                  <RotateCw
                    className="mr-50"
                    size={15}
                    onClick={() => {
                      this.refreshCard()
                      this.componentDidMount()
                      this.gridApi.setFilterModel(null)
                    }}
                  />
                </div>
              </CardHeader>
              <Collapse
                isOpen={this.state.collapse}
                onExited={this.onExited}
                onEntered={this.onEntered}
                onExiting={this.onExiting}
                onEntering={this.onEntering}
              >
                <CardBody>
                  {this.state.reload ? (
                    <Spinner color="primary" className="reload-spinner" />
                  ) : (
                    ""
                  )}
                  <Row>
                    <Col lg="5" md="6" sm="12">
                      <FormGroup className="mb-0">
                        <Label for="company">Empresa</Label>
                        <Input
                          type="select"
                          name="company"
                          id="company"
                          value={this.state.companyName}
                          onChange={async e => {
                            const idx = e.target.selectedIndex;
                            const companyId = parseInt(e.target.childNodes[idx].getAttribute('companyid'));
                            this.setState(
                              {
                                companyName: e.target.value,
                                company: companyId,
                                buttonDisabled: !companyId || this.props.auth.company === companyId
                              }
                            )
                            await this.getCompanyHierarchies(companyId)
                            this.getCompanyMachines(companyId)
                          }}
                        >
                          {
                            this.state.companies.map((company) => (
                              <option companyid={company.id} key={company.id}>{company.name}</option>
                            ))
                          }
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col lg="7" md="6" sm="12" >
                      <Row>
                        <FormGroup className="mb-0 mr-1 ml-1">
                          <Button.Ripple
                            color="primary"
                            disabled={this.state.buttonDisabled}
                            style={{ marginTop: 19 }}
                            onClick={() => {
                              this.props.updateProfile({ company: this.state.company }, this.props.auth.id)
                              const companyName = this.state.companyName
                              this.setState({
                                title: companyName,
                                buttonDisabled: true
                              })
                            }}

                          >
                            Asignar Esta Empresa Por Defecto
                          </Button.Ripple>
                        </FormGroup>

                        <FormGroup className="mb-0 ml-1 mr-1">
                          <Button.Ripple
                            color="primary"
                            style={{ marginTop: 19 }}
                            onClick={
                              () => {
                                console.log(this.state.company)
                                if (this.state.company) {
                                  this.props.setCompany(this.state.companiesMap[this.state.company])
                                  history.push("/app/measurements/add")
                                }
                              }}
                          >
                            Agregar Mediciones
                          </Button.Ripple>
                        </FormGroup>


                      </Row>
                    </Col>

                  </Row>
                </CardBody>
              </Collapse>
            </Card>
          </Col>}
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
        {
          this.props.auth.user_type === "admin" &&
          <SweetAlert
            warning
            title="¿Estas Seguro Que Deseas Borrar Este Elemento?"
            showCancel
            show={this.state.show}
            cancelBtnText="Cancelar"
            confirmBtnText="Borrar Máquina"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="primary"
            onConfirm={this.deleteMachine}
            onCancel={() => this.setState({ show: false })}
          >
            <p className="sweet-alert-text">
              Todas Mediciones Serán Borradas Junto Con Esta Máquina.
            </p>
          </SweetAlert>
        }
      </React.Fragment >
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps, { setMachine, setCompany, displayAlert, updateProfile, setFullHierarchy })(MachineList)

