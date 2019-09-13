import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as appActions from "../../../redux/actions";

import ChoosePaymentMethodStyle from "./ChoosePaymentMethod.styles";
import PaymentCard from "../../organisms/PaymentCard/PaymentCard";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import PrepayDollarInterestModal from "../../organisms/PrepayDollarInterestModal/PrepayDollarInterestModal";
import { MODALS } from "../../../constants/UI";
import formatter from "../../../utils/formatter";

@connect(
  state => ({
    formData: state.forms.formData,
    loanSettings: state.loans.loanSettings
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class ChoosePaymentMethod extends Component {
  static propTypes = {};
  static defaultProps = {};

  static navigationOptions = ({ navigation }) => {
    const reason = navigation.getParam("reason");
    return {
      title: reason ? "Setup Payment" : "Prepay interest",
      right: "profile",
      left: "back"
    };
  };


  getCardProps = () => {
    const { actions, navigation, loanSettings } = this.props;
    const number = 12; // TODO (srdjan) this number is from BE, calculating based on cel ratio, or hardcoded?
    const reason = navigation.getParam("reason");
    const id = navigation.getParam("id");

    const pay = reason ? `pay` : `prepay`;

    const cardProps = [
      {
        cardTitle: `${formatter.capitalize(pay)} with CEL`,
        cardCopy: `Pay up to ${number}% less interest when you choose to ${pay} your monthly payment in CEL.`,
        onPressAction: () => actions.navigateTo("PaymentCel", { reason, id }),
        lightImage: require("../../../../assets/images/icons/cel.png"),
        darkImage: require("../../.././../assets/images/icons/cel-dark.png"),
        isPaymentCel: reason && loanSettings.interest_payment_asset === "CEL"
      },
      {
        cardTitle: `${formatter.capitalize(pay)} with crypto`,
        cardCopy: `Use coins from your wallet to ${pay} your loan interest.`,
        onPressAction: () => actions.navigateTo("LoanPaymentCoin", { reason, id }),
        lightImage: require("../../../../assets/images/icons/crypto.png"),
        darkImage: require("../../.././../assets/images/icons/crypto-dark.png"),
        isPaymentCel: reason && loanSettings.interest_payment_asset !== "CEL" && loanSettings.interest_payment_asset !== "USD"
      },
      {
        cardTitle: `${formatter.capitalize(pay)} with Dollars`,
        cardCopy: `Get all the information necessary to ${pay} your interest in dollars.`,
        onPressAction: () => reason ? actions.navigateTo("WiringBankInformation") : actions.openModal(MODALS.PREPAY_DOLLAR_INTEREST_MODAL),
        lightImage: require("../../../../assets/images/icons/dollars.png"),
        darkImage: require("../../.././../assets/images/icons/dollars-dark.png"),
        isPaymentCel: reason && loanSettings.interest_payment_asset === "USD"
      }
    ];

    return cardProps;
  };

  render() {
    const style = ChoosePaymentMethodStyle();

    const cardProps = this.getCardProps();

    return (
      <View style={style.container}>
        <RegularLayout>
          {cardProps.map(i => (
            <PaymentCard
              key={i.cardTitle}
              cardTitle={i.cardTitle}
              cardCopy={i.cardCopy}
              onPressAction={i.onPressAction}
              lightImage={i.lightImage}
              isPaymentCel={i.isPaymentCel}
              darkImage={i.darkImage}
            />
          ))}
        </RegularLayout>
        <PrepayDollarInterestModal/>
      </View>
    );
  }
}

export default ChoosePaymentMethod;
