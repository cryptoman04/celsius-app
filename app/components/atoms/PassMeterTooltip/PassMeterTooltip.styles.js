import { getThemedStyle } from "../../../utils/styles-util";
import STYLES from "../../../constants/STYLES";
// import STYLES from "../../../constants/STYLES";

const base = {
  container: {
    width: "100%",
    backgroundColor: STYLES.COLORS.DARK_GRAY,
    borderRadius: 8,
    alignSelf: "center",
    padding: 10,
    // elevation: 100,
    // zIndex: 1000,
    // TODO find way to set tooltip in front of button
  },
  securityStrengthItem: {
    flexDirection: "row",
  },
};

const themed = {
  light: {},

  dark: {},

  celsius: {},
};

const PassMeterTooltipStyle = () => getThemedStyle(base, themed);

export default PassMeterTooltipStyle;
