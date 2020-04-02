import React, { Component } from "react";
import { View, TouchableOpacity, Clipboard, BackHandler } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationEvents } from "react-navigation";

import * as appActions from "../../../redux/actions";
import VerifyProfileStyle from "./VerifyProfile.styles";
import CelText from "../../atoms/CelText/CelText";
import CelNumpad from "../../molecules/CelNumpad/CelNumpad";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import { KEYPAD_PURPOSES } from "../../../constants/UI";
import HiddenField from "../../atoms/HiddenField/HiddenField";
import Spinner from "../../atoms/Spinner/Spinner";
import CelButton from "../../atoms/CelButton/CelButton";
import ContactSupport from "../../atoms/ContactSupport/ContactSupport";
import store from "../../../redux/store";

@connect(
  state => ({
    formData: state.forms.formData,
    is2FAEnabled: state.user.profile.two_factor_enabled,
    previousScreen: state.nav.previousScreen,
    activeScreen: state.nav.activeScreen,
    theme: state.user.appSettings.theme,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class VerifyProfile extends Component {
  static propTypes = {};
  static defaultProps = {};

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerSameColor: true,
      hideBack: !!(params && (params.show || params.hideBack)) || false,
      right: navigation.getParam("showLogOutBtn", false) && "logout",
      gesturesEnabled: false,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      loading: false,
      verificationError: false,
      forgotPin: false,
      showLogOutBtn: false,
    };
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentDidMount = () => {
    const { navigation, actions } = this.props;
    const activeScreen = navigation.getParam("activeScreen");
    // actions.logoutUser()
    actions.getPreviousPinScreen(activeScreen);

    if (activeScreen) this.props.navigation.setParams({ hideBack: true });
  };

  componentWillUpdate(nextProps) {
    const { activeScreen } = this.props;

    if (
      activeScreen !== nextProps.activeScreen &&
      nextProps.activeScreen === "VerifyProfile"
    ) {
      this.setState({ value: "" });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  openKeypad = () => {
    const { actions } = this.props;
    actions.toggleKeypad(true);
  };

  onCheckSuccess = async () => {
    this.setState({ loading: true });
    const { navigation, actions, previousScreen } = this.props;
    const onSuccess = navigation.getParam("onSuccess");
    const activeScreen = navigation.getParam("activeScreen");
    if (activeScreen) {
      if (activeScreen === "VerifyProfile") {
        this.setState({ loading: false });
        actions.resetToScreen(previousScreen);
        return;
      }

      actions.navigateTo(activeScreen);
      this.setState({ loading: false });
      return;
    }

    if (navigation.getParam("show", null)) {
      await actions.showVerifyScreen(false);
      await actions.initAppData();
    }

    this.setState({ loading: false });
    onSuccess();
  };

  onCheckError = () => {
    this.setState({ loading: false, value: "", verificationError: true });
    this.setForgotPin();
    const timeout = setTimeout(() => {
      this.setState({ verificationError: false });
      clearTimeout(timeout);
    }, 1000);
  };

  setForgotPin = () => {
    const { verificationError } = this.state;
    if (verificationError) {
      this.setState({ forgotPin: true });
    }
  };

  getVerifyType = showType => showType && showType === "2FA";

  handleBackButtonClick = () => true;

  handlePINChange = newValue => {
    const { actions } = this.props;

    if (newValue.length > 4) return;

    actions.updateFormField("pin", newValue);
    this.setState({ value: newValue });

    if (newValue.length === 4) {
      this.setState({ loading: true });
      actions.checkPIN(this.onCheckSuccess, this.onCheckError);
    }
  };

  handle2FAChange = newValue => {
    const { actions } = this.props;

    if (newValue.length > 6) return;

    actions.updateFormField("code", newValue);
    this.setState({ value: newValue });

    if (newValue.length === 6) {
      this.setState({ loading: true });
      actions.toggleKeypad();

      actions.checkTwoFactor(this.onCheckSuccess, this.onCheckError);
    }
  };

  handlePaste = async () => {
    const { actions } = this.props;
    this.setState({ loading: true });
    const code = await Clipboard.getString();

    if (code) {
      this.handle2FAChange(code);
    } else {
      actions.showMessage("warning", "Nothing to paste, please try again!");
    }
    this.setState({ loading: false });
  };

  render2FA() {
    const { loading, value, verificationError, forgotPin } = this.state;
    const { actions } = this.props;
    const style = VerifyProfileStyle();

    return (
      <View style={style.wrapper}>
        <CelText type="H1" align="center">
          Verification required
        </CelText>

        <CelText
          onPress={() => actions.logoutUser()}
          align="center"
          margin="10 0 10 0"
        >
          Please enter your 2FA code to proceed
        </CelText>

        <TouchableOpacity onPress={actions.toggleKeypad}>
          <HiddenField value={value} length={6} error={verificationError} />
        </TouchableOpacity>
        {loading ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15,
            }}
          >
            <Spinner />
          </View>
        ) : (
          <CelButton style={{ marginTop: 10 }} onPress={this.handlePaste}>
            Paste
          </CelButton>
        )}
        <View>
          {forgotPin && (
            <ContactSupport copy="Forgot your code? Contact our support at app@celsius.network." />
          )}
        </View>
      </View>
    );
  }

  renderPIN() {
    const { loading, value, verificationError, forgotPin } = this.state;
    const { actions } = this.props;
    const style = VerifyProfileStyle();

    return (
      <View style={style.wrapper}>
        <CelText type="H1" align="center">
          Verification required
        </CelText>
        <CelText align="center" margin="10 0 10 0">
          Please enter your PIN to proceed
        </CelText>

        <TouchableOpacity onPress={actions.toggleKeypad}>
          <HiddenField value={value} error={verificationError} />
        </TouchableOpacity>
        <View>
          {forgotPin && (
            <ContactSupport copy="Forgot PIN? Contact our support at app@celsius.network." />
          )}
        </View>

        {loading && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15,
            }}
          >
            <Spinner />
          </View>
        )}
      </View>
    );
  }

  render() {
    const { value } = this.state;
    const { is2FAEnabled, actions, navigation } = this.props;
    const { appState } = store.getState().app;
    const hideBack = navigation.getParam("hideBack"); // CN-4644 show FAB on Verity Screen except after login and come from background

    const showType =
      this.getVerifyType(navigation.getParam("show", null)) || is2FAEnabled;
    const field = showType ? "code" : "pin";
    const onPressFunc = showType ? this.handle2FAChange : this.handlePINChange;
    const style = VerifyProfileStyle();

    return (
      <RegularLayout
        padding="0 0 0 0"
        fabType={
          hideBack || appState.match(/inactive|background/) ? "hide" : "main"
        }
      >
        <NavigationEvents onDidFocus={() => this.openKeypad()} />
        <View style={style.container}>
          {showType ? this.render2FA() : this.renderPIN()}
          <CelNumpad
            field={field}
            value={value}
            updateFormField={actions.updateFormField}
            setKeypadInput={actions.setKeypadInput}
            toggleKeypad={actions.toggleKeypad}
            onPress={onPressFunc}
            purpose={KEYPAD_PURPOSES.VERIFICATION}
          />
        </View>
      </RegularLayout>
    );
  }
}

export default VerifyProfile;
