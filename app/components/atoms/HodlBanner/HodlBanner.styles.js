// import STYLES from '../../../constants/STYLES';
import { getThemedStyle } from "../../../utils/styles-util";
import STYLES from "../../../constants/STYLES";

const base = {
  container: {
    borderRadius: 15,
    backgroundColor: STYLES.COLORS.RED,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
};

const themed = {
  light: {},

  dark: {},

  celsius: {},
};

const HodlBannerStyle = () => getThemedStyle(base, themed);

export default HodlBannerStyle;
