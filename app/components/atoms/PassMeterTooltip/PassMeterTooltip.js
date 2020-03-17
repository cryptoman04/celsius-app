import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import PassMeterTooltipStyle from "./PassMeterTooltip.styles";
import Icon from "../Icon/Icon";
import STYLES from "../../../constants/STYLES";
import CelText from "../CelText/CelText";
import { SECURITY_STRENGTH_ITEMS } from "../../../constants/DATA";
import calculatePasswordScore from "../../../utils/password-util";

class PassMeterTooltip extends Component {
  static propTypes = {
    parentStyle: PropTypes.instanceOf(Object),
  };

  // handleScore = () => {
  //   const score = calculatePasswordScore()
  // }

  handleSecurityItems = () => {
    const score = calculatePasswordScore().errors;

    const items = SECURITY_STRENGTH_ITEMS.map(i => {
      let status;
      if ((score && !score.includes(i.copy)) || score === "undefined") {
        status = true;
      } else {
        status = false;
      }
      return {
        copy: i.copy,
        status,
      };
    });

    return items;
  };

  render() {
    const { parentStyle } = this.props;
    const style = PassMeterTooltipStyle();
    this.handleSecurityItems();

    return (
      <View style={[style.container, parentStyle]}>
        {this.handleSecurityItems().map((i, k) => (
          <View style={style.securityStrengthItem} k={k}>
            <Icon
              name={"CheckCircle"}
              height={12}
              width={12}
              fill={i.status ? STYLES.COLORS.GREEN : STYLES.COLORS.RED}
            />
            <CelText
              color={STYLES.COLORS.WHITE}
              type={"H7"}
              margin={"-3 0 5 5"}
            >
              {i.copy}
            </CelText>
          </View>
        ))}
      </View>
    );
  }
}

export default PassMeterTooltip;
