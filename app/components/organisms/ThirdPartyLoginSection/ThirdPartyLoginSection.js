import React, { Component } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Col, Grid } from "react-native-easy-grid";
import { TWLoginButton } from "react-native-simple-twitter";
import { Constants, Facebook, GoogleSignIn } from "expo";

import * as appActions from "../../../redux/actions";
import ThirdPartyLoginSectionStyle from "./ThirdPartyLoginSection.styles";
import Icon from "../../atoms/Icon/Icon";
import testUtil from "../../../utils/test-util";
import { analyticsEvents } from "../../../utils/analytics-util";

const {
  GOOGLE_CLIENT_ID,
  FACEBOOK_APP_ID,
  FACEBOOK_URL
} = Constants.manifest.extra;

@connect(
  state => ({
    screenWidth: state.ui.dimensions.screenWidth,
    user: state.users.user
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class ThirdPartyLoginSection extends Component {
  static propTypes = {
    type: PropTypes.oneOf(["signup", "login"])
  };

  // lifecycle methods
  // event handlers
  onOpenTwitter = () => {
    const { type, actions } = this.props;
    if (type === "signup") {
      analyticsEvents.startedSignup("Twitter");
    }
    this.fakeTwitterButton.onButtonPress();
    actions.twitterOpen();
  };

  onTwitterSuccess = (twitterUser) => {
    const { user, type, actions } = this.props;

    const u = twitterUser;
    u.accessToken = user.twitter_oauth_token;
    u.secret_token = user.twitter_oauth_secret;

    if (type === "login") {
      actions.loginTwitter(u);
    } else {
      actions.twitterSuccess(u);
    }
  };

  setFakeTwitterButton = (component) => {
    this.fakeTwitterButton = component;
  };

  googleAuth = async () => {
    const { type, actions } = this.props;

    // TODO: set Google login from Expo Client
    if (Constants.appOwnership !== 'standalone') return actions.showMessage('warning', 'Google services are only available on standalone app');

    try {
      await GoogleSignIn.initAsync({
        clientId: GOOGLE_CLIENT_ID
      });
      await GoogleSignIn.askForPlayServicesAsync();
      const result = await GoogleSignIn.signInAsync();

      if (result.type === "success") {
        const user = result.user;

        user.first_name = user.firstName
        user.last_name = user.lastName
        user.google_id = user.uid
        user.profile_picture = user.photoURL

        if (type === "login") {
          actions.loginGoogle(user);
        } else {
          analyticsEvents.startedSignup("Google");
          actions.googleSuccess(user);
        }
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  facebookAuth = async () => {
    const {actions} = this.props;

    // if (true) return actions.showMessage('warning', 'Facebook services are currently down, we are sorry for the inconvenience. For any additional information contact support at app@celsius.network')

    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID.toString(), {
        permissions: ["public_profile", "email"],
        behavior: "web",
      });

      if (type === "success") {
        const response = await fetch(`${FACEBOOK_URL}${token}`);

        const user = await response.json();
        user.accessToken = token;

        if (this.props.type === "login") {
          actions.loginFacebook(user);
        } else {
          analyticsEvents.startedSignup("Facebook");
          actions.facebookSuccess(user);
        }
      }
    } catch (e) {
      actions.showMessage("error", e.message);
    }

  };

  // rendering methods
  render() {
    const { screenWidth, type, actions } = this.props;

    const iconSize = 0.2 * screenWidth;
    const action = type === "login" ? "Login with" : "Sign up with";

    return (
      <View>
        <Grid>
          <Col style={ThirdPartyLoginSectionStyle.centeredColumn}>
            <TouchableOpacity ref={testUtil.generateTestHook(this, "ThirdPartyLoginSection.faceboook")}
                              onPress={this.facebookAuth}>
              <Icon name='Facebook' width={iconSize} height={iconSize} viewBox="0 0 80 80" fill='#FFFFFF'/>
              <View style={ThirdPartyLoginSectionStyle.socialNetworkTextWrapper}>
                <Text style={ThirdPartyLoginSectionStyle.socialNetworkDescription}>{action}</Text>
                <Text style={ThirdPartyLoginSectionStyle.socialNetworkName}>Facebook</Text>
              </View>
            </TouchableOpacity>
          </Col>
          <Col style={ThirdPartyLoginSectionStyle.centeredColumn}>
            <TouchableOpacity ref={testUtil.generateTestHook(this, "ThirdPartyLoginSection.google")}
                              onPress={this.googleAuth}>
              <Icon name='Google' width={iconSize} height={iconSize} viewBox="0 0 80 80" fill='#FFFFFF'/>
              <View style={ThirdPartyLoginSectionStyle.socialNetworkTextWrapper}>
                <Text style={ThirdPartyLoginSectionStyle.socialNetworkDescription}>{action}</Text>
                <Text style={ThirdPartyLoginSectionStyle.socialNetworkName}>Google</Text>
              </View>
            </TouchableOpacity>
          </Col>
          <Col style={ThirdPartyLoginSectionStyle.centeredColumn}>
            <TouchableOpacity ref={testUtil.generateTestHook(this, "ThirdPartyLoginSection.twitter")}
                              onPress={this.onOpenTwitter}>
              <Icon name='Twitter' width={iconSize} height={iconSize} viewBox="0 0 80 80" fill='#FFFFFF'/>
              <View style={ThirdPartyLoginSectionStyle.socialNetworkTextWrapper}>
                <Text style={ThirdPartyLoginSectionStyle.socialNetworkDescription}>{action}</Text>
                <Text style={ThirdPartyLoginSectionStyle.socialNetworkName}>Twitter</Text>
              </View>
            </TouchableOpacity>
          </Col>
        </Grid>

        <TWLoginButton
          ref={this.setFakeTwitterButton}
          style={ThirdPartyLoginSectionStyle.fakeTwitterButton}
          onGetAccessToken={actions.twitterGetAccessToken}
          onSuccess={this.onTwitterSuccess}
          closeText="< Back to Celsius"
          onClose={actions.twitterClose}
          onError={this.handleError}
        />
      </View>
    );
  }
}

export default testUtil.hookComponent(ThirdPartyLoginSection);

