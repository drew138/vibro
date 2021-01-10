import { RFC_2822 } from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import React from 'react'
import { connect } from "react-redux"
import { closeAlert } from "../../../redux/actions/alerts/index"


class Alert extends React.Component {

    render() {
        return (
            <React.Fragment>
                <SweetAlert
                  success={this.props.alerts.success}
                  danger={!this.props.alerts.success}
                  title={this.props.alerts.title}
                  show={this.props.alerts.show} 
                  onConfirm={this.props.closeAlert}
                    >
                  <p className="sweet-alert-text">
                    {this.props.alerts.alertText}
                  </p>
                </SweetAlert>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
      alerts: state.alerts
    }
  }


export default connect(mapStateToProps, {closeAlert})(Alert)