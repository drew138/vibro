import React from "react";
import { history } from "../../../../history"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {ChevronDown} from "react-feather"
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
} from "reactstrap"
import { connect } from "react-redux"
import { displayAlert } from "../../../../redux/actions/alerts"
import axios from "axios"
import { GET_MACHINES_ENDPOINT } from "../../../../config"

const columnDefs = [
    {
      headerName: "ID",
      field: "id",
      width: 150,
      filter: true,
      // checkboxSelection: true,
      // headerCheckboxSelectionFilteredOnly: true,
      // headerCheckboxSelection: true
    },
    {
      headerName: "Nombre",
      field: "name",
      filter: true,
      width: 250,
      cellRendererFramework: params => {
        return (
          <div
            className="d-flex align-items-center cursor-pointer"
            onClick={() => history.push("/app/user/edit")}
          >
            <img
              className="rounded-circle mr-50"
              src={params.data.avatar}
              alt="user avatar"
              height="30"
              width="30"
            />
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


  class ListMachines extends React.Component {
    state = {
      rowData: null,
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
      columnDefs: columnDefs
    }
  
    async componentDidMount() {
      try {
        const res = await axios.get(GET_MACHINES_ENDPOINT, {
        headers: { 'Authorization': `Bearer ${this.props.auth.tokens.access}` }})
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
      auth: state.auth
    }
  }
  export default connect(mapStateToProps, { displayAlert })(ListMachines)
  