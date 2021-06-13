
import React from "react"
import {
    CardImg,
    Row,
    Col,
    Button,
    Form,
    Input,
    Label,
    Card,
    CardBody,
    FormGroup,
    CardHeader,
} from "reactstrap"
import { connect } from "react-redux"
// import { createMachine } from "../../../redux/actions/machine"
// import isValidCelphone from "../../../validators/celphone"
// import isValidPhone from "../../../validators/phone"
// import { displayAlert } from "../../../redux/actions/alerts"
import { GET_HIERARCHIES_ENDPOINT, DELETE_MACHINE_ENDPOINT } from "../../../config"
import axios from "axios"
// import { CustomInput } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"
import { history } from "../../../history"
import { updateMachine } from "../../../redux/actions/machine"
import SweetAlert from 'react-bootstrap-sweetalert';

class EditMachine extends React.Component {

    constructor(props) {
        super(props);
        if (!props.machine.id) {
            history.push("/app/companies/list");
        }
        this.diagramInputRef = React.createRef();
        this.imageInputRef = React.createRef();
        this.imageSelectedHandler = this.imageSelectedHandler.bind(this);
        this.diagramSelectedHandler = this.diagramSelectedHandler.bind(this);
    }

    state = {
        id: this.props.machine.id,
        identifier: this.props.machine.identifier,
        name: this.props.machine.name,
        code: this.props.machine.code,
        electric_feed: this.props.machine.electric_feed,
        brand: this.props.machine.brand,
        power: this.props.machine.power,
        power_units: this.props.machine.power_units,
        norm: this.props.machine.norm,
        company: this.props.machine.company ?? 0,
        rpm: this.props.machine.rpm,
        image: undefined,
        diagram: undefined,
        hierarchyName: "Seleccione una opción",
        hierarchy: 0,
        hierarchies: [{ id: 0, name: "Seleccione una opción" }],
        show: false
    }

    handleSubmit = e => {
        e.preventDefault()
        const alertData = {
            title: "Error de Validación",
            success: false,
            show: true,
            alertText: ""
        }
        // console.log(this.state)
        const {
            id,
            identifier,
            name,
            code,
            electric_feed,
            brand,
            power,
            power_units,
            norm,
            company,
            hierarchy,
            rpm,
            image,
            diagram
        } = this.state

        const machine = {
            identifier,
            name,
            code,
            electric_feed,
            brand,
            power,
            power_units,
            norm,
            company,
            hierarchy,
            rpm,
            image,
            diagram
        }
        if (!hierarchy) {
            delete machine["hierarchy"]
        }
        console.log(machine)
        // this.props.createMachine(machine, id)

    }

    imageSelectedHandler = (event) => {
        this.setState({
            image: event.target.files[0]
        })
        // console.log(this.state)
    }

    imageUploadHandler = () => {
        this.imageInputRef.current.click()
    }

    removeImage = () => {
        this.imageInputRef.current.value = null
        this.setState({
            image: undefined
        })
    }




    diagramSelectedHandler = (event) => {
        this.setState({
            diagram: event.target.files[0]
        })
    }

    diagramUploadHandler = () => {
        this.diagramInputRef.current.click()
    }

    removeDiagram = () => {
        this.diagramInputRef.current.value = null
        this.setState({
            diagram: undefined
        })
    }

    toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
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
            history.push("/app/companies/list")
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
        if (!this.state.company || !this.state.id) {
            return
        }
        try {
            const res = await axios.get(GET_HIERARCHIES_ENDPOINT, {
                params: {
                    company_id: this.state.company
                }
            });

            this.setState({ hierarchies: [{ id: 0, name: "Seleccione una opción" }, ...res.data] })
        } catch (e) {
            console.log(e)
        }
    }


    render() {
        return (
            <React.Fragment>
                <Breadcrumbs
                    breadCrumbTitle="Editar Máquinas"
                    breadCrumbParent="Lista Máquinas"
                    breadCrumbActive="Editar Máquina"
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
                                <div className="uploads mt-1 mb-1">
                                    <span>Ciudad</span>
                                    <p className="font-weight-bold font-medium-2 mb-0">{this.props.company?.city ?? "N/A"}</p>
                                </div>
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
                    <Col lg="6" md="6" sm="12">
                        <Card>
                            <CardBody>
                                <CardImg
                                    className="img-fluid mb-2"
                                    src={this.state.image ? URL.createObjectURL(this.state.image) : this.props.machine.image}
                                    alt="card image cap"
                                />
                                <input
                                    style={{ display: "none" }}
                                    type="file"
                                    onChange={this.imageSelectedHandler}
                                    ref={this.imageInputRef} />
                                <h3>Imagen De Máquina</h3>
                                {/* <p>By Pixinvent Creative Studio</p> */}
                                <hr className="my-1" />
                                <div className="card-btns d-flex justify-content-between mt-2">
                                    <Button.Ripple type="button" color="primary" onClick={this.imageUploadHandler}>
                                        Cambiar
                                    </Button.Ripple>
                                    <Button.Ripple color="danger" outline type="button" onClick={this.removeImage}>
                                        Quitar Foto
                                    </Button.Ripple>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="6" md="6" sm="12">
                        <Card>
                            <CardBody>
                                <CardImg
                                    className="img-fluid mb-2"
                                    src={this.state.diagram ? URL.createObjectURL(this.state.diagram) : this.props.machine.diagram}
                                    alt="card image cap"
                                />
                                <input
                                    style={{ display: "none" }}
                                    type="file"
                                    onChange={this.diagramSelectedHandler}
                                    ref={this.diagramInputRef} />
                                <h3>Diagrama Esquematico</h3>
                                {/* <p>By Pixinvent Creative Studio</p> */}
                                <hr className="my-1" />
                                <div className="card-btns d-flex justify-content-between mt-2">
                                    <Button.Ripple type="button" color="primary" onClick={this.diagramUploadHandler}>
                                        Cambiar
                                    </Button.Ripple>
                                    <Button.Ripple color="danger" type="button" outline onClick={this.removeDiagram}>
                                        Quitar Foto
                                    </Button.Ripple>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>


                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody className="pt-2">
                                <Row>
                                    <Col sm="12">
                                        <Form onSubmit={this.handleSubmit}>
                                            <Row>
                                                <Col md="6" sm="12">
                                                    <FormGroup>
                                                        <Label for="id">Identificador</Label>
                                                        <Input
                                                            type="number"
                                                            id="id"
                                                            placeholder="Identificador"
                                                            value={this.state.identifier}
                                                            onChange={e => this.setState({ identifier: e.target.value })}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6" sm="12">
                                                    <FormGroup>
                                                        <Label for="name">Nombre</Label>
                                                        <Input
                                                            type="text"
                                                            id="machine-name"
                                                            placeholder="Nombre"
                                                            value={this.state.name}
                                                            onChange={e => this.setState({ name: e.target.value })}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6" sm="12">
                                                    <FormGroup>
                                                        <Label for="code">Código</Label>
                                                        <Input
                                                            type="select"
                                                            id="code"
                                                            placeholder="Código"
                                                            value={this.state.code}
                                                            onChange={e => {
                                                                const idx = e.target.selectedIndex;
                                                                const value = e.target.childNodes[idx].getAttribute("value");
                                                                this.setState({ code: value });
                                                            }}
                                                        >
                                                            <option value="">Seleccione una opción</option>
                                                            <option value="interno">Interno</option>
                                                            <option value="sap">SAP</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6" sm="12">
                                                    <FormGroup>
                                                        <Label for="electric_feed">Alimentación Eléctrica</Label>
                                                        <Input
                                                            type="select"
                                                            id="electric_feed"
                                                            placeholder="Alimentación Eléctrica"
                                                            value={this.state.electric_feed}
                                                            onChange={e => {
                                                                const idx = e.target.selectedIndex;
                                                                const value = e.target.childNodes[idx].getAttribute("value");
                                                                this.setState({ electric_feed: value })
                                                            }}
                                                        >
                                                            <option value="">Seleccione una opción</option>
                                                            <option value="directa">Directa</option>
                                                            <option value="variador">Variador</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6" sm="12">
                                                    <FormGroup>
                                                        <Label for="power">Potencia</Label>
                                                        <Input
                                                            type="number"
                                                            id="power"
                                                            placeholder="Potencia"
                                                            value={this.state.power}
                                                            onChange={e => this.setState({ power: e.target.value })}
                                                        >
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6" sm="12">
                                                    <FormGroup>
                                                        <Label for="power_units">Unidades de Potencia</Label>
                                                        <Input
                                                            type="select"
                                                            id="power_units"
                                                            placeholder="Unidades de Potencia"
                                                            value={this.state.power_units}
                                                            onChange={e => {
                                                                const idx = e.target.selectedIndex;
                                                                const value = e.target.childNodes[idx].getAttribute("value");
                                                                this.setState({ power_units: value })
                                                            }}
                                                        >
                                                            <option value="KW">KiloWatts</option>
                                                            <option value="HP">HorsePower</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6" sm="12">
                                                    <FormGroup>
                                                        <Label for="brand">Marca</Label>
                                                        <Input
                                                            type="text"
                                                            id="brand"
                                                            placeholder="Marca"
                                                            value={this.state.brand}
                                                            onChange={e => this.setState({ brand: e.target.value })}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6" sm="12">
                                                    <FormGroup>
                                                        <Label for="norm">Norma</Label>
                                                        <Input
                                                            type="select"
                                                            id="norm"
                                                            placeholder="Norma"
                                                            value={this.state.norm}
                                                            onChange={e => this.setState({ norm: e.target.value })}
                                                        >
                                                            <option></option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6" sm="12">
                                                    <FormGroup>
                                                        <Label for="hierarchy">Jerarquía</Label>
                                                        <Input
                                                            type="select"
                                                            id="machine-hierarchy"
                                                            placeholder="Jerarquía"
                                                            value={this.state.hierarchyName}
                                                            onChange={e => {
                                                                const idx = e.target.selectedIndex;
                                                                const hierarchyId = parseInt(e.target.childNodes[idx].getAttribute("hierarchyid"))
                                                                this.setState({
                                                                    hierarchyName: e.target.value,
                                                                    hierarchy: hierarchyId
                                                                })
                                                            }}
                                                        >
                                                            {
                                                                this.state.hierarchies.map((hierarchy) => (
                                                                    <option hierarchyid={hierarchy.id} key={hierarchy.id}>{hierarchy.name}</option>
                                                                ))
                                                            }
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6" sm="12">
                                                    <FormGroup>
                                                        <Label for="rpm">RPM</Label>
                                                        <Input
                                                            type="text"
                                                            id="rpm"
                                                            placeholder="RPM"
                                                            value={this.state.rpm}
                                                            onChange={e => this.setState({ rpm: e.target.value })}
                                                        >
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                {/* <Col md="6" sm="12">
                                                    <FormGroup>
                                                    <Label for="customFile">Imagen</Label>
                                                        <CustomInput
                                                            type="file"
                                                            id="image"
                                                            name="Imagen"
                                                            onChange={e => {
                                                                this.setState({ image: e.target.files[0] ?? "" })
                                                            }}
                                                            />
                                                    </FormGroup>
                                                    <CardImg
                                                        top
                                                        className="img-fluid"
                                                        src={img1}
                                                        alt="card image cap"
                                                    />
                                                    </Col>
                                                    
                                                <Col md="6" sm="12">
                                                <FormGroup>
                                                        <Label for="customFile">Diagrama</Label>
                                                        <CustomInput
                                                        type="file"
                                                            id="diagram"
                                                            name="Diagrama"
                                                            mb="3"
                                                            onChange={e => {
                                                                this.setState({ diagram: e.target.files[0] ?? "" })
                                                            }}
                                                        />
                                                        </FormGroup>
                                                        <CardImg
                                                        top
                                                        className="img-fluid"
                                                        src={img1}
                                                        alt="card image cap"
                                                        />
                                                </Col> */}
                                                <Col
                                                    className="d-flex justify-content-end flex-wrap mt-2"
                                                    sm="12"
                                                >
                                                    <Button.Ripple className="mr-1" color="danger" type="button" onClick={() => this.setState({ show: true })} >
                                                        Borrar Máquina
                                                    </Button.Ripple>
                                                    <Button.Ripple className="mr-1" color="primary">
                                                        Guardar Cambios
                                                    </Button.Ripple>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Col>
                                </Row>
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
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        users: state.users,
        company: state.company,
        machine: state.machine
    }

}

export default connect(mapStateToProps, { updateMachine })(EditMachine)