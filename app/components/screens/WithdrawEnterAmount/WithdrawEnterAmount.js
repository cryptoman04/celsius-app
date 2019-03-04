import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import testUtil from "../../../utils/test-util";
import * as appActions from "../../../redux/actions";
import WithdrawEnterAmountStyle from "./WithdrawEnterAmount.styles";
import CelText from '../../atoms/CelText/CelText';
import CelButton from '../../atoms/CelButton/CelButton';
import RegularLayout from '../../layouts/RegularLayout/RegularLayout';
import Card from "../../atoms/Card/Card";
import formatter from "../../../utils/formatter";
import CelNumpad from "../../molecules/CelNumpad/CelNumpad";
import UI, { KEYPAD_PURPOSES } from "../../../constants/UI";
import CoinSwitch from "../../atoms/CoinSwitch/CoinSwitch";
import SimpleSelect from "../../molecules/SimpleSelect/SimpleSelect";
import WithdrawInfoModal from '../../organisms/WithdrawInfoModal/WithdrawInfoModal';
import DATA from '../../../constants/DATA';

const { MODALS } = UI

@connect(
  state => ({
    walletSummary: state.wallet.summary,
    withdrawCompliance: state.user.compliance.withdraw,
    currencyRatesShort: state.currencies.currencyRatesShort,
    currencies: state.currencies.rates,
    formData: state.forms.formData,
    withdrawalAddresses: state.wallet.withdrawalAddresses
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class WithdrawEnterAmount extends Component {

  constructor(props) {
    super(props);
    const { navigation, currencies, withdrawCompliance } = this.props;
    const coin = navigation.getParam('coin') || 'BTC'

    const coinSelectItems = currencies
      .filter(c => withdrawCompliance.coins.includes(c.short))
      .map(c => ({ label: `${c.displayName} - ${c.short}`, value: c.short }))

    this.state = {
      header: {
        title: "Withdraw",
        left: "back",
        right: "info",
        onInfo: this.handleInfoPress,
      },
      coinSelectItems,
      activePeriod: ""
    };

    props.actions.getCoinWithdrawalAddress(coin)
    props.actions.initForm({ coin })
    props.actions.openModal(MODALS.WITHDRAW_INFO_MODAL)
  }

  onPressPredefinedAmount = (number) => {
    const { formData, walletSummary, currencyRatesShort } = this.props;
    let amount;

    const coinRate = currencyRatesShort[formData.coin.toLowerCase()]
    const walletSummaryObj = walletSummary.coins.find(c => c.short === formData.coin.toUpperCase());

    if (number === "ALL") {
      amount = formData.isUsd ? walletSummaryObj.amount_usd.toString() : walletSummaryObj.amount;
    } else {
      amount = formData.isUsd ? number : (Number(number) / coinRate).toString()
    }
    this.handleAmountChange(amount, number)
  }

  getNumberOfDecimals(value) {
    const splitValue = value.split('.')
    const numberOfDecimals = splitValue[1] ? splitValue[1].length : 0;
    return numberOfDecimals;
  }

  getAllowedDecimals = (currency) => currency === 'USD' ? 2 : 5

  setCurrencyDecimals(value, currency) {
    if (!this.hasEnoughDecimals(value, currency)) return value;
    // remove last digit
    const numberOfDecimals = this.getNumberOfDecimals(value)
    const allowedDecimals = this.getAllowedDecimals(currency);

    return value.slice(0, allowedDecimals - numberOfDecimals);
  }

  hasEnoughDecimals(value = '', currency) {
    const numberOfDecimals = this.getNumberOfDecimals(value)
    const allowedDecimals = this.getAllowedDecimals(currency);

    return numberOfDecimals > allowedDecimals;
  }

  handleAmountChange = (newValue, predefined = "") => {
    const { formData, currencyRatesShort, actions, walletSummary } = this.props
    const coinRate = currencyRatesShort[formData.coin.toLowerCase()]

    const balanceUsd = walletSummary.coins.find(c => c.short === formData.coin.toUpperCase()).amount_usd;

    let amountCrypto;
    let amountUsd;

    if (formData.isUsd) {
      amountUsd = this.setCurrencyDecimals(newValue, 'USD');
      amountCrypto = amountUsd / coinRate;
    } else {
      amountCrypto = this.setCurrencyDecimals(newValue);
      amountUsd = amountCrypto * coinRate;
    }

    if (amountUsd > balanceUsd) {
      return actions.showMessage('warning', 'Insufficient funds!')
    }
    if (amountUsd > 20000) {
      return actions.showMessage('warning', 'Daily withdraw limit is $20,000!')
    }

    this.setState({ activePeriod: predefined });

    actions.updateFormFields({
      amountCrypto: amountCrypto.toString(),
      amountUsd: amountUsd.toString(),
    })
  }

  handleCoinChange = (field, value) => {
    const { actions, withdrawalAddresses } = this.props

    actions.updateFormFields({
      [field]: value,
      amountUsd: undefined,
      amountCrypto: undefined,
    });

    if (!withdrawalAddresses[value.toUpperCase()]) {
      actions.getCoinWithdrawalAddress(value);
    }
  }

  handleNextStep = () => {
    const { actions, formData, withdrawalAddresses } = this.props;
    const coinAddress = withdrawalAddresses[formData.coin.toUpperCase()].address;

    if (coinAddress) {
      actions.navigateTo('WithdrawConfirmAddress')
    } else {
      actions.navigateTo('WithdrawCreateAddress')
    }
  }

  handleInfoPress = () => {
    const { actions } = this.props;
    actions.openModal(MODALS.WITHDRAW_INFO_MODAL)
  }

  render() {
    const { header, coinSelectItems, activePeriod } = this.state;
    const { formData, actions, walletSummary } = this.props;
    const style = WithdrawEnterAmountStyle();
    if (!formData.coin) return null;

    const coinData = walletSummary.coins.find(c => c.short === formData.coin.toUpperCase());

    return (
      <RegularLayout header={header}>
        <View style={style.container}>
          <View style={style.wrapper}>
            <Card
              padding="10 10 10 10"
              margin="0 0 45 0"
              opacity={0.65}
            >
              <CelText align="center" type="H7">
                Balance: {formatter.crypto(coinData.amount, formData.coin)} | {formatter.usd(coinData.amount_usd)}
              </CelText>
            </Card>

            <View>
              <View style={style.selectWrapper}>
                <SimpleSelect
                  items={coinSelectItems}
                  field="coin"
                  displayValue={formData.coin}
                  updateFormField={actions.updateFormField}
                  onChange={this.handleCoinChange}
                />
              </View>

              <CoinSwitch
                updateFormField={actions.updateFormField}
                onAmountPress={actions.toggleKeypad}
                amountUsd={formData.amountUsd}
                amountCrypto={formData.amountCrypto}
                isUsd={formData.isUsd}
                coin={formData.coin}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: 'space-around', marginTop: 50 }}>
              {DATA.PREDIFINED_AMOUNTS.map(predefinedAmount =>
                <TouchableOpacity
                  key={predefinedAmount}
                  style={[style.periodButton, activePeriod === predefinedAmount ? style.selectedAmount : null]}
                  onPress={() => this.onPressPredefinedAmount(`${predefinedAmount}`)}
                >
                  <CelText style={[style.periodButtonText, activePeriod === predefinedAmount ? style.selectedAmountText : null]}>{predefinedAmount !== "ALL" ? `$${predefinedAmount}` : "ALL"}</CelText>
                </TouchableOpacity>
              )}
            </View>

            <CelButton
              margin="20 0 0 0"
              disabled={!(formData.amountUsd && Number(formData.amountUsd) > 0)}
              onPress={this.handleNextStep}
              iconRight="IconArrowRight"
            >
              {formData.amountUsd && Number(formData.amountUsd) > 0 ? 'Check wallet address' : 'Enter amount above'}
            </CelButton>
          </View>

          <CelNumpad
            field={formData.isUsd ? "amountUsd" : "amountCrypto"}
            value={formData.isUsd ? formData.amountUsd : formData.amountCrypto}
            updateFormField={actions.updateFormField}
            setKeypadInput={actions.setKeypadInput}
            toggleKeypad={actions.toggleKeypad}
            onPress={this.handleAmountChange}
            purpose={KEYPAD_PURPOSES.WITHDRAW}
            autofocus={false}
          />
          <WithdrawInfoModal closeModal={actions.closeModal} toggleKeypad={actions.toggleKeypad} />
        </View>
      </RegularLayout>
    );
  }
}

export default testUtil.hookComponent(WithdrawEnterAmount);