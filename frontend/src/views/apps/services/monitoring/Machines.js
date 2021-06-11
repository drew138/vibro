import React from "react"
import { history } from "../../../../history"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import { GET_MACHINES_ENDPOINT, GET_COMPANIES_ENDPOINT } from "../../../../config"
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
  Spinner
} from "reactstrap"
import { AgGridReact } from "ag-grid-react"
import { connect } from "react-redux"
import axios from "axios"
import {
  ChevronDown,
  RotateCw,
  X
} from "react-feather"
import classnames from "classnames"
import { ContextLayout } from "../../../../utility/context/Layout"
import { setMachine } from "../../../../redux/actions/machine"
import { setCompany } from "../../../../redux/actions/company"
import { displayAlert } from "../../../../redux/actions/alerts"


class MachineList extends React.Component {

  state = {
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
    company: 0,
    columnDefs: [
      // {
      //   headerName: "ID",
      //   field: "id",
      //   width: 150,
      //   filter: true,
      //   // checkboxSelection: true,
      //   // headerCheckboxSelectionFilteredOnly: true,
      //   // headerCheckboxSelection: true
      // },
      {
        headerName: "Nombre",
        field: "name",
        filter: true,
        width: 250,
        cellRendererFramework: params => {
          return (
            <div
              className="d-flex align-items-center cursor-pointer"
              onClick={() => {
                this.props.setCompany(this.state.companiesMap[this.state.company])
                this.props.setMachine(params.data)
                history.push("/services/monitoring/machine")
              }}
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
        headerName: "Código",
        field: "code",
        filter: true,
        width: 250
      },
      {
        headerName: "Jerarquía",
        field: "name",
        filter: true,
        width: 250
      },
      {
        headerName: "Marca",
        field: "brand",
        filter: true,
        width: 250
      }
    ]
  }

  async getCompanyMachines(companyId) {
    if (!companyId) {
      this.setState({ rowData: [] })
      return
    }
    try {
      // console.log(companyId)
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

  async componentDidMount() {
    try {
      const res = await axios.get(GET_COMPANIES_ENDPOINT)
      const companiesMap = {};
      res.data.forEach(
        comp => {
          companiesMap[comp.id] = comp
        }
      );
      this.setState({
        companies: [{ id: 0, name: "Seleccione una opción" }, ...res.data],
        companiesMap
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
    // }
    // if (this.state.companyId !== 0) {
    //   try {
    //     // TODO filter machines by ones that are being monitored
    //     const res = await axios.get(`${GET_MACHINES_ENDPOINT}${this.state.companyId}`, {
    //       headers: { 'Authorization': `Bearer ${this.props.auth.tokens.access}` }
    //     })
    //     this.setState({ rowData: res.data })
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
    // } else {
    // console.log(this.state.companies)
    // this.setState({ rowData: [] })
    // }

  }

  // async getRowData() {
  //   if (this.state.companyId !== 0) {
  //     try {
  //       // TODO filter machines by ones that are being monitored
  //       const res = await axios.get(`${GET_MACHINES_ENDPOINT}${this.state.companyId}`, {
  //         headers: { 'Authorization': `Bearer ${this.props.auth.tokens.access}` }
  //       })
  //       this.setState({ rowData: res.data })
  //     } catch {
  //       const alertData = {
  //         title: "Error de Conexión",
  //         success: false,
  //         show: true,
  //         alertText: "Error al Conectar al Servidor"
  //       }
  //       this.props.displayAlert(alertData)
  //       this.setState({ rowData: [] })
  //     }
  //   } else {
  //     this.setState({ rowData: [] })
  //   }
  // }

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

        <Row className="app-user-list">
          <Col sm="12">
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
                      this.gridApi.setFilterModel(null)
                    }}
                  />
                  <X size={15} onClick={this.removeCard} />
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
                    <Col lg="12" md="6" sm="12">
                      <FormGroup className="mb-0">
                        <Label for="role">Empresa</Label>
                        <Input
                          type="select"
                          name="company"
                          id="company"
                          value={this.state.companyName}
                          onChange={e => {
                            const idx = e.target.selectedIndex;
                            const companyId = parseInt(e.target.childNodes[idx].getAttribute('companyid'));
                            this.getCompanyMachines(companyId)
                            this.setState(
                              {
                                companyName: e.target.value,
                                company: companyId
                              }
                              // this.getRowData()
                              // () =>
                              //   this.filterData(
                              //     "company",
                              //     this.state.company.toLowerCase()
                              //   )
                            )
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
                  </Row>
                </CardBody>
              </Collapse>
            </Card>
          </Col>
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
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps, { setMachine, setCompany, displayAlert })(MachineList)

