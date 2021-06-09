import React from "react";
import {
    Row,
    Col,
    Button,
    Form,
    Input,
    Label,
    FormGroup
} from "reactstrap"
import { connect } from "react-redux"
import { createCompany } from "../../../../redux/actions/company"
// import isValidAddress from "../../../../validators/address"
// import isValidPhone from "../../../../validators/phone"
// import isValidNit from "../../../../validators/nit"
import { displayAlert } from "../../../../redux/actions/alerts"
import { CREATE_HIERARCHY_ENDPOINT, GET_COMPANIES_ENDPOINT, GET_HIERARCHIES_ENDPOINT } from "../../../../config"
import axios from "axios"
// import { requestInterceptor, responseInterceptor } from "../../../../axios/axiosInstance"

class Hierarchy extends React.Component {

    state = {
        name: "",
        parent: 0,
        parentName: "N/A",
        parents: [{ id: 0, name: "N/A" }],
        company: 0,
        companyName: "N/A",
        companies: [{ id: 0, name: "N/A" }]
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const alertData = {
            title: "Error de Validación",
            success: false,
            show: true,
            alertText: ""
        }
        const { parent, name, company } = this.state
        const body = { name, company }
        if (parent) {
            body.parent = parent;
        }
        if (!company) {
            alertData.alertText = "La Jerarquía Ingresada Debe Ser Asignada A Una Empresa"
            this.props.displayAlert(alertData)
            return
        }
        if (!name) {
            alertData.alertText = "La Jerarquía Ingresada Debe Contener Un Nombre Valido"
            this.props.displayAlert(alertData)
            return
        }

        const res = await axios.post(CREATE_HIERARCHY_ENDPOINT, body)
        alertData.alertText = "Jerarquía Creada Exitosamente"
        alertData.success = true
        this.props.displayAlert(alertData)
    }

    toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    async getParents(companyId) {
        if (!companyId) {
            return
        }
        try {
            const res = await axios.get(GET_HIERARCHIES_ENDPOINT, {
                params: {
                    company_id: companyId
                }
            })
            this.setState({ parents: [{ id: 0, name: "N/A" }, ...res.data] })
        } catch (e) {
            console.log(e);
            const alertData = {
                title: "Error de Conexión",
                success: false,
                show: true,
                alertText: "Error al Conectar al Servidor"
            }
            this.props.displayAlert(alertData)
        }
    }

    async componentDidMount() {
        try {
            const res = await axios.get(GET_COMPANIES_ENDPOINT)
            this.setState({ companies: [{ id: 0, name: "N/A" }, ...res.data] })
        } catch (e) {
            console.log(e);
            const alertData = {
                title: "Error de Conexión",
                success: false,
                show: true,
                alertText: "Error al Conectar al Servidor"
            }
            this.props.displayAlert(alertData)
        }
    }

    render() {
        return (
            <Row>
                <Col sm="12">
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col md="6" sm="12">
                                <FormGroup>
                                    <Label for="name-hierarchy">Nombre</Label>
                                    <Input
                                        type="text"
                                        id="name-hierarchy"
                                        placeholder="Nombre"
                                        value={this.state.name}
                                        onChange={e => this.setState({ name: e.target.value })}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6" sm="12">
                                <FormGroup>
                                    <Label for="nit">Padre</Label>
                                    <Input
                                        type="select"
                                        id="parent-hierarchy"
                                        value={this.state.parentName}
                                        onChange={e => {
                                            const idx = e.target.selectedIndex;
                                            const parentId = parseInt(e.target.childNodes[idx].getAttribute('parentid'));
                                            this.setState({ parentName: e.target.value, parent: parentId });
                                        }}>
                                        {
                                            this.state.parents.map((parent) => (

                                                <option parentid={parent.id} key={parent.id}>{parent.name}</option>
                                            ))
                                        }
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="6" sm="12">
                                <FormGroup>
                                    <Label for="company-hierarchy">Empresa</Label>
                                    <Input
                                        type="select"
                                        id="company-hierarchy"
                                        value={this.state.companyName}
                                        onChange={e => {
                                            const idx = e.target.selectedIndex;
                                            const companyId = parseInt(e.target.childNodes[idx].getAttribute('companyid'));
                                            this.setState({ company: companyId, companyName: e.target.value });
                                            this.getParents(companyId);
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
                            <Col
                                className="d-flex justify-content-end flex-wrap mt-2"
                                sm="12"
                            >
                                <Button.Ripple className="mr-1" color="primary">
                                    Agregar Jerarquía
                                </Button.Ripple>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row >
        )
    }
}

const mapStateToProps = state => {
    return {
        users: state.users,
        auth: state.auth
    }
}

export default connect(mapStateToProps, { createCompany, displayAlert })(Hierarchy) // tODO change redux actions
