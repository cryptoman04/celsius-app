import React, { Component } from "react";
import { View, Platform, Switch } from "react-native";
import PropTypes from "prop-types";
import { getTheme } from "../../../utils/styles-util";

// import CelSwitchStyle from "./CelSwitch.styles";
import STYLES from "../../../constants/STYLES";

const falseColor =
  Platform.OS === "ios" ? "transparent" : STYLES.COLORS.DARK_GRAY3;
const theme = getTheme();

class CelSwitch extends Component {
  static propTypes = {
    thumbColor: PropTypes.string,
    iosBackgroundColor: PropTypes.string,
    trackColor: PropTypes.instanceOf(Object),
    value: PropTypes.bool,
    onValueChange: PropTypes.func,
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    thumbColor:
      theme === "light"
        ? STYLES.COLORS.WHITE
        : STYLES.COLORS.DARK_TOGGLE_FOREGROUND,
    iosBackgroundColor:
      theme === "light"
        ? STYLES.COLORS.DARK_GRAY3
        : STYLES.COLORS.DARK_TOGGLE_BACKGROUND,
    trackColor: { false: falseColor, true: STYLES.COLORS.GREEN },
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      thumbColor,
      iosBackgroundColor,
      trackColor,
      value,
      onValueChange,
      disabled,
    } = this.props;
    // const style = CelSwitchStyle();
    return (
      <View>
        <Switch
          disabled={disabled}
          thumbColor={thumbColor}
          ios_backgroundColor={iosBackgroundColor}
          trackColor={trackColor}
          value={value}
          onValueChange={onValueChange}
        />
      </View>
    );
  }
}

export default CelSwitch;
