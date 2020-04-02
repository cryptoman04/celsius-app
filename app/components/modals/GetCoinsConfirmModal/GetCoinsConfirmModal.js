import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ScrollView, View } from "react-native";

import GetCoinsConfirmModalStyle from "./GetCoinsConfirmModal.styles";
import CelModal from "../CelModal/CelModal.js";
import { MODALS } from "../../../constants/UI";
import CelText from "../../atoms/CelText/CelText";
import Separator from "../../atoms/Separator/Separator";
import * as appActions from "../../../redux/actions";
import CelModalButton from "../../atoms/CelModalButton/CelModalButton";
import formatter from "../../../utils/formatter";
import STYLES from "../../../constants/STYLES";

@connect(
  state => ({
    formData: state.forms.formData,
    buyCoinsSettings: state.generalData.buyCoinsSettings,
    simplexData: state.simplex.simplexData,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class GetCoinsConfirmModal extends Component {
  static propTypes = {};
  static defaultProps = {};

  onButtonPress = () => {
    const { actions } = this.props;

    actions.navigateTo("VerifyProfile", {
      onSuccess: async () => {
        await actions.simplexCreatePaymentRequest()
        actions.navigateTo("Simplex")
      },
    });
    actions.closeModal();
  };

  render() {
    const { formData, simplexData } = this.props;
    const style = GetCoinsConfirmModalStyle();

    if (!simplexData || !simplexData.fiat_money) return null;

    const cryptoAmount = simplexData.digital_money.amount;
    const baseAmount = simplexData.fiat_money.base_amount;
    const totalAmount = simplexData.fiat_money.total_amount;
    const fee =
      simplexData.fiat_money.total_amount - simplexData.fiat_money.base_amount;

    return (
      <CelModal style={style.container} name={MODALS.GET_COINS_CONFIRM_MODAL}>
        <ScrollView>
          <CelText
            type={"H2"}
            align={"center"}
            weight={"700"}
            margin={"0 0 25 0"}
          >
            Confirm Transaction Details
          </CelText>
          <CelText
            type={"H5"}
            weight={"300"}
            align={"center"}
            margin={"0 0 10 0"}
          >
            You are about to receive
          </CelText>
          <CelText
            align={"center"}
            weight={"700"}
            type={"H1"}
            margin={"0 0 10 0"}
          >
            {formatter.crypto(cryptoAmount, formData.cryptoCoin)}
          </CelText>
          <View style={style.infoBlock}>
            <CelText
              align={"center"}
              type={"H6"}
              color={STYLES.COLORS.MEDIUM_GRAY}
            >
              {formData.coin} amount is an estimate. Actual amount will be based
              on exchange rate at the moment of processing the order.
            </CelText>
          </View>
          <View style={style.transferData}>
            <Separator />
            <View style={style.transferDataItem}>
              <CelText type={"H6"} align={"left"}>
                Payment Method:
              </CelText>
              <CelText type={"H6"} align={"right"}>
                {formData.simplexData.paymentMethod}
              </CelText>
            </View>
            <Separator />
            <View style={style.transferDataItem}>
              <CelText type={"H6"} align={"left"}>
                Delivery:
              </CelText>
              <CelText type={"H6"} align={"right"}>
                0-1 day
              </CelText>
            </View>
            <Separator />
            <View style={style.transferDataItem}>
              <CelText type={"H6"} align={"left"}>
                Price:
              </CelText>
              <CelText type={"H6"} align={"right"}>
                {formatter.fiat(baseAmount, formData.fiatCoin)}
              </CelText>
            </View>
            <Separator />
            <View style={style.transferDataItem}>
              <View>
                <CelText type={"H6"} align={"left"}>
                  Fee:
                </CelText>
                <CelText type={"H7"} align={"left"} italic margin="5 0 0 0">
                  3.5% or $10.00 minimum
                </CelText>
              </View>
              <CelText type={"H6"} align={"right"}>
                {formatter.fiat(fee, formData.fiatCoin)}
              </CelText>
            </View>
            <Separator />
            <View style={style.transferDataItem}>
              <CelText type={"H6"} align={"left"}>
                Transfer Amount:
              </CelText>
              <CelText type={"H6"} align={"right"}>
                {formatter.fiat(totalAmount, formData.fiatCoin)}
              </CelText>
            </View>
          </View>
        </ScrollView>
        <View style={style.buttonsWrapper}>
          <CelModalButton
            buttonStyle={"basic"}
            position={"single"}
            onPress={this.onButtonPress}
          >
            Confirm & Buy
          </CelModalButton>
        </View>
      </CelModal>
    );
  }
}

export default GetCoinsConfirmModal;
