import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";
import * as moment from "moment";

import { HODL_STATUS } from "../../../constants/UI";
import HodlBannerStyle from "./HodlBanner.styles";
import CelText from "../../atoms/CelText/CelText";

class HodlBanner extends Component {
  static propTypes = {
    // text: PropTypes.string,
    status: PropTypes.instanceOf(Object),
    navigateTo: PropTypes.func,
    activeScreen: PropTypes.string,
  };
  static defaultProps = {};

  render() {
    const style = HodlBannerStyle();
    const { status, actions, activeScreen } = this.props;
    if (!status.isActive || activeScreen === "VerifyProfile") return null;

    const now = moment.utc();
    const deactivatedAt = moment.utc(status.deactivated_at);
    const diff = deactivatedAt.diff(now);
    let hours = Math.abs(moment.duration(diff).hours());
    let minutes = Math.abs(moment.duration(diff).minutes());

    if (Number(minutes) < 10) minutes = `0${minutes}`;
    if (Number(hours) < 10) hours = `0${hours}`;

    const isDisabled =
      status.state !== HODL_STATUS.ACTIVATED ||
      activeScreen === "VerifyProfile";

    return (
      <TouchableOpacity
        style={style.container}
        disabled={isDisabled}
        onPress={() => {
          actions.setHodlProps(true);
          actions.navigateTo("HodlLanding");
        }}
      >
        {status.state === HODL_STATUS.ACTIVATED ? (
          <CelText
            font={"RobotoMono"}
            weight="regular"
            type={"H6"}
            color={"white"}
          >
            HODL MODE: ON
          </CelText>
        ) : (
          <CelText
            font={"RobotoMono"}
            weight="regular"
            type={"H6"}
            color={"white"}
          >
            {`EXITING HODL MODE: ${hours}H ${minutes}M`}
          </CelText>
        )}
      </TouchableOpacity>
    );
  }
}

export default HodlBanner;
