// import STYLES from '../../../constants/STYLES';
import { getThemedStyle } from "../../../utils/styles-util";

const base = {
  container: {
    flex: 1,
    flexDirection: "row",
  },
  meterLine: {
    top: 0,
    left: 0,
    position: "absolute",
    borderWidth: 1,
  },
};

const themed = {
  light: {},

  dark: {},

  celsius: {},
};

const PassStrengthMeterStyle = () => getThemedStyle(base, themed);

export default PassStrengthMeterStyle;
