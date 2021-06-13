import React from "react";
import { history } from "../../../../history"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import { ChevronDown } from "react-feather"
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button
} from "reactstrap"
import { connect } from "react-redux"
import { displayAlert } from "../../../../redux/actions/alerts"
import { setMachine } from "../../../../redux/actions/machine"
import axios from "axios"
import { GET_MACHINES_ENDPOINT } from "../../../../config"
import { Edit, FilePlus } from "react-feather"


class ListMachines extends React.Component {
  state = {
    rowData: [],
    pageSize: 20,
    isVisible: true,
    reload: false,
    collapse: true,
    status: "Opened",
    role: "All",
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
              className="d-flex align-items-center justify-content-around cursor-pointer"
            >
              <span>
                <Edit className="ml-1 mr-1"
                  onClick={
                    () => {
                      this.props.setMachine(params.data)
                      history.push("/app/machine/edit")
                    }
                  } />
                <FilePlus className="mr-1" onClick={
                  () => {
                    this.props.setMachine(params.data)
                    history.push("/app/machine/measurements")
                  }
                } /> {/* TODO add functionality 
                to create a new measurements */}

              </span>
            </div>
          )
        }
      },
      {
        headerName: "ID",
        field: "identifier",
        width: 150,
        filter: true,
      },
      {
        headerName: "Nombre",
        field: "name",
        filter: true,
        width: 250,
        cellRendererFramework: params => {
          return (
            <div
              className="d-flex align-items-center justify-content-around cursor-pointer"
            >
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
      },
      // {
      //   headerName: "Marca",
      //   field: "brand",
      //   filter: true,
      //   width: 250
      // }
    ]

  }

  async componentDidMount() {
    if (!this.props.company.id) {
      return
    }
    try {
      const res = await axios.get(GET_MACHINES_ENDPOINT, {
        params: {
          company_id: this.props.company.id,
        }
      })
      this.setState({ rowData: res.data })
    } catch (e) {
      console.log(e)
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

  // refreshRows = async () => {
  //   if (!this.props.company.id) {
  //     return
  //   }
  //   try {
  //     const res = await axios.get(GET_MACHINES_ENDPOINT, {
  //       params: {
  //         company_id: this.props.company.id,
  //       }
  //     })
  //     this.setState({ rowData: res.data })
  //   } catch (e) {
  //     console.log(e)
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

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
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

  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state
    return (
      <React.Fragment>
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
                        placeholder="Buscar..."
                        onChange={e => this.updateSearchQuery(e.target.value)}
                        value={this.state.searchVal}
                      />
                      {/* <div className="mr-1 mb-1 mb-sm-0">
                        <Button.Ripple outline color="info" onClick={this.refreshRows}>Refrescar</Button.Ripple>
                      </div> */}
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
    company: state.company
  }
}
export default connect(mapStateToProps, { setMachine, displayAlert })(ListMachines)
