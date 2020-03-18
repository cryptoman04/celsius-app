// import STYLES from '../../../constants/STYLES';
import { getThemedStyle } from "../../../utils/styles-util";

const base = {
  container: {
    flex: 1,
    flexDirection: "row",
  },
};

const themed = {
  light: {},

  dark: {},

  celsius: {},
};

const PassStrengthMeterStyle = () => getThemedStyle(base, themed);

export default PassStrengthMeterStyle;
