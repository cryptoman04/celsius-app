import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import PassStrengthMeterStyle from "./PassStrengthMeter.styles";
import CelText from "../CelText/CelText";
import calculatePasswordScore from "../../../utils/password-util";
import STYLES from "../../../constants/STYLES";
import { SECURITY_STRENGTH_LEVEL } from "../../../constants/DATA";

class PassStrengthMeter extends Component {
  static propTypes = {
    customStyle: PropTypes.instanceOf(Object),
  };
  static defaultProps = {};

  handlePassStatus = () => {
    const status = calculatePasswordScore().customStatus;
    switch (status) {
      case SECURITY_STRENGTH_LEVEL[0]:
        return {
          level: SECURITY_STRENGTH_LEVEL[0],
          color: STYLES.COLORS.RED,
        };
      case SECURITY_STRENGTH_LEVEL[1]:
        return {
          level: SECURITY_STRENGTH_LEVEL[1],
          color: STYLES.COLORS.ORANGE,
        };
      case SECURITY_STRENGTH_LEVEL[2]:
        return {
          level: SECURITY_STRENGTH_LEVEL[2],
          color: STYLES.COLORS.ORANGE,
        };
      case SECURITY_STRENGTH_LEVEL[3]:
        return {
          level: SECURITY_STRENGTH_LEVEL[3],
          color: STYLES.COLORS.GREEN,
        };
    }
  };

  render() {
    const style = PassStrengthMeterStyle();
    const { customStyle } = this.props;
    const passStatus = this.handlePassStatus();

    return (
      <View style={[customStyle, style.container]}>
        <View
          style={{
            top: 0,
            left: 0,
            position: "absolute",
            width: `${calculatePasswordScore().percent}%`,
            // width: "100%",
            borderWidth: 2,
            borderColor: passStatus.color,
          }}
        />
        <View style={{ flexDirection: "row" }}>
          <CelText
            type={"H6"}
            color={STYLES.COLORS.MEDIUM_GRAY}
            margin={"5 0 0 0"}
          >
            Password Strength:{" "}
          </CelText>
          <CelText type={"H6"} margin={"5 0 0 0"} color={passStatus.color}>
            {passStatus.level}
          </CelText>
        </View>
      </View>
    );
  }
}

export default PassStrengthMeter;
