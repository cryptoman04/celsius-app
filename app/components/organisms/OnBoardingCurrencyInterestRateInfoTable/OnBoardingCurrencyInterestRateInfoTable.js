import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
import OnBoardingCurrencyInterestRateInfo
  from "../../molecules/OnboardingCurrencyInterestRateInfo/OnboardingCurrencyInterestRateInfo";

@connect(
  state => ({
    interestRates: state.interest.rates,
    interestRatesDisplay: state.interest.ratesDisplay,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class OnBoardingCurrencyInterestRateInfoTable extends Component {

  componentDidMount() {
    const { actions } = this.props;

    actions.getInterestRates();
  }

  renderInterestTable() {
    const { interestRates, interestRatesDisplay } = this.props;
    const interestArray = [];
    const ratesPriority = ['ETH', 'BTC', 'USD'];

    Object.keys(interestRates).forEach((currency) => {
      const obj = {};
      obj.currency = currency;
      obj.rate = interestRatesDisplay[currency];

      interestArray.push(obj);
    });

    const sortedRates = interestArray.sort((a, b) => {
      if (ratesPriority.indexOf(a.currency) > ratesPriority.indexOf(b.currency)) {
        return -1;
      }

      if (ratesPriority.indexOf(a.currency) < ratesPriority.indexOf(b.currency)) {
        return 1;
      }

      return 0;
    });

    return (
      sortedRates.map(interest =>
        <OnBoardingCurrencyInterestRateInfo
          key={interest.currency}
          compact
          currency={interest.currency}
          rate={`${interest.rate}%`}
        />
      )
    );
  }

  render() {
    const {interestRates} = this.props;

    return (
      <View>
        {interestRates ? this.renderInterestTable() : null}
      </View>
    );
  }
}

export default OnBoardingCurrencyInterestRateInfoTable;