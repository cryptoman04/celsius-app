import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
import CelText from "../../atoms/CelText/CelText";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import CelInput from "../../atoms/CelInput/CelInput";
import CelButton from "../../atoms/CelButton/CelButton";
import apiUtil from "../../../utils/api-util";
import API from "../../../constants/API";

@connect(
  state => ({
    formData: state.forms.formData,
    callsInProgress: state.api.callsInProgress,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class ForgotPassword extends Component {
  static propTypes = {};
  static defaultProps = {};

  static navigationOptions = () => ({
    title: "Forgot Password",
  });

  render() {
    const { formData, actions, callsInProgress } = this.props;
    const loading = apiUtil.areCallsInProgress(
      [API.SEND_RESET_LINK],
      callsInProgress
    );
    return (
      <RegularLayout fabType="hide">
        <CelText margin="0 0 20 15">
          Enter your email to change your password
        </CelText>

        <CelInput
          type="text"
          keyboardType="email-address"
          autoCapitalize="none"
          field="email"
          placeholder="E-mail"
          value={formData.email}
        />

        <CelButton
          margin="10 0 40 0"
          iconRight="IconArrowRight"
          onPress={() => {
            actions.sendResetLink();
          }}
          loading={loading}
        >
          Send reset link
        </CelButton>
      </RegularLayout>
    );
  }
}

export default ForgotPassword;
