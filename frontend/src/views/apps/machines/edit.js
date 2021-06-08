
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
    FormGroup
} from "reactstrap"
import { connect } from "react-redux"
// import { createMachine } from "../../../redux/actions/machine"
// import isValidCelphone from "../../../validators/celphone"
// import isValidPhone from "../../../validators/phone"
// import { displayAlert } from "../../../redux/actions/alerts"
import { GET_HIERARCHIES_ENDPOINT } from "../../../config"
import axios from "axios"
import { CustomInput } from "reactstrap"
import Breadcrumbs from "../../../components/@vuexy/breadCrumbs/BreadCrumb"

import img1 from "../../../assets/img/pages/content-img-1.jpg"

class EditMachine extends React.Component {

    constructor(props) {
        super(props)
        this.imageInputRef = React.createRef();
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
    }

    state = {
        // id: 0,
        identifier: "",
        name: "",
        code: "",
        electric_feed: "",
        brand: "",
        power: "",
        power_units: "KW",
        norm: "",
        company: this.props.company.id ?? 0,
        hierarchyName: "Seleccione una opción",
        hierarchy: 0,
        rpm: "",
        image: "",
        diagram: "",
        hierarchies: [{ id: 0, name: "Seleccione una opción" }]
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
        this.props.createMachine(machine)

    }

    fileSelectedHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    fileUploadHandler = () => {
        this.imageInputRef.current.click()
    }

    removePicture = () => {
        this.imageInputRef.current.value = null
        this.setState({
            selectedFile: null
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

    async componentDidMount() {
        if (!this.state.company) {
            return
        }
        try {
            const res = await axios.get(GET_HIERARCHIES_ENDPOINT);

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
                                                            value={this.state.hierarchy}
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


                                                <Col md="6" sm="12">
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
                                                </Col>




                                                <Col
                                                    className="d-flex justify-content-end flex-wrap mt-2"
                                                    sm="12"
                                                >
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

export default connect(mapStateToProps, {})(EditMachine)