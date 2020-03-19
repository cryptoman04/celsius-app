import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import MultiInfoCardButton from "../../molecules/MultiInfoCardButton/MultiInfoCardButton";
import TransactionsHistory from "../../molecules/TransactionsHistory/TransactionsHistory";
import { KYC_STATUSES } from "../../../constants/DATA";
import { hasPassedKYC } from "../../../utils/user-util";
import StaticScreen from "../StaticScreen/StaticScreen";
import { CEL_PAY_TYPES, EMPTY_STATES, MODALS } from "../../../constants/UI";
import cryptoUtil from "../../../utils/crypto-util";
import CelPayInfoModal from "../../modals/CelPayInfoModal/CelPayInfoModal";
import mixpanelAnalytics from "../../../utils/mixpanel-analytics";

let counter = 0;

@connect(
  state => ({
    user: state.user.profile,
    kycStatus: state.user.profile.kyc
      ? state.user.profile.kyc.status
      : KYC_STATUSES.collecting,
    celpayCompliance: state.compliance.celpay,
    walletSummary: state.wallet.summary,
    celPaySettings: state.generalData.celPaySettings,
    navHistory: state.nav.history,
    hodlStatus: state.hodl.hodlStatus,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class CelPayLanding extends Component {
  static propTypes = {};
  static defaultProps = {};

  static navigationOptions = () => ({
    title: "Choose how to CelPay",
    right: "profile",
  });

  componentDidMount() {
    const { navHistory, actions } = this.props;
    if (!counter) {
      actions.openModal(MODALS.CELPAY_INFO_MODAL);
    }
    counter += 1;
    mixpanelAnalytics.navigatedToCelPay(navHistory[0]);
  }

  sendAsLink = () => {
    const { actions } = this.props;

    actions.navigateTo("CelPayEnterAmount");
    mixpanelAnalytics.choseCelPayType(CEL_PAY_TYPES.LINK);
  };

  sendToFriend = () => {
    const { actions } = this.props;

    actions.navigateTo("CelPayChooseFriend");
    mixpanelAnalytics.choseCelPayType(CEL_PAY_TYPES.FRIEND);
  };

  render() {
    // const style = CelPayLandingStyle();
    const {
      user,
      kycStatus,
      celpayCompliance,
      walletSummary,
      actions,
      celPaySettings,
      hodlStatus,
    } = this.props;

    if (kycStatus !== KYC_STATUSES.pending && !hasPassedKYC())
      return (
        <StaticScreen
          emptyState={{ purpose: EMPTY_STATES.NON_VERIFIED_CELPAY }}
        />
      );
    if (kycStatus === KYC_STATUSES.pending && !hasPassedKYC())
      return (
        <StaticScreen
          emptyState={{ purpose: EMPTY_STATES.VERIFICATION_IN_PROCESS_CELPAY }}
        />
      );
    if (!user.celsius_member)
      return (
        <StaticScreen
          emptyState={{ purpose: EMPTY_STATES.NON_MEMBER_CELPAY }}
        />
      );
    if (hodlStatus.isActive) {
      return (
        <StaticScreen
          emptyState={{ purpose: EMPTY_STATES.HODL_MODE_WARNING }}
        />
      );
    }
    if (!celpayCompliance.allowed)
      return <StaticScreen emptyState={{ purpose: EMPTY_STATES.COMPLIANCE }} />;

    if (!cryptoUtil.isGreaterThan(walletSummary.total_amount_usd, 0))
      return (
        <StaticScreen
          emptyState={{ purpose: EMPTY_STATES.INSUFFICIENT_FUNDS }}
        />
      );

    return (
      <RegularLayout>
        <MultiInfoCardButton
          textButton={"Share as a link"}
          explanation={"Send a direct link with your preferred apps."}
          darkImage={require("../../../../assets/images/hands-in-the-air-dark.png")}
          lightImage={require("../../../../assets/images/hands-in-the-air.png")}
          onPress={this.sendAsLink}
        />
        <MultiInfoCardButton
          textButton={"Send to contacts"}
          explanation={`Send crypto to other Celsians on the network.`}
          darkImage={require("../../../../assets/images/money-currency-union-dark.png")}
          lightImage={require("../../../../assets/images/money-currency-union.png")}
          onPress={this.sendToFriend}
        />

        <TransactionsHistory
          hasFilter={false}
          additionalFilter={{ type: ["celpay"], limit: 5 }}
        />

        <CelPayInfoModal
          close={actions.closeModal}
          maxTransferAmount={celPaySettings.maximum_transfer_amount}
        />
      </RegularLayout>
    );
  }
}

export default CelPayLanding;
