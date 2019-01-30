import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Grid, Col, Row } from "react-native-easy-grid";
import { LineChart } from 'react-native-svg-charts'
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import * as appActions from "../../../redux/actions";
import formatter from '../../../utils/formatter';
import PricingChangeIndicator from "../../molecules/PricingChangeIndicator/PricingChangeIndicator";
import Icon from "../../atoms/Icon/Icon";
import Card from '../../atoms/Card/Card';
import { FONT_SCALE, GLOBAL_STYLE_DEFINITIONS as globalStyles, STYLES } from "../../../config/constants/style";


const { height } = Dimensions.get('window');

const commonStyles = {
  percentageAmount: {
    marginLeft: 3,
    marginRight: 3,
  },
  triangle: {
    width: 9,
    height: 5,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    marginTop: 7,
    borderTopWidth: 0,
    borderRightWidth: 4.5,
    borderBottomWidth: 6,
    borderLeftWidth: 5,
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  }
};

const CoinCardStyle = StyleSheet.create({
  label: {
    color: '#3D4853',
    fontSize: FONT_SCALE * 11,
    opacity: 0.7,
    fontFamily: 'agile-book',
  },
  text: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: FONT_SCALE * 29,
    color: '#3D4853',
    fontFamily: 'agile-medium',
  },
  coinAmount: {
    fontSize: FONT_SCALE * 14,
    fontFamily: 'agile-light',
    color: '#181C21',
  },
  red: {
    ...commonStyles.percentageAmount,
    color: STYLES.PRIMARY_RED,
  },
  green: {
    ...commonStyles.percentageAmount,
    color: STYLES.COIN_DATA_GREEN,
  },
  triangleUp: {
    ...commonStyles.triangle,
    borderBottomColor: STYLES.COIN_DATA_GREEN,
  },
  triangleDown: {
    ...commonStyles.triangle,
    borderBottomColor: STYLES.PRIMARY_RED,
    marginTop: 6,
    transform: [
      { rotate: '180deg' }
    ]
  },
  coinData: {
    display: 'flex',
    borderTopWidth: 1,
    borderColor: STYLES.GRAY_1,
    marginTop: 12,
    paddingTop: 12,
  },
  image: {
    marginLeft: 'auto',
    width: 48,
    height: 48,
    marginTop: height / 55,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  lastInterestWrapper: {
    backgroundColor: STYLES.PRIMARY_BLUE,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  lockedCollateralWrapper: {
    backgroundColor: STYLES.GRAY_1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  lastInterestText: {
    fontFamily: 'agile-light',
    color: STYLES.WHITE_TEXT_COLOR,
    fontSize: FONT_SCALE * 16,
  },
  lockedCollateralText: {
    fontFamily: 'agile-light',
    color: STYLES.GRAY_4,
    fontSize: FONT_SCALE * 16,
  },
  lendingBorrowingInfoWrapper: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    height: 46,
    display: 'flex',
    alignItems: 'center',
    paddingRight: 14,
    paddingLeft: 14,
  },
  lendingBorrowingInfoText: {
    fontFamily: 'agile-medium',
    fontSize: FONT_SCALE * 14,
    marginLeft: 9,
    color: '#3D4853',
    marginRight: 20,
  },
  row: {
    paddingLeft: 16,
    paddingRight: 16,
  },
});

const CoinCardInfo = ({ text }) => (
  <Row>
    <View style={[CoinCardStyle.wrapper, CoinCardStyle.lendingBorrowingInfoWrapper]}>
      <Icon
        name={'EligibilityStar'}
        height='26'
        width='26'
        fill={STYLES.PRIMARY_BLUE}
        stroke={'white'}
      />
      <Text style={CoinCardStyle.lendingBorrowingInfoText}>{text}</Text>
    </View>
  </Row>
);

@connect(
  state => ({
    nav: state.nav,
    eligibleCoins: state.users.compliance.app.coins,
    activeScreen: state.nav.routes[state.nav.index].routeName,
  }),
  dispatch => ({ actions: bindActionCreators(appActions, dispatch) }),
)
class CoinCard extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['default', 'wallet-card'])
  }

  static defaultProps = {
    type: 'default',
  }

  render() {
    const { type, currency, amount, total, supportedCurrencies, lastInterest, eligibleCoins, lockedCollateral, actions } = this.props;

    const letterSize = Math.round(total).toString().length >= 7 ?
      FONT_SCALE * 20 : FONT_SCALE * 29;

    const percentChange = get(currency, 'market.quotes.USD.percent_change_24h', 0);
    const isPercentChangeNegative = percentChange < 0;
    const graphDataObj = supportedCurrencies != null && supportedCurrencies.filter(supportedCurrencie => supportedCurrencie.short === currency.short)
    const graphData = get(graphDataObj, '[0]market.price_usd.1d', null)
    // eslint-disable-next-line
    const graphDataPrices = graphData != null ? graphData.map(([_timestamp, price]) => price) : null;

    const cardType = type === 'default' ? 'transparent' : 'white';
    let cardStyle = {};

    if (type === 'default') {
      cardStyle = {
        borderBottomWidth: 1,
        borderBottomColor: STYLES.GRAY_5,
        paddingBottom: 30,
      };
    }

    return (
      <Card type={cardType} style={cardStyle}>
        <Grid style={type === "wallet-card" && Number(amount) === 0 ? [CoinCardStyle.row, { paddingTop: 10, opacity: 0.4 }] : [CoinCardStyle.row, { paddingTop: 10 }]}>
          <Row>
            <Col style={{ width: '70%', justifyContent: 'center' }}>
              <View>
                <Text
                  style={CoinCardStyle.label}>{currency.short.toUpperCase()} - {currency.name.toUpperCase()}</Text>
                <Text style={[CoinCardStyle.text, { fontSize: letterSize }]}>{formatter.usd(total)}</Text>
                <Text
                  style={[CoinCardStyle.coinAmount, { fontFamily: 'agile-light' }]}>{formatter.crypto(amount, currency.short.toUpperCase(), { precision: 5 })}</Text>
              </View>
            </Col>
            <Col style={{ width: '30%' }}>
              <Image
                source={{ uri: currency.image_url }}
                style={CoinCardStyle.image}
              />
              { type !== "wallet-card" && eligibleCoins.indexOf(currency.short) !== -1 ? (
                <Icon
                  style={{position: 'absolute', bottom: 0, right: 0 }}
                  name={'EligibilityStar'}
                  height='20'
                  width='20'
                  fill={STYLES.PRIMARY_BLUE}
                  stroke={'white'}
                />
              ) : null}
            </Col>
          </Row>
        </Grid>
        <Grid style={[CoinCardStyle.coinData, type === 'default' ? {borderColor: STYLES.GRAY_3} : { borderColor: STYLES.GRAY_1 }]}>
          <Row style={[CoinCardStyle.row, { paddingBottom: 16 }]}>
            <PricingChangeIndicator
              rootStyles={{marginLeft: 0,}}
              isPercentChangeNegative={isPercentChangeNegative}
              percentChange={percentChange}
            />
            <View style={CoinCardStyle.wrapper}>
              <Text
                style={CoinCardStyle.coinAmount}>1 {currency.short} =
              </Text>
              <Text style={[CoinCardStyle.coinAmount, globalStyles.boldText]}>{formatter.usd(currency.market.quotes.USD.price)}</Text>
            </View>
          </Row>
          {graphDataPrices &&
            <Row style={[CoinCardStyle.row, { paddingBottom: 20 }]}>
              <View style={{ width: '100%' }}>
                <LineChart
                  style={{ height: 30 }}
                  data={graphDataPrices}
                  svg={{ stroke: isPercentChangeNegative ? '#EF461A' : '#4FB895' }}
                />
              </View>
            </Row>
          }
          {(type !== "wallet-card" && currency.short !== 'CEL'&& eligibleCoins.indexOf(currency.short) !== -1) &&
            <CoinCardInfo text={`Earn interest or use ${currency.short} as collateral today`}/>
          }
          {(type !== "wallet-card" && currency.short === 'CEL') &&
            <CoinCardInfo text="CEL token price is based on the Crowdsale price until we list on an official exchange" />
          }
        </Grid>
        {(type === 'wallet-card' && !!lastInterest && !!Number(lastInterest.amount_usd)) &&
          <View style={CoinCardStyle.lastInterestWrapper}>
            <View>
              <Text style={CoinCardStyle.lastInterestText}>Weekly interest on {currency.short.toUpperCase()}:</Text>
            </View>
            <View style={{ flex: 0 }}>
              <Text style={[CoinCardStyle.lastInterestText, globalStyles.boldText]}>{formatter.usd(lastInterest.amount_usd)}</Text>
            </View>
          </View>
        }
        {(type === 'wallet-card' && !!lockedCollateral && !!Number(lockedCollateral)) &&
          <TouchableOpacity style={CoinCardStyle.lockedCollateralWrapper} onPress={() => actions.navigateTo('BRWAllLoans')}>
            <View style={{ flexDirection: 'row' }}>
              <Icon style={{ marginRight: 10 }} name='Lock' width='16' height='18' fill={STYLES.GRAY_4} />
              <Text style={CoinCardStyle.lockedCollateralText}>Locked collateral: </Text>
            </View>
            <View style={{ flex: 0 }}>
              <Text style={[CoinCardStyle.lockedCollateralText, globalStyles.boldText]}>{formatter.crypto(Math.abs(lockedCollateral), currency.short.toUpperCase(), { precision: 5 })}</Text>
            </View>
          </TouchableOpacity>
        }
      </Card>
    );
  }
};

export default CoinCard;