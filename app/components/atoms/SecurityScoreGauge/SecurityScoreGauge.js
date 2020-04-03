import React, { Component } from "react";
import PropTypes from "prop-types";
import { Image, View } from "react-native";

import STYLES from "../../../constants/STYLES";
import CelText from "../../atoms/CelText/CelText";
import SecurityScoreGaugeStyle from "./SecurityScoreGauge.styles";
// import CelButton from "../CelButton/CelButton";
import { SECURITY_STRENGTH_LEVEL } from "../../../constants/DATA";
import { getTheme } from "../../../utils/styles-util";
// import StoryWrapper from "../../atoms/StoryWrapper/StoryWrapper";

class SecurityScoreGauge extends Component {
  static propTypes = {
    subtitle: PropTypes.string,
    onPress: PropTypes.func,
    level: PropTypes.oneOf(["weak", "fair", "good", "strong"]).isRequired,
  };
  static defaultProps = {};

  getImage = description => {
    const theme = getTheme();
    const images = {
      lightWeak: require("../../../../assets/images/security-overview/01_gauge-weak.png"),
      darkWeak: require("../../../../assets/images/security-overview/01_gauge-dark-weak.png"),

      lightFair: require("../../../../assets/images/security-overview/02_gauge-fair.png"),
      darkFair: require("../../../../assets/images/security-overview/02_gauge-dark-fair.png"),

      lightGood: require("../../../../assets/images/security-overview/03_gauge-good.png"),
      darkGood: require("../../../../assets/images/security-overview/03_gauge-dark-good.png"),

      lightStrong: require("../../../../assets/images/security-overview/04_gauge-strong.png"),
      darkStrong: require("../../../../assets/images/security-overview/04_gauge-dark-strong.png"),
    };
    return images[`${theme}${description}`];
  };

  getGaugeProps = () => {
    const { level } = this.props;
    const strength = level.toLowerCase();
    const theme = getTheme();

    switch (strength) {
      case SECURITY_STRENGTH_LEVEL.WEAK.toLowerCase():
        return {
          text: strength.toUpperCase(),
          imageUrl: this.getImage("Weak"),
          textColor: theme === "dark" ? STYLES.COLORS.RED : STYLES.COLORS.WHITE,
          backgroundColor: STYLES.COLORS.RED,
        };
      case SECURITY_STRENGTH_LEVEL.FAIR.toLowerCase():
        return {
          text: strength.toUpperCase(),
          imageUrl: this.getImage("Fair"),
          textColor:
            theme === "dark" ? STYLES.COLORS.ORANGE_DARK : STYLES.COLORS.WHITE,
          backgroundColor: STYLES.COLORS.ORANGE_DARK,
        };
      case SECURITY_STRENGTH_LEVEL.GOOD.toLowerCase():
        return {
          text: strength.toUpperCase(),
          imageUrl: this.getImage("Good"),
          textColor:
            theme === "dark" ? STYLES.COLORS.ORANGE : STYLES.COLORS.WHITE,
          backgroundColor: STYLES.COLORS.ORANGE,
        };
      case SECURITY_STRENGTH_LEVEL.STRONG.toLowerCase():
        return {
          text: strength.toUpperCase(),
          imageUrl: this.getImage("Strong"),
          textColor:
            theme === "dark" ? STYLES.COLORS.GREEN : STYLES.COLORS.WHITE,
          backgroundColor: STYLES.COLORS.GREEN,
        };
      default:
        return null;
    }
  };

  // TODO enable fix now btn when fix now flow is finished
  render() {
    const style = SecurityScoreGaugeStyle();
    const gaugeProps = this.getGaugeProps();
    const theme = getTheme();

    if (!gaugeProps) return null;

    return (
      <View
        style={[
          style.wrapper,
          theme === "light" && { backgroundColor: gaugeProps.backgroundColor },
        ]}
      >
        <Image
          source={gaugeProps.imageUrl}
          style={style.gauge}
          resizeMode={"contain"}
        />
        <CelText type="H3" weight="600" color={gaugeProps.textColor}>
          {gaugeProps.text}
        </CelText>
        <CelText margin={"0 0 15 0"} type="H7" color={STYLES.COLORS.WHITE}>
          SECURITY SCORE
        </CelText>
        {/* <CelButton*/}
        {/*  ghost*/}
        {/*  color={"red"}*/}
        {/*  size={"small"}*/}
        {/*  textColor={"white"}*/}
        {/*  onPress={{}}*/}
        {/* >*/}
        {/*  <CelText weight={"600"} color={"white"}>*/}
        {/*    FIX NOW*/}
        {/*  </CelText>*/}
        {/*  <CelText color={"white"}> 3/7</CelText>*/}
        {/* </CelButton>*/}
      </View>
    );
  }
}

export default SecurityScoreGauge;
