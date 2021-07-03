import React from "react";
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
} from "reactstrap";
import { connect } from "react-redux";
import companyImg from "../../../../assets/img/company/default.png";
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb";
import axios from "axios";
import { GET_COMPANIES_ENDPOINT } from "../../../../config";
import { setCompany } from "../../../../redux/actions/company";
import { displayAlert } from "../../../../redux/actions/alerts"

class CompanyView extends React.Component {


	async componentDidMount() {
		try {
			console.log("here")
			const res = await axios.get(`${GET_COMPANIES_ENDPOINT}${this.props.auth.company}/`);
			this.props.setCompany({ ...res.data });
		} catch (e) {
			console.log(e.response.data)
			const alertData = {
				title: "Error de Validación",
				success: false,
				show: true,
				// alertText: Object.entries(e.response.data)[0][1]
			}
			this.props.displayAlert(alertData)
		}
	}

	render() {
		return (

			<React.Fragment>
				<Breadcrumbs
					breadCrumbTitle="Editar Máquinas"
					breadCrumbParent="Lista de Máquinas"
					breadCrumbParent2={`${this.props.machine.name} (ID: ${this.props.machine.identifier})`}
					breadCrumbActive="Editar Máquina"
				/>


				<Row>
					<Col lg="12" md="6" sm="12">
						<Card>
							<CardHeader className="mx-auto flex-column">
								<h1>{this.props.company.name !== "" ? this.props.company.name : "N/A"}</h1>
							</CardHeader>
							<CardBody className="text-center pt-0">
								<div className="avatar mr-1 avatar-xl mt-1 mb-1">
									<img src={this.props.company.picture !== "" ? this.props.company.picture : companyImg} alt="avatarImg" />
								</div>
								<div className="uploads mt-1 mb-1">
									<span>Ciudad</span>
									<p className="font-weight-bold font-medium-2 mb-0">{this.props.company.city !== "" ? this.props.company?.city : "N/A"}</p>
								</div>
								<div className="followers mt-1 mb-1">
									<span>Dirección</span>
									<p className="font-weight-bold font-medium-2 mb-0">{this.props.company.address !== "" ? this.props.company.address : "N/A"}</p>
								</div>
								<div className="uploads mt-1 mb-1">
									<span>Telefono</span>
									<p className="font-weight-bold font-medium-2 mb-0">{this.props.company.phone !== "" ? this.props.company.phone : "N/A"}</p>
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
		company: state.company,
		machine: state.machine
	}
}

export default connect(mapStateToProps, { setCompany, displayAlert })(CompanyView);