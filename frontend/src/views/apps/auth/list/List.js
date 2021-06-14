import React from "react"
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
  // Spinner
} from "reactstrap"
import axios from "axios"
import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  ChevronDown,
  // RotateCw,
  // X
} from "react-feather"
// import classnames from "classnames"
import { history } from "../../../../history"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import { GET_USERS_ENDPOINT } from '../../../../config'
import { connect } from "react-redux"
import { setUser } from "../../../../redux/actions/users"
import { displayAlert } from "../../../../redux/actions/alerts"
import { Edit } from "react-feather";


const UserTypes = {
  'admin': "Administrador",
  'engineer': "Ingeniero",
  'client': "Cliente",
  'support': "Soporte",
  'arduino': "Arduino",
}

class UsersList extends React.Component {
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
    columnDefs: [
      {
        width: 100,
        cellRendererFramework: params => {
          return (
            <div
              className="d-flex align-items-center cursor-pointer"
            >
              <span>
                <Edit className="ml-1 mr-1"
                  onClick={() => {
                    this.props.setUser(params.data)
                    history.push("/app/user/list/edit")
                  }}
                // onClick={
                //   () => {
                //     this.props.setMachine(params.data)
                //     history.push("/app/machine/edit")
                //   }
                />
              </span>
            </div>
          )
        }
      },
      {
        headerName: "Nombre",
        field: "first_name",
        filter: true,
        width: 200
      },
      {
        headerName: "Apellido",
        field: "last_name",
        filter: true,
        width: 200
      },
      {
        headerName: "Usuario",
        field: "username",
        filter: true,
        width: 250,
        cellRendererFramework: params => {
          return (
            <div
              className="d-flex align-items-center cursor-pointer"
            // onClick={() => {
            //   this.props.setUser(params.data)
            //   history.push("/app/user/list/edit")
            // }}
            >
              <img
                className="rounded-circle mr-50"
                src={params.data.picture}
                alt="user avatar"
                height="30"
                width="30"
              />
              <span>{params.data.username}</span>
            </div>
          )
        }
      },
      {
        headerName: "Email",
        field: "email",
        filter: true,
        width: 250
      },
      {
        headerName: "Tipo",
        field: "user_type",
        filter: true,
        width: 150,
        cellRendererFramework: params => (
          <span>{UserTypes[params.data.user_type]}</span>
        )
      },
      {
        headerName: "Estado",
        field: "is_active",
        filter: false,
        width: 150,
        cellRendererFramework: params => {
          return params.data.is_active ? (
            <div className="badge badge-pill badge-light-success">
              {"Activo"}
            </div>
          ) : (
            <div className="badge badge-pill badge-light-warning">
              {"Inactivo"}
            </div>
          )
        }
      },
      {
        headerName: "Empresa",
        field: "is_active",
        filter: true,
        width: 150,
        cellRendererFramework: params => {
          return (
            <div className="d-flex align-items-center cursor-pointer">
              {
                params.data.user_type === "client" ?
                  params.data.company?.name ?? "No Asignada" : "N/A"
              }
            </div>
          )
        }
      }
    ]
  }

  async componentDidMount() {
    try {
      const res = await axios.get(GET_USERS_ENDPOINT)
      // console.log(res.data)
      this.setState({ rowData: res.data })
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
        <Breadcrumbs
          breadCrumbTitle="Lista de Usuarios"
          breadCrumbParent="Usuarios"
          breadCrumbActive="Lista"
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
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    // user: state.user
  }
}

export default connect(mapStateToProps, { setUser, displayAlert })(UsersList)
