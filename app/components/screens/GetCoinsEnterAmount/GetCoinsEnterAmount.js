import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
import GetCoinsEnterAmountStyle from "./GetCoinsEnterAmount.styles";
import RegularLayout from "../../layouts/RegularLayout/RegularLayout";
import STYLES from "../../../constants/STYLES";
import CoinPicker from "../../molecules/CoinPicker/CoinPicker";
import CelNumpad from "../../molecules/CelNumpad/CelNumpad";
import { KEYPAD_PURPOSES, MODALS, THEMES } from "../../../constants/UI";
import formatter from "../../../utils/formatter";
import CelButton from "../../atoms/CelButton/CelButton";
import CelText from "../../atoms/CelText/CelText";
import GetCoinsConfirmModal from "../../modals/GetCoinsConfirmModal/GetCoinsConfirmModal";
import apiUtil from "../../../utils/api-util";
import API from "../../../constants/API";
import { SIMPLEX_FIAT_CURRENCIES } from "../../../constants/DATA";
import Spinner from "../../atoms/Spinner/Spinner";
import { getTheme } from "../../../utils/styles-util";
import mixpanelAnalytics from "../../../utils/mixpanel-analytics";

@connect(
  state => ({
    walletSummary: state.wallet.summary,
    formData: state.forms.formData,
    keypadOpen: state.ui.isKeypadOpen,
    currencyRatesShort: state.currencies.currencyRatesShort,
    buyCoinsSettings: state.generalData.buyCoinsSettings,
    depositCompliance: state.compliance.deposit,
    currencies: state.currencies.rates,
    simplexData: state.simplex.simplexData,
    callsInProgress: state.api.callsInProgress,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class GetCoinsEnterAmount extends Component {
  static propTypes = {};
  static defaultProps = {};

  static navigationOptions = () => ({
    title: "Buy Coins",
    right: "profile",
  });

  constructor(props) {
    super(props);
    const {
      currencies,
      depositCompliance,
      buyCoinsSettings,
      actions,
    } = this.props;

    const availableCryptoCoins =
      buyCoinsSettings && depositCompliance
        ? currencies
            .filter(c => depositCompliance.coins.includes(c.short))
            .filter(c => buyCoinsSettings.supported_coins.includes(c.short))
            .map(c => ({
              label: `${formatter.capitalize(c.name)} (${c.short})`,
              value: c.short,
            }))
        : [];

    actions.updateFormFields({
      amountFiat: "",
      amountCrypto: "",
      isFiat: false,
      fiatCoin: "USD",
      cryptoCoin: "ETH",
    });

    this.state = {
      availableCryptoCoins,
    };
  }

  handleNextStep = () => {
    const {
      actions,
      formData,
      buyCoinsSettings,
      currencyRatesShort,
    } = this.props;

    const cryptoProp = formData.cryptoCoin.toLowerCase();
    const amountInUsd =
      currencyRatesShort[cryptoProp] / Number(formData.amountCrypto);

    if (
      Number(formData.amountFiat) <
      buyCoinsSettings.limit_per_fiat_currency[formData.fiatCoin].min
    ) {
      return actions.showMessage(
        "warning",
        `Please enter amount above ${formatter.fiat(
          buyCoinsSettings.limit_per_fiat_currency[formData.fiatCoin].min,
          formData.fiatCoin
        )} to continue.`
      );
    }
    if (
      Number(formData.amountFiat) >
      buyCoinsSettings.limit_per_fiat_currency[formData.fiatCoin].max
    ) {
      return actions.showMessage(
        "warning",
        `Please enter amount below ${formatter.fiat(
          buyCoinsSettings.limit_per_fiat_currency[formData.fiatCoin].max,
          formData.fiatCoin
        )} to continue.`
      );
    }

    actions.updateFormField("amountInUsd", amountInUsd * 1.35); // NOTE: added 3.5% fee to value
    mixpanelAnalytics.enteredBuyCoinsAmount(
      "CARD",
      formData.cryptoCoin,
      formData.fiatCoin,
      formData.amountInUsd,
      formData.amountFiat,
      formData.amountCrypto
    );
    actions.openModal(MODALS.GET_COINS_CONFIRM_MODAL);
  };

  setCryptoAmount = simplexCryptoAmount =>
    Math.max(simplexCryptoAmount, 0).toString();

  handleAmountChange = async newValue => {
    const { formData, actions } = this.props;
    const splitedValue = newValue.toString().split(".");

    if (splitedValue && splitedValue.length > 2) return;

    let amountFiat = "";
    let amountCrypto = "";

    if (formData.isFiat) {
      // All fiats have decimals like USD
      amountFiat = formatter.setCurrencyDecimals(newValue, "USD");
    } else {
      amountCrypto = formatter.setCurrencyDecimals(newValue);
    }

    // Change value '.' to '0.'
    if (amountFiat[0] === ".") amountFiat = `0${amountFiat}`;
    // if the crypto amount is eg. 01 the value will be 1, 00 -> 0
    if (
      amountFiat.length > 1 &&
      amountFiat[0] === "0" &&
      amountFiat[1] !== "."
    ) {
      amountFiat = amountFiat[1];
    }

    // if crypto amount is undefined, set it to empty string
    if (!amountCrypto) amountCrypto = "";
    // Change value '.' to '0.'
    if (amountCrypto[0] === ".") amountCrypto = `0${amountCrypto}`;
    // if the crypto amount is eg. 01 the value will be 1, 00 -> 0
    if (
      amountCrypto.length > 1 &&
      amountCrypto[0] === "0" &&
      amountCrypto[1] !== "."
    ) {
      amountCrypto = amountCrypto[1];
    }

    actions.updateFormFields({
      amountFiat,
      amountCrypto: amountCrypto.toString(),
    });

    await actions.simplexGetQuote();
    const { simplexData } = this.props;

    if (formData.isFiat) {
      actions.updateFormField(
        "amountCrypto",
        this.setCryptoAmount(simplexData.digital_money.amount)
      );
    } else {
      actions.updateFormField(
        "amountFiat",
        simplexData.fiat_money.total_amount.toString()
      );
    }
  };

  handleFiatCoinSelect = async (field, value) => {
    const { actions, formData } = this.props;
    actions.updateFormFields({
      fiatCoin: value,
      amountFiat: "",
      amountCrypto: formData.amountCrypto || "",
      isFiat: !formData.amountCrypto,
    });
    if (formData.amountCrypto) {
      await actions.simplexGetQuote();
      const { simplexData } = this.props;
      actions.updateFormField(
        "amountFiat",
        simplexData.fiat_money.total_amount.toString()
      );
    }
  };

  handleCryptoCoinSelect = async (field, value) => {
    const { actions, formData } = this.props;
    actions.updateFormFields({
      cryptoCoin: value,
      amountCrypto: "",
      amountFiat: formData.amountFiat || "",
      isFiat: !!formData.amountFiat,
    });
    if (formData.amountFiat) {
      await actions.simplexGetQuote();
      const { simplexData } = this.props;
      actions.updateFormField(
        "amountCrypto",
        this.setCryptoAmount(simplexData.digital_money.amount)
      );
    }
  };

  render() {
    const { actions, formData, callInProgress } = this.props;
    const { availableCryptoCoins } = this.state;

    const theme = getTheme();
    const style = GetCoinsEnterAmountStyle();

    const isFetchingQuotes = apiUtil.areCallsInProgress(
      [API.GET_QUOTE],
      callInProgress
    );

    return (
      <RegularLayout fabType={"hide"} padding={"0 0 0 0"}>
        <View style={style.fiatSection}>
          <View style={style.amounts}>
            <CelText
              color={
                theme === THEMES.DARK
                  ? STYLES.COLORS.WHITE_OPACITY5
                  : STYLES.COLORS.MEDIUM_GRAY
              }
              align={"center"}
              margin={"0 0 10 0"}
            >
              PAY WITH
            </CelText>
            <CoinPicker
              type={"basic"}
              updateFormField={actions.updateFormField}
              onChange={this.handleFiatCoinSelect}
              coin={formData.fiatCoin}
              field="fiatCoin"
              defaultSelected={formData.fiatCoin || "USD"}
              availableCoins={SIMPLEX_FIAT_CURRENCIES}
              navigateTo={actions.navigateTo}
            />
          </View>
          {isFetchingQuotes && !formData.isFiat ? (
            <View style={{ marginVertical: 15 }}>
              <Spinner size={30} />
            </View>
          ) : (
            <TouchableOpacity
              style={{ marginVertical: 10 }}
              onPress={() => {
                actions.updateFormField("isFiat", true);
                actions.toggleKeypad(true);
              }}
            >
              <CelText
                color={
                  theme === THEMES.DARK
                    ? STYLES.COLORS.WHITE_OPACITY5
                    : STYLES.COLORS.MEDIUM_GRAY
                }
                type={"H2"}
              >
                {formatter.fiat(formData.amountFiat, formData.fiatCoin)}
              </CelText>
            </TouchableOpacity>
          )}
        </View>
        <View style={style.cryptoSection}>
          <View style={style.amounts}>
            <CelText
              color={STYLES.COLORS.MEDIUM_GRAY}
              align={"center"}
              margin={"0 0 10 0"}
            >
              RECEIVE
            </CelText>
            <CoinPicker
              type={"basic"}
              updateFormField={actions.updateFormField}
              onChange={this.handleCryptoCoinSelect}
              coin={formData.cryptoCoin}
              field="cryptoCoin"
              defaultSelected={formData.cryptoCoin || "ETH"}
              availableCoins={availableCryptoCoins}
              navigateTo={actions.navigateTo}
            />
          </View>
          {isFetchingQuotes && formData.isFiat ? (
            <View style={{ marginVertical: 15 }}>
              <Spinner size={30} color={STYLES.COLORS.WHITE} />
            </View>
          ) : (
            <TouchableOpacity
              style={{ marginVertical: 10 }}
              onPress={() => {
                actions.updateFormField("isFiat", false);
                actions.toggleKeypad(true);
              }}
            >
              <CelText color={STYLES.COLORS.WHITE} type={"H2"}>
                {" "}
                {formatter.crypto(formData.amountCrypto, formData.cryptoCoin)}
              </CelText>
            </TouchableOpacity>
          )}
        </View>
        <CelButton
          margin="30 0 0 0"
          disabled={!(formData.amountFiat && Number(formData.amountFiat) > 0)}
          onPress={this.handleNextStep}
          iconRight={
            formData.amountFiat && Number(formData.amountFiat) > 0
              ? "IconArrowRight"
              : ""
          }
        >
          {formData.amountFiat && Number(formData.amountFiat) > 0
            ? "Buy Coins"
            : "Enter amount above"}
        </CelButton>
        <CelNumpad
          field={formData.isFiat ? "amountFiat" : "amountCrypto"}
          value={formData.isFiat ? formData.amountFiat : formData.amountCrypto}
          toggleKeypad={actions.toggleKeypad}
          updateFormField={actions.updateFormField}
          setKeypadInput={actions.setKeypadInput}
          onPress={this.handleAmountChange}
          purpose={KEYPAD_PURPOSES.BUY_COINS}
          autofocus
        />
        <GetCoinsConfirmModal />
      </RegularLayout>
    );
  }
}

export default GetCoinsEnterAmount;
