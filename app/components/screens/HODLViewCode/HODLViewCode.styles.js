// import STYLES from '../../../constants/STYLES';
import { getThemedStyle } from "../../../utils/styles-util";

const base = {
  container: {
    flex: 1,
  },
  spinner: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
};

const themed = {
  light: {},

  dark: {},

  celsius: {},
};

const HODLViewCodeStyles = () => getThemedStyle(base, themed);

export default HODLViewCodeStyles;
