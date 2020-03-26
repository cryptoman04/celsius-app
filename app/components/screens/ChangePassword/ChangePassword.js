import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import CelInput from "../../atoms/CelInput/CelInput";
import CelButton from "../../atoms/CelButton/CelButton";
import apiUtil from "../../../utils/api-util";
import API from "../../../constants/API";
import calculatePasswordScore from "../../../utils/password-util";
import CelText from "../../atoms/CelText/CelText";
import STYLES from "../../../constants/STYLES";

@connect(
  state => ({
    formData: state.forms.formData,
    callsInProgress: state.api.callsInProgress,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class ChangePassword extends Component {
  static propTypes = {
    // text: PropTypes.string
  };
  static defaultProps = {};

  static navigationOptions = () => ({
    title: "Change password",
  });

  changePassword = async () => {
    const {
      actions,
      formData: { oldPassword, newPassword },
    } = this.props;
    await actions.resetPassword(oldPassword, newPassword);
  };

  render() {
    const { formData, callsInProgress } = this.props;
    const changingPassword = apiUtil.areCallsInProgress(
      [API.RESET_PASSWORD],
      callsInProgress
    );

    return (
      <RegularLayout>
        <CelText
          align={"center"}
          margin={"0 0 30 0"}
          color={STYLES.COLORS.MEDIUM_GRAY}
          type={"H4"}
        >To change your password, please fill in the fields below:</CelText>
        <CelInput
          type="password"
          field="oldPassword"
          placeholder="Current password"
          value={formData.oldPassword}
          returnKeyType={"next"}
          blurOnSubmiting={false}
          onSubmitEditing={() => {
            this.pass.focus();
          }}
        />
        <CelInput
          type="password"
          field="newPassword"
          placeholder="New password"
          value={formData.newPassword}
          refs={input => {
            this.pass = input;
          }}
          showPasswordTooltip
          tooTipPositionTop
          showPassMeter
        />
        <CelButton
          onPress={this.changePassword}
          loading={changingPassword}
          margin={"10 0 0 0"}
          disabled={calculatePasswordScore(formData.newPassword).result.score < 80}
        >
          Change password
        </CelButton>
      </RegularLayout>
    );
  }
}

export default ChangePassword;
