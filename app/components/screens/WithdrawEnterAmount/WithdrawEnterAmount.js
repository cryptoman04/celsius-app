import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import testUtil from '../../../utils/test-util'
import * as appActions from '../../../redux/actions'
import WithdrawEnterAmountStyle from './WithdrawEnterAmount.styles'
import CelText from '../../atoms/CelText/CelText'
import CelButton from '../../atoms/CelButton/CelButton'
import RegularLayout from '../../layouts/RegularLayout/RegularLayout'
import Card from '../../atoms/Card/Card'
import formatter from '../../../utils/formatter'
import CelNumpad from '../../molecules/CelNumpad/CelNumpad'
import { EMPTY_STATES, KEYPAD_PURPOSES, MODALS } from "../../../constants/UI";
import CoinSwitch from '../../atoms/CoinSwitch/CoinSwitch'
import SimpleSelect from '../../molecules/SimpleSelect/SimpleSelect'
import WithdrawInfoModal from '../../organisms/WithdrawInfoModal/WithdrawInfoModal'
import { KYC_STATUSES, PREDIFINED_AMOUNTS } from "../../../constants/DATA";
import PredefinedAmounts from '../../organisms/PredefinedAmounts/PredefinedAmounts'
import { openModal } from '../../../redux/ui/uiActions'
import store from '../../../redux/store'
import StaticScreen from "../StaticScreen/StaticScreen";


@connect(
  state => ({
    walletSummary: state.wallet.summary,
    withdrawCompliance: state.user.compliance.withdraw,
    currencyRatesShort: state.currencies.currencyRatesShort,
    currencies: state.currencies.rates,
    formData: state.forms.formData,
    withdrawalAddresses: state.wallet.withdrawalAddresses,
    kycStatus: state.user.profile.kyc
      ? state.user.profile.kyc.status
      : KYC_STATUSES.collecting,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) })
)
class WithdrawEnterAmount extends Component {
  static navigationOptions = () => ({
    title: 'Withdraw',
    right: 'info',
    onInfo: () => {
      store.dispatch(openModal(MODALS.WITHDRAW_INFO_MODAL))
    }
  })

  constructor(props) {
    super(props)
    const { navigation, currencies, withdrawCompliance, walletSummary } = this.props
    const coin = navigation.getParam('coin') || 'BTC'

    const coinSelectItems = currencies
      .filter(c => withdrawCompliance.coins.includes(c.short))
      .filter(c => {
        const balanceUsd = walletSummary.coins.filter(wCoin => wCoin.short === c.short.toUpperCase())[0].amount_usd;
        return balanceUsd > 0
      })
      .map(c => ({ label: `${c.displayName} - ${c.short}`, value: c.short }))

    this.state = {
      coinSelectItems,
      activePeriod: ''
    }

    props.actions.getCoinWithdrawalAddress(coin)
    props.actions.initForm({ coin })
    props.actions.openModal(MODALS.WITHDRAW_INFO_MODAL)
  }

  onPressPredefinedAmount = ({ label, value }) => {
    const { formData, walletSummary, currencyRatesShort, actions } = this.props
    let amount

    const coinRate = currencyRatesShort[formData.coin.toLowerCase()]
    const walletSummaryObj = walletSummary.coins.find(
      c => c.short === formData.coin.toUpperCase()
    )

    if (label === 'ALL') {
      amount = formData.isUsd
        ? walletSummaryObj.amount_usd.toString()
        : walletSummaryObj.amount
    } else {
      amount = formData.isUsd ? value : (Number(value) / coinRate).toString()
    }
    this.handleAmountChange(amount, label)
    actions.toggleKeypad(false)
  }

  // TODO: move to formatter? check CelPayEnterAmount
  getNumberOfDecimals(value) {
    const splitValue = value.split('.')
    const numberOfDecimals = splitValue[1] ? splitValue[1].length : 0
    return numberOfDecimals
  }

  // TODO: move to formatter? check CelPayEnterAmount
  getAllowedDecimals = currency => (currency === 'USD' ? 2 : 5)

  // TODO: move to formatter? check CelPayEnterAmount
  setCurrencyDecimals(value, currency) {
    if (!this.hasEnoughDecimals(value, currency)) return value
    // remove last digit
    const numberOfDecimals = this.getNumberOfDecimals(value)
    const allowedDecimals = this.getAllowedDecimals(currency)

    return value.slice(0, allowedDecimals - numberOfDecimals)
  }

  // TODO: move to formatter? check CelPayEnterAmount
  hasEnoughDecimals(value = '', currency) {
    const numberOfDecimals = this.getNumberOfDecimals(value)
    const allowedDecimals = this.getAllowedDecimals(currency)

    return numberOfDecimals > allowedDecimals
  }

  handleAmountChange = (newValue, predefined = '') => {
    const { formData, currencyRatesShort, actions, walletSummary } = this.props
    const coinRate = currencyRatesShort[formData.coin.toLowerCase()]

    const balanceUsd = walletSummary.coins.find(
      c => c.short === formData.coin.toUpperCase()
    ).amount_usd

    let amountCrypto
    let amountUsd

    if (formData.isUsd) {
      amountUsd = this.setCurrencyDecimals(newValue, 'USD')
      amountCrypto = amountUsd / coinRate
    } else {
      amountCrypto = this.setCurrencyDecimals(newValue)
      amountUsd = amountCrypto * coinRate
    }

    if (amountUsd > balanceUsd) {
      return actions.showMessage('warning', 'Insufficient funds!')
    }
    if (amountUsd > 20000) {
      return actions.showMessage('warning', 'Daily withdraw limit is $20,000!')
    }

    this.setState({ activePeriod: predefined })

    actions.updateFormFields({
      amountCrypto: amountCrypto.toString(),
      amountUsd: amountUsd.toString()
    })
  }

  handleCoinChange = (field, value) => {
    const { actions, withdrawalAddresses } = this.props

    actions.updateFormFields({
      [field]: value,
      amountUsd: undefined,
      amountCrypto: undefined
    })

    if (!withdrawalAddresses[value.toUpperCase()]) {
      actions.getCoinWithdrawalAddress(value)
    }
  }

  handleNextStep = () => {
    const { actions, formData, withdrawalAddresses } = this.props
    const coinAddress = withdrawalAddresses[formData.coin.toUpperCase()].address

    if (coinAddress) {
      actions.navigateTo('WithdrawConfirmAddress')
    } else {
      actions.navigateTo('WithdrawCreateAddress')
    }
  }

  render() {
    const { coinSelectItems, activePeriod } = this.state
    const { formData, actions, walletSummary, navigation, kycStatus } = this.props
    const style = WithdrawEnterAmountStyle()
    if (!formData.coin) return null

    const coinData = walletSummary.coins.find(
      c => c.short === formData.coin.toUpperCase()
    )

    const coin = navigation.getParam('coin')

    if (kycStatus !== KYC_STATUSES.passed) return <StaticScreen emptyState={{ purpose: EMPTY_STATES.NON_VERIFIED_WITHDRAW }} />

    return (
      <RegularLayout padding='20 0 0 0' >
        <View style={style.container}>
          <View style={style.wrapper}>
            <Card padding='10 10 10 10' margin='0 0 20 0' >
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <CelText align='left' type='H7' >
                  Balance:
              </CelText>
                <CelText align='right' type='H7'>
                  {formatter.crypto(coinData.amount, formData.coin)} {' '} | {' '} {formatter.usd(coinData.amount_usd)}
                </CelText>
              </View>
            </Card>

            <View>
              <View style={style.selectWrapper}>
                <SimpleSelect
                  items={coinSelectItems}
                  field='coin'
                  displayValue={formData.coin}
                  updateFormField={actions.updateFormField}
                  onChange={this.handleCoinChange}
                  placeholder='Choose a coin'
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

            <PredefinedAmounts
              data={PREDIFINED_AMOUNTS}
              onSelect={this.onPressPredefinedAmount}
              activePeriod={activePeriod}
            />

            <CelButton
              margin='20 0 0 0'
              disabled={!(formData.amountUsd && Number(formData.amountUsd) > 0)}
              onPress={this.handleNextStep}
              iconRight='IconArrowRight'
            >
              {formData.amountUsd && Number(formData.amountUsd) > 0
                ? 'Check wallet address'
                : 'Enter amount above'}
            </CelButton>
          </View>
        </View>

        <CelNumpad
          field={formData.isUsd ? 'amountUsd' : 'amountCrypto'}
          value={formData.isUsd ? formData.amountUsd : formData.amountCrypto || ''}
          updateFormField={actions.updateFormField}
          setKeypadInput={actions.setKeypadInput}
          toggleKeypad={actions.toggleKeypad}
          onPress={this.handleAmountChange}
          purpose={KEYPAD_PURPOSES.WITHDRAW}
          autofocus={false}
        />
        <WithdrawInfoModal
          type={coin === 'CEL'}
          closeModal={actions.closeModal}
          toggleKeypad={actions.toggleKeypad}
        />
      </RegularLayout>
    )
  }
}

export default testUtil.hookComponent(WithdrawEnterAmount)
