import React from "react";
import {
    Row,
    Col,
    Button,
    Form,
    Input,
    Label,
    FormGroup,
    Card,
    CardBody,
    // CardTitle,
    CardHeader
} from "reactstrap"
import { connect } from "react-redux"
import { displayAlert } from "../../../../redux/actions/alerts"
import { DELETE_HIERARCHY_ENDPOINT, CHANGE_HIERARCHY_ENDPOINT, GET_HIERARCHIES_ENDPOINT } from "../../../../config"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import axios from "axios"
import SweetAlert from 'react-bootstrap-sweetalert';
import { history } from "../../../../history"


class Hierarchy extends React.Component {

    constructor(props) {
        super(props);
        if (!props.hierarchy.id) { // redirect if page is refreshed
            history.push("/app/companies/hierarchies")
        }
    }

    state = {
        id: this.props.hierarchy.id,
        name: this.props.hierarchy.name,
        parent: this.props.hierarchy.parent,
        parentName: this.props.hierarchy.parentName ?? "Seleccione una opción",
        parentsNames: new Set(),
        parents: [{ id: 0, name: "Seleccione una opción" }],
        show: false,
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const alertData = {
            title: "Error de Validación",
            success: false,
            show: true,
            alertText: ""
        }
        const { parent, name } = this.state
        const body = { name }
        if (parent) {
            body.parent = parent.id;
        }
        if (this.state.parentsNames.has(name)) {
            alertData.alertText = `El Nombre ${name} Ya Ha Sido Asignado A Otra Jerarquía`
            this.props.displayAlert(alertData)
            return
        }
        if (!name) {
            alertData.alertText = "La Jerarquía Ingresada Debe Contener Un Nombre Valido"
            this.props.displayAlert(alertData)
            return
        }
        try {
            // console.log(body)
            const res = await axios.patch(`${CHANGE_HIERARCHY_ENDPOINT}${this.state.id}/`, body)
            alertData.alertText = "Jerarquía Cambiada Exitosamente"
            alertData.success = true
            this.props.displayAlert(alertData)

        } catch (e) {
            // console.log(e.response.data)
            console.log(e)
        }
    }

    toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    async componentDidMount() {
        if (!this.props.company.id) {
            return
        }

        try {
            const res = await axios.get(GET_HIERARCHIES_ENDPOINT, {
                params: {
                    company_id: this.props.company.id
                }
            })
            const otherHierarchies = [...res.data.filter((hierarchy) => hierarchy.id !== this.state.id)]
            this.setState({
                parents: [{ id: 0, name: "Seleccione una opción" }, ...otherHierarchies],
                parentsNames: new Set(otherHierarchies.map((hierarchy) => hierarchy.name))
            })
        } catch (e) {
            console.log(e);
            const alertData = {
                title: "Error de Conexión",
                success: false,
                show: true,
                alertText: "Error al Conectar al Servidor"
            }
            this.props.displayAlert(alertData)
            //     console.log(e);
            //     const alertData = {
            //         title: "Error de Conexión",
            //         success: false,
            //         show: true,
            //         alertText: "Error al Conectar al Servidor"
            //     }
            //     this.props.displayAlert(alertData)
        }
    }

    deleteHierarchy = async () => {
        this.setState({ show: false })
        if (!this.state.id) {
            return
        }

        try {
            const res = await axios.delete(`${DELETE_HIERARCHY_ENDPOINT}${this.state.id}/`)
            const alertData = {
                title: "Jerarquía Borrada Exitosamente",
                success: true,
                show: true,
                alertText: `Se Ha Borrado ${this.props.hierarchy.name} De La Lista de Jerarquías.`
            }
            history.push("/app/companies/hierarchies")
            this.props.displayAlert(alertData)
        } catch (e) {
            const alertData = {
                title: "Error Al Borrar Jerarquía",
                success: false,
                show: true,
                alertText: "Ha Surgido Un Error Al Intentar Borrar Esta Jerarquía."
            }
            this.props.displayAlert(alertData)
        }
    }


    render() {
        return (
            <React.Fragment>
                <Breadcrumbs
                    breadCrumbTitle="Editar Jerarquía"
                    breadCrumbParent="Empresa"
                    breadCrumbParent2="Lista de Jerarquías"
                    breadCrumbActive="Editar Jerarquía"
                />
                <Row>
                    <Col lg="12" md="6" sm="12">
                        <Card>
                            <CardHeader className="mx-auto flex-column">
                                <h1>{this.props.company.name}</h1>
                            </CardHeader>
                            <CardBody className="text-center pt-0">
                                <div className="avatar mr-1 avatar-xl mt-1 mb-1">
                                    <img src={this.props.company.picture} alt="avatarImg" />
                                </div>
                                {/* <div className="uploads mt-1 mb-1">
                                    <span>Ciudad</span>
                                    <p className="font-weight-bold font-medium-2 mb-0">{this.props.company?.city ?? "N/A"}</p>
                                </div> */}
                                <div className="followers mt-1 mb-1">
                                    <span>Dirección</span>
                                    <p className="font-weight-bold font-medium-2 mb-0">{this.props.company.address}</p>
                                </div>
                                <div className="uploads mt-1 mb-1">
                                    <span>Telefono</span>
                                    <p className="font-weight-bold font-medium-2 mb-0">{this.props.company.phone}</p>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody className="pt-2">
                                {/* <CardTitle className="mb-3">

                                    {this.props.company.name}

                                </CardTitle> */}
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

                                                <Col
                                                    className="d-flex justify-content-end flex-wrap mt-2"
                                                    sm="12"
                                                >
                                                    <Button.Ripple className="mr-1" color="danger" type="button" onClick={() => this.setState({ show: true })} >
                                                        Borrar Jerarquía
                                                    </Button.Ripple>
                                                    <Button.Ripple className="mr-1" color="primary">
                                                        Editar Jerarquía
                                                    </Button.Ripple>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Col>
                                </Row >
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <SweetAlert
                    warning
                    title="¿Estas Seguro Que Deseas Borrar Este Elemento?"
                    showCancel
                    show={this.state.show}
                    cancelBtnText="Cancelar"
                    confirmBtnText="Borrar Jerarquía"
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="primary"
                    onConfirm={this.deleteHierarchy}
                    onCancel={() => this.setState({ show: false })}
                >

                    <p className="sweet-alert-text">
                        Esta Acción No Puede Ser Reversada.
                    </p>
                </SweetAlert>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        users: state.users,
        auth: state.auth,
        hierarchy: state.hierarchy,
        company: state.company
    }
}

export default connect(mapStateToProps, { displayAlert })(Hierarchy) // tODO change redux actions
