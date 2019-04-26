import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Platform } from "react-native";

import testUtil from "../../../utils/test-util";
import Card from "../../atoms/Card/Card";
import CelText from "../../atoms/CelText/CelText";
// import STYLES from "../../../constants/STYLES";
// import Spinner from "../../atoms/Spinner/Spinner";

class CelInterestCard extends Component {
  static propTypes = {
    tier: PropTypes.string.isRequired,
    interestBonus: PropTypes.number.isRequired,
    interestInCel: PropTypes.bool,
    setUserAppSettings: PropTypes.func.isRequired,
  };
  static defaultProps = {}
  
  constructor(props) {
    super(props);

    this.state = { loading: false };
  }

  handleValueChange = async (value) => {
    const { setUserAppSettings } = this.props;
    this.setState({ loading: true })
    await setUserAppSettings({ interest_in_cel: value })
    this.setState({ loading: false })
  }

  render() {
    const { interestBonus, tier } = this.props
    // const { loading } = this.state
    if (tier === 'NONE') return null
    // const falseColor = Platform.OS === 'ios' ? "transparent" : STYLES.COLORS.DARK_GRAY3;

    return (
      <Card close margin={"30 0 0 0"}>
        <CelText type={"H4"} weight={"500"}>Want to earn better interest?</CelText>
        <CelText color='gray' type={"H4"} weight={"300"} margin={"15 0 15 0"}>
          Switch to earning interest in CEL, and earn { interestBonus }% better rates.
        </CelText>
      </Card>
    );
  }
}

export default testUtil.hookComponent(CelInterestCard);