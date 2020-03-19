import {
  getThemedStyle,
  heightPercentageToDP,
  widthPercentageToDP,
} from "../../../utils/styles-util";

const base = {
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: widthPercentageToDP("25%"),
    height: widthPercentageToDP("25%"),
    borderRadius: widthPercentageToDP("25%") / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "white",
  },
  image: {
    width: widthPercentageToDP("10%"),
    height: heightPercentageToDP("4%"),
    resizeMode: "contain",
  },
};

const themed = {
  light: {},

  dark: {},

  celsius: {},
};

const EmptyStateStyle = () => getThemedStyle(base, themed);

export default EmptyStateStyle;
