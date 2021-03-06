import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";

// import TransactionDetailsCelPayStyle from "./TransactionDetailsCelPay.styles";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import TxInfoSection from "../../atoms/TxInfoSection/TxInfoSection";
import TxBasicSection from "../../atoms/TxBasicSection/TxBasicSection";
import CelButton from "../../atoms/CelButton/CelButton";
import STYLES from "../../../constants/STYLES";
import CelText from "../../atoms/CelText/CelText";
import Separator from "../../atoms/Separator/Separator";
import { TRANSACTION_TYPES } from "../../../constants/DATA";
import SendCelPayLinkCard from "../../molecules/SendCelPayLinkCard/SendCelPayLinkCard";
import TxSentSection from "../../molecules/TxSentSection/TxSentSection";

class TransactionDetailsCelPay extends Component {
  static propTypes = {
    transaction: PropTypes.string,
  };
  static defaultProps = {};

  render() {
    // const style = TransactionDetailsCelPayStyle();
    const { transaction, actions } = this.props;
    const transactionProps = transaction.uiProps;

    const type = transaction.type;
    const text = [
      TRANSACTION_TYPES.CELPAY_ONHOLD,
      TRANSACTION_TYPES.CELPAY_RECEIVED,
      TRANSACTION_TYPES.CELPAY_RETURNED,
    ].includes(type)
      ? "Received from:"
      : "Sent to:";
    const shouldRenderSentSection = [
      TRANSACTION_TYPES.CELPAY_PENDING_VERIFICATION,
      TRANSACTION_TYPES.CELPAY_SENT,
      TRANSACTION_TYPES.CELPAY_ONHOLD,
      TRANSACTION_TYPES.CELPAY_RECEIVED,
      TRANSACTION_TYPES.CELPAY_CANCELED,
    ].includes(type);
    const shouldRenderCelPayButton = [
      TRANSACTION_TYPES.CELPAY_CANCELED,
      TRANSACTION_TYPES.CELPAY_SENT,
      TRANSACTION_TYPES.CELPAY_PENDING_VERIFICATION,
    ].includes(type);
    const shouldRenderGoBackToWallet = [
      TRANSACTION_TYPES.CELPAY_PENDING_VERIFICATION,
      TRANSACTION_TYPES.CELPAY_SENT,
      TRANSACTION_TYPES.CELPAY_RECEIVED,
      TRANSACTION_TYPES.CELPAY_ONHOLD,
      TRANSACTION_TYPES.CELPAY_CANCELED,
    ].includes(type);
    const shouldRenderCancel = [
      TRANSACTION_TYPES.CELPAY_PENDING_VERIFICATION,
      TRANSACTION_TYPES.CELPAY_PENDING,
    ].includes(type);
    const shouldRenderNote = [
      TRANSACTION_TYPES.CELPAY_PENDING_VERIFICATION,
      TRANSACTION_TYPES.CELPAY_CLAIMED,
      TRANSACTION_TYPES.CELPAY_CANCELED,
    ].includes(type);

    return (
      <RegularLayout>
        <View>
          <TxInfoSection
            margin="40 0 20 0"
            transaction={transaction}
            transactionProps={transactionProps}
          />

          {shouldRenderSentSection ? (
            <TxSentSection text={text} transaction={transaction} />
          ) : null}

          <TxBasicSection
            label={"Date"}
            value={moment(transaction.time).format("D MMM YYYY")}
          />

          <TxBasicSection
            label={"Time"}
            value={moment.utc(transaction.time).format("h:mm A (z)")}
          />

          {type === TRANSACTION_TYPES.CELPAY_PENDING ? (
            <SendCelPayLinkCard transaction={transaction} />
          ) : null}

          {shouldRenderNote && transaction.transfer_data.message ? (
            <View
              style={{
                width: "100%",
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}
            >
              <CelText type="H6">Note:</CelText>
              <CelText type="H6" italic margin="5 0 0 0">
                {transaction.transfer_data.message}
              </CelText>
              <Separator margin={"20 0 0 0"} />
            </View>
          ) : null}

          {shouldRenderCelPayButton ? (
            <CelButton
              margin={"40 0 0 0"}
              onPress={() => actions.navigateTo("CelPayLanding")}
            >
              Start Another CelPay
            </CelButton>
          ) : null}

          {type === TRANSACTION_TYPES.CELPAY_RECEIVED ? (
            <CelButton
              margin={"40 0 0 0"}
              onPress={() => actions.navigateTo("Deposit")}
            >
              Deposit Coins
            </CelButton>
          ) : null}

          {shouldRenderGoBackToWallet ? (
            <CelButton
              margin={"20 0 0 0"}
              basic
              onPress={() => actions.navigateTo("WalletLanding")}
            >
              Go Back to Wallet
            </CelButton>
          ) : null}

          {shouldRenderCancel ? (
            <CelButton
              margin={"20 0 0 0"}
              color={STYLES.COLORS.RED}
              basic
              onPress={() => actions.cancelWithdrawal(transaction.id)}
            >
              Cancel CelPay
            </CelButton>
          ) : null}
        </View>
      </RegularLayout>
    );
  }
}

export default TransactionDetailsCelPay;
