import React from 'react'
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
import axios from "axios"
import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
    ChevronDown,
    RotateCw,
    X
} from "react-feather"
import classnames from "classnames"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import { connect } from "react-redux"
import { displayAlert } from "../../../../redux/actions/alerts"
import { history } from "../../../../history"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import { GET_HIERARCHIES_ENDPOINT, GET_COMPANIES_ENDPOINT } from '../../../../config'
import { setCompany } from "../../../../redux/actions/company"
import { setHierarchy } from "../../../../redux/actions/hierarchy"
// import { requestInterceptor, responseInterceptor } from "../../../../axios/axiosInstance"

class HierarchiesList extends React.Component {
    // agregar filtro por empresa
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
        // companiesMap: {},
        companyName: "Seleccione una opción",
        company: 0,
        columnDefs: [
            {
                headerName: "Nombre",
                field: "name",
                filter: true,
                width: 300,
                cellRendererFramework: params => {
                    return (
                        <div
                            className="d-flex align-items-center cursor-pointer"
                            onClick={() => {
                                this.props.setCompany(params.data.company)
                                const hierarchy = { ...params.data }
                                hierarchy.company = hierarchy.company.id
                                hierarchy.parentName = hierarchy.parent?.name
                                this.props.setHierarchy(hierarchy)
                                history.push("/app/companies/hierarchy/edit")
                            }}>
                            <span>{params.data.name}</span>
                        </div>
                    )
                }
            },
            {
                headerName: "Empresa",
                field: "company",
                filter: true,
                width: 300,
                cellRendererFramework: params => {
                    return (
                        <div className="d-flex align-items-center cursor-pointer">
                            <span>{params.data.company.name}</span>
                        </div>
                    )
                }
            },
            {
                headerName: "Padre",
                field: "parent",
                filter: true,
                width: 300,
                cellRendererFramework: params => {
                    return (
                        <div className="d-flex align-items-center cursor-pointer">
                            <span>{params.data.parent?.name ?? "N/A"}</span>
                        </div>
                    )
                }
            }
        ]
    }

    async getCompanyHierarchies(company_id) {
        if (!company_id) {
            this.setState({ rowData: [] })
            return
        }

        try {
            const res = await axios.get(GET_HIERARCHIES_ENDPOINT, {
                params: { company_id }
            })
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


    onGridReady = params => {
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
    }

    async componentDidMount() {
        try {
            const res = await axios.get(GET_COMPANIES_ENDPOINT)
            // const companiesMap = {};
            // res.data.forEach(
            //     comp => {
            //         companiesMap[comp.id] = comp
            //     }
            // );
            this.setState({
                companies: [{ id: 0, name: "Seleccione una opción" }, ...res.data],
                // companiesMap
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
                    breadCrumbTitle="Lista de Jerarquías"
                    breadCrumbParent="Empresas"
                    breadCrumbActive="Lista de Jerarquías"
                />

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
                                                        this.getCompanyHierarchies(companyId)
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

export default connect(mapStateToProps, { setHierarchy, setCompany, displayAlert })(HierarchiesList)