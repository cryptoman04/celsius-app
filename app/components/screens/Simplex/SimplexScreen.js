import React, { Component } from "react";
import WebView from "react-native-webview";
import { View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as appActions from "../../../redux/actions";
import mixpanelAnalytics from "../../../utils/mixpanel-analytics";
import LoadingState from "../../atoms/LoadingState/LoadingState";
import Constants from "../../../../constants";
import store from "../../../redux/store";
import { navigateTo } from "../../../redux/nav/navActions";

// fix https://github.com/facebook/react-native/issues/10865
const patchPostMessageJsCode = `(${String(function() {
  const originalPostMessage = window.ReactNativeWebView.postMessage;
  const patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace(
      "hasOwnProperty",
      "postMessage"
    );
  };
  window.ReactNativeWebView.postMessage = patchedPostMessage;
})})();`;

@connect(
  state => ({
    simplexData: state.simplex.simplexData,
    fabType: state.ui.fabType,
    formData: state.forms.formData,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class SimplexScreen extends Component {
  static navigationOptions = () => ({
    title: "Get Coins",
    gesturesEnabled: false,
    customBack: () => {
      store.dispatch(navigateTo("WalletLanding"));
    }
  });

  constructor(props) {
    super(props);

    this.state = {
      webViewLoaded: false,
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    const self = this;

    const interval = setInterval(() => {
      self.setState({ webViewLoaded: true });
      clearInterval(interval);
    }, 2000);

    actions.setFabType("hide");
  }

  generateWebViewContent = data => {
    const { SIMPLEX_URL } = Constants;
    const originalForm = `<!DOCTYPE html>
       <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
       <body>
          <form id="payment_form" action="${SIMPLEX_URL}" method="post">
          <input type="hidden" name="version" value="${data.version}">
          <input type="hidden" name="partner" value="${data.partner}">
          <input type="hidden" name="payment_flow_type" value="wallet">
          <input type="hidden" name="return_url_success" value="${data.return_url_success}">
          <input type="hidden" name="return_url_fail" value="${data.return_url_fail}">
          <input type="hidden" name="quote_id" value="${data.quote_id}">
          <input type="hidden" name="payment_id" value="${data.payment_id}">
          <input type="hidden" name="user_id" value="${data.user_id}">
          <input type="hidden" name="destination_wallet[address]" value="${data.address}">
          <input type="hidden" name="destination_wallet[currency]" value="${data.coin}">
          <input type="hidden" name="fiat_total_amount[amount]" value="${data.fiat_money.total_amount}">
          <input type="hidden" name="fiat_total_amount[currency]" value="${data.fiat_money.currency}">
          <input type="hidden" name="digital_total_amount[amount]" value="${data.digital_money.amount}">
          <input type="hidden" name="digital_total_amount[currency]" value="${data.digital_money.currency}">
          </form>

          <script type="text/javascript">
            document.forms["payment_form"].submit();
          </script>
        </body>
      </html>
     `;
    return originalForm;
  };

  onMsg = event => {
    const { actions, formData } = this.props;
    if (event && event.nativeEvent && event.nativeEvent.data === "success") {
      // user passed successfully
      actions.resetToScreen("WalletLanding");
      mixpanelAnalytics.finishedSimplexFlow(
        "CARD",
        formData.cryptoCoin,
        formData.fiatCoin,
        formData.amountFiat,
        formData.amountCrypto,
        "success"
      );
    } else {
      // user doesn't passed successfully
      actions.showMessage(
        "warning",
        "Simplex request failed. Please try again later."
      );
      mixpanelAnalytics.finishedSimplexFlow(
        "CARD",
        formData.cryptoCoin,
        formData.fiatCoin,
        formData.amountFiat,
        formData.amountCrypto,
        "success"
      );
    }
  };

  render() {
    const { simplexData } = this.props;
    const { webViewLoaded } = this.state;

    return (
      <View style={{ flex: 1 }}>
        {!webViewLoaded && <LoadingState heading="Please wait..." />}

        <WebView
          style={{ opacity: webViewLoaded ? 1 : 0 }}
          onMessage={this.onMsg}
          javaScriptEnabled
          injectedJavaScript={patchPostMessageJsCode}
          automaticallyAdjustContentInsets
          source={{ html: this.generateWebViewContent(simplexData) }}
        />
      </View>
    );
  }
}

export default SimplexScreen;
