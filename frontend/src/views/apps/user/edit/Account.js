import React from "react"
import {
  Media,
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  Table
} from "reactstrap"
// import userImg from "../../../../assets/img/portrait/small/avatar-s-18.jpg"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check, Lock } from "react-feather"
import { connect } from "react-redux"
import { updateProfile } from "../../../../redux/actions/auth/updateActions"
import SweetAlert from 'react-bootstrap-sweetalert';

class UserAccountTab extends React.Component {

  constructor(props) {
    super(props)
    this.imageInputRef = React.createRef();
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
  }

  state = {
    id: this.props.user.login.values.id,
    first_name: this.props.user.login.values.first_name,
    last_name: this.props.user.login.values.last_name,
    email: this.props.user.login.values.email,
    phone: this.props.user.login.values.phone,
    ext: this.props.user.login.values.ext,
    celphone: this.props.user.login.values.celphone,
    selectedFile: null,
    displayAlert: false,
    alertText: "Se ha actualizdo correctamente su información",
    success: true
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.updateProfile(this.state)
    // if (error !== undefined) {
    //   this.setState({success: false})
    //   this.setState({displayAlert: true})
    //   this.setState({alertText: error})
    // } else {
      this.setState({ 
        success: true,
        displayAlert: true,
        alertText: "Se ha actualizdo correctamente su información"
      })
      // this.setState({displayAlert: true})
      // this.setState({alertText: "Se ha actualizdo correctamente su información"})
    // }
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
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  render() {
    return (
      // https://www.youtube.com/watch?v=XeiOnkEI7XI&t=5s
      // https://youtu.be/b6Oe2puTdMQ?t=1186
      <Row>
        <Col sm="12">
          <Media className="mb-2">
            <Media className="mr-2 my-25" left>
              <Media
                className="users-avatar-shadow rounded"
                object
                src={
                  this.state.selectedFile ? URL.createObjectURL(this.state.selectedFile) :
                  this.props.user.login.values.picture
                }
                alt="user profile image"
                height="84"
                width="84"
              />
            </Media>
            <Media className="mt-2" body>
              <Media className="font-medium-1 text-bold-600" tag="p" heading>
                {`${this.toTitleCase(this.props.user.login.values.first_name)} 
                ${this.toTitleCase(this.props.user.login.values.last_name)}`}
              </Media>
              <div className="d-flex flex-wrap">
                <input 
                style={{display: "none"}} 
                type="file" 
                onChange={this.fileSelectedHandler} 
                ref={this.imageInputRef}/>
                <Button.Ripple className="mr-1" color="primary" outline
                 onClick={this.fileUploadHandler}
                 >
                  Cambiar
                </Button.Ripple>
                <Button.Ripple color="flat-danger" onClick={this.removePicture}>Quitar Foto</Button.Ripple>
              </div>
            </Media>
          </Media>
        </Col>
        <Col sm="12">
          <Form onSubmit={this.handleSubmit}>
            <Row>

              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="first_name">Nombre</Label>
                  <Input
                    type="text"
                    id="first_name"
                    placeholder="Nombre"
                    value={this.state.first_name}
                    onChange={e => this.setState({ first_name: e.target.value })}
                  />
                </FormGroup>
              </Col>
              
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="last_name">Apellido</Label>
                  <Input
                    type="text"
                    id="last_name"
                    placeholder="Apellido"
                    value={this.state.last_name}
                    onChange={e => this.setState({ last_name: e.target.value })}
                  />
                </FormGroup>
              </Col>
              
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="phone">Telefono</Label>
                  <Input
                    type="text"
                    id="phone"
                    placeholder="Telefono"
                    value={this.state.phone}
                    onChange={e => this.setState({ phone: e.target.value })}
                  />
                </FormGroup>
              </Col>
              
              
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="ext">Ext</Label>
                  <Input
                    type="text"
                    id="ext"
                    placeholder="Ext"
                    value={this.state.ext}
                    onChange={e => this.setState({ ext: e.target.value })}
                  />
                </FormGroup>
              </Col>
              
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="celphone">Celphone</Label>
                  <Input
                    type="text"
                    id="celphone"
                    placeholder="Ext"
                    value={this.state.celphone}
                    onChange={e => this.setState({ celphone: e.target.value })}
                  />
                </FormGroup>
              </Col>
              
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="text"
                    id="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={e => this.setState({ email: e.target.value })}
                  />
                </FormGroup>
              </Col>


              
              {/* <Col md="6" sm="12"> // TODO  use template for select fields
                <FormGroup>
                  <Label for="company">Empresa</Label>
                  <Input
                    type="text"
                    id="company"
                    defaultValue={this.props.user.login.values.company}
                    placeholder="Empresa"
                    // value={this.state.celphone}
                    onChange={e => this.setState({ celphone: e.target.value })}
                  >
                    <option>option1</option>
                  </Input>
                </FormGroup>
              </Col> */}

              

              {/* TODO permissions */}
              {/* <Col sm="12">
                <div className="permissions border px-2">
                  <div className="title pt-2 pb-0">
                    <Lock size={19} />
                    <span className="text-bold-500 font-medium-2 ml-50">
                      Permissions
                    </span>
                    <hr />
                  </div>
                  <Table borderless responsive>
                    <thead>
                      <tr>
                        <th>Module Permission</th>
                        <th>Read</th>
                        <th>Write</th>
                        <th>Create</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Users</td>
                        <td>
                          <Checkbox
                            color="primary"
                            icon={<Check className="vx-icon" size={16} />}
                            label=""
                            defaultChecked={true}
                          />
                        </td>
                        <td>
                          <Checkbox
                            color="primary"
                            icon={<Check className="vx-icon" size={16} />}
                            label=""
                            defaultChecked={false}
                          />
                        </td>
                        <td>
                          <Checkbox
                            color="primary"
                            icon={<Check className="vx-icon" size={16} />}
                            label=""
                            defaultChecked={false}
                          />
                        </td>
                        <td>
                          {" "}
                          <Checkbox
                            color="primary"
                            icon={<Check className="vx-icon" size={16} />}
                            label=""
                            defaultChecked={true}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Articles</td>
                        <td>
                          <Checkbox
                            color="primary"
                            icon={<Check className="vx-icon" size={16} />}
                            label=""
                            defaultChecked={false}
                          />
                        </td>
                        <td>
                          <Checkbox
                            color="primary"
                            icon={<Check className="vx-icon" size={16} />}
                            label=""
                            defaultChecked={true}
                          />
                        </td>
                        <td>
                          <Checkbox
                            color="primary"
                            icon={<Check className="vx-icon" size={16} />}
                            label=""
                            defaultChecked={false}
                          />
                        </td>
                        <td>
                          {" "}
                          <Checkbox
                            color="primary"
                            icon={<Check className="vx-icon" size={16} />}
                            label=""
                            defaultChecked={true}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Staff</td>
                        <td>
                          <Checkbox
                            color="primary"
                            icon={<Check className="vx-icon" size={16} />}
                            label=""
                            defaultChecked={true}
                          />
                        </td>
                        <td>
                          <Checkbox
                            color="primary"
                            icon={<Check className="vx-icon" size={16} />}
                            label=""
                            defaultChecked={true}
                          />
                        </td>
                        <td>
                          <Checkbox
                            color="primary"
                            icon={<Check className="vx-icon" size={16} />}
                            label=""
                            defaultChecked={false}
                          />
                        </td>
                        <td>
                          {" "}
                          <Checkbox
                            color="primary"
                            icon={<Check className="vx-icon" size={16} />}
                            label=""
                            defaultChecked={false}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col> */}
              <Col
                className="d-flex justify-content-end flex-wrap mt-2"
                sm="12"
              >
                <Button.Ripple className="mr-1" color="primary">
                  Guardar Cambios
                </Button.Ripple>
                {/* <Button.Ripple color="flat-warning">Resetear</Button.Ripple> */}
              </Col>
            </Row>
            <SweetAlert
              success={this.state.success}
              danger={!this.state.success}
              title={this.state.success ? "Éxito!" : "Error!"}
              show={this.state.displayAlert} 
              onConfirm={() => this.setState({displayAlert: false})}
                >
              <p className="sweet-alert-text">
                {this.state.alertText}
              </p>
            </SweetAlert>
          </Form>
        </Col>
      </Row>

    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth
  }
}

export default connect(mapStateToProps, { updateProfile })(UserAccountTab)
