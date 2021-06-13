import React from 'react'
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
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import { connect } from "react-redux"
import { displayAlert } from "../../../../redux/actions/alerts"
import { history } from "../../../../history"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import { GET_COMPANIES_ENDPOINT, DELETE_COMPANY_ENDPOINT } from '../../../../config'
import { setCompany } from "../../../../redux/actions/company"
import { Edit, Trash2 } from "react-feather"

import SweetAlert from 'react-bootstrap-sweetalert';

class CompaniesList extends React.Component {

  state = {
    id: 0,
    name: "",
    show: false,
    rowData: null,
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
              className="d-flex align-items-center justify-content-around cursor-pointer"
            >
              <span>
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
        headerName: "Nombre",
        field: "name",
        filter: true,
        width: 300,
        cellRendererFramework: params => {
          return (
            <div
              className="d-flex align-items-center cursor-pointer"
            >
              <img
                className="rounded-circle mr-50"
                src={params.data.picture}
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
        headerName: "Ciudad",
        field: "city",
        filter: true,
        width: 300
      },
      {
        headerName: "Nit",
        field: "nit",
        filter: true,
        width: 300
      }
    ]
  }

  async componentDidMount() {


    try {
      const res = await axios.get(GET_COMPANIES_ENDPOINT)

      this.setState({ rowData: [...res.data] })


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

  deleteCompany = async () => {
    this.setState({ show: false })
    if (!this.state.id) {
      return
    }

    try {
      const res = await axios.delete(`${DELETE_COMPANY_ENDPOINT}${this.state.id}/`)
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
          breadCrumbTitle="Lista de Empresas"
          breadCrumbParent="Empresas"
          breadCrumbActive="Lista de Empresas"
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
          confirmBtnText="Borrar Empresa"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="primary"
          onConfirm={this.deleteCompany}
          onCancel={() => this.setState({ show: false })}
        >

          <p className="sweet-alert-text">
            Todas Las Máquinas Y Mediciones Serán Borradas Junto Con Esta Empresa.
          </p>
        </SweetAlert>}

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

export default connect(mapStateToProps, { setCompany, displayAlert })(CompaniesList)