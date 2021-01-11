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
  // Table
} from "reactstrap"
// import userImg from "../../../../assets/img/portrait/small/avatar-s-18.jpg"
// import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
// import { Check, Lock } from "react-feather"
import { connect } from "react-redux"
import { updateProfile } from "../../../../redux/actions/auth/updateActions"


class UserAccountTab extends React.Component {

  constructor(props) {
    super(props)
    this.imageInputRef = React.createRef();
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
  }

  state = {
    id: this.props.auth.login.values.id,
    first_name: this.props.auth.login.values.first_name,
    last_name: this.props.auth.login.values.last_name,
    email: this.props.auth.login.values.email,
    phone: this.props.auth.login.values.phone,
    celphone: this.props.auth.login.values.celphone,
    selectedFile: null,
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.updateProfile(this.state, this.props.auth.login.tokens.access)
    
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
                  this.props.auth.login.values.picture
                }
                alt="user profile image"
                height="84"
                width="84"
              />
            </Media>
            <Media className="mt-2" body>
              <Media className="font-medium-1 text-bold-600" tag="p" heading>
                {`${this.toTitleCase(this.props.auth.login.values.first_name)} 
                ${this.toTitleCase(this.props.auth.login.values.last_name)}`}
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
                  <Label for="celphone">Celular</Label>
                  <Input
                    type="text"
                    id="celphone"
                    placeholder="Celular"
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
            
          </Form>
        </Col>
      </Row>

    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, { updateProfile })(UserAccountTab)
