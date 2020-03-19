import Constants from "../../constants";

const { API_URL } = Constants;

const FONTS = [
  { "Barlow-Thin": require("../../assets/fonts/Barlow/Barlow-Thin.ttf") },
  {
    "Barlow-ThinItalic": require("../../assets/fonts/Barlow/Barlow-ThinItalic.ttf"),
  },
  {
    "Barlow-ExtraLight": require("../../assets/fonts/Barlow/Barlow-ExtraLight.ttf"),
  },
  {
    "Barlow-ExtraLightItalic": require("../../assets/fonts/Barlow/Barlow-ExtraLightItalic.ttf"),
  },
  { "Barlow-Light": require("../../assets/fonts/Barlow/Barlow-Light.ttf") },
  {
    "Barlow-LightItalic": require("../../assets/fonts/Barlow/Barlow-LightItalic.ttf"),
  },
  { "Barlow-Regular": require("../../assets/fonts/Barlow/Barlow-Regular.ttf") },
  {
    "Barlow-RegularItalic": require("../../assets/fonts/Barlow/Barlow-Italic.ttf"),
  },
  { "Barlow-Medium": require("../../assets/fonts/Barlow/Barlow-Medium.ttf") },
  {
    "Barlow-MediumItalic": require("../../assets/fonts/Barlow/Barlow-MediumItalic.ttf"),
  },
  {
    "Barlow-SemiBold": require("../../assets/fonts/Barlow/Barlow-SemiBold.ttf"),
  },
  {
    "Barlow-SemiBoldItalic": require("../../assets/fonts/Barlow/Barlow-SemiBoldItalic.ttf"),
  },
  { "Barlow-Bold": require("../../assets/fonts/Barlow/Barlow-Bold.ttf") },
  {
    "Barlow-BoldItalic": require("../../assets/fonts/Barlow/Barlow-BoldItalic.ttf"),
  },
  {
    "Barlow-ExtraBold": require("../../assets/fonts/Barlow/Barlow-ExtraBold.ttf"),
  },
  {
    "Barlow-ExtraBoldItalic": require("../../assets/fonts/Barlow/Barlow-ExtraBoldItalic.ttf"),
  },
  { "Barlow-Black": require("../../assets/fonts/Barlow/Barlow-Black.ttf") },
  {
    "Barlow-BlackItalic": require("../../assets/fonts/Barlow/Barlow-BlackItalic.ttf"),
  },
  {
    "RobotoMono-Regular": require("../../assets/fonts/Roboto-Mono/RobotoMono-Regular.ttf"),
  },
];

const WEIGHT = {
  "100": "-Thin",
  "200": "-ExtraLight",
  "300": "-Light",
  "400": "-Regular",
  "500": "-Medium",
  "600": "-SemiBold",
  "700": "-Bold",
  "900": "-Black",
  thin: "-Thin",
  "extra-light": "-ExtraLight",
  light: "-Light",
  regular: "-Regular",
  medium: "-Medium",
  "semi-bold": "-SemiBold",
  bold: "-Bold",
  black: "-Black",
};

const CACHE_IMAGES = [
  require("../../assets/images/illustrations-v3/PolarBearFistUp3x.png"),
  require("../../assets/images/illustrations-v3/PolarBearHODL3x.png"),
  require("../../assets/images/illustrations-v3/PolarBearSad3x.png"),
  require("../../assets/images/illustrations-v3/stamp3x.png"),
  require("../../assets/images/bear-happyKYC3x.png"),
  require("../../assets/images/diane-sad.png"),
  require("../../assets/images/alert.png"),
  require("../../assets/images/modal-withdraw.png"),
  require("../../assets/images/monkey-on-a-laptop-illustration.png"),
  require("../../assets/images/empty-profile/empty-profile.png"),
  require("../../assets/images/icons/contacts-circle/contacts-circle.png"),
  require("../../assets/images/icons/fb-circle/fb-circle.png"),
  require("../../assets/images/icons/tw-circle/tw-circle.png"),
  require("../../assets/images/frenchy.png"),
  require("../../assets/images/mask/card-mask-transparent.png"),
  require("../../assets/images/mask/circle-mask.png"),
  require("../../assets/images/mask/dark-circle-mask.png"),
  require("../../assets/images/mask/square-mask-01.png"),
  require("../../assets/images/mask/dark-qrcode-mask3x.png"),
  require("../../assets/images/mask/dark-card-mask-transparent.png"),
  require("../../assets/images/mask/bill-mask-markers-dark.png"),
  require("../../assets/images/mask/bill-mask-markers-light.png"),
  require("../../assets/images/splashScreen-celsius-new.png"),
  require("../../assets/images/victory-bear3x.png"),
  require("../../assets/images/loyaltyIcons/star-bg3x.png"),
  require("../../assets/images/loyaltyIcons/star-icon3x.png"),
  require("../../assets/images/loyaltyIcons/reward-icon3x.png"),
  require("../../assets/images/PartnerLogos/DP.png"),
  require("../../assets/images/PartnerLogos/litecoin-foundation.png"),
  require("../../assets/images/PartnerLogos/prime-trust-llc-vector-logo.png"),
  require("../../assets/images/community/dogIllustration.png"),
  require("../../assets/images/community/dogIllustration-dark.png"),
  require("../../assets/images/community/frenchie.png"),
  require("../../assets/images/community/frenchie-dark.png"),
  `${API_URL.replace(
    "/api/v3",
    ""
  )}/profile-images/avatar/bear/profile-bear.png`,
  `${API_URL.replace("/api/v3", "")}/profile-images/avatar/cat/profile-cat.png`,
  `${API_URL.replace(
    "/api/v3",
    ""
  )}/profile-images/avatar/deer/profile-deer.png`,
  `${API_URL.replace(
    "/api/v3",
    ""
  )}/profile-images/avatar/diane/profile-diane.png`,
  `${API_URL.replace("/api/v3", "")}/profile-images/avatar/dog/profile-dog.png`,
  `${API_URL.replace("/api/v3", "")}/profile-images/avatar/fox/profile-fox.png`,
  `${API_URL.replace(
    "/api/v3",
    ""
  )}/profile-images/avatar/hyppo/profile-hyppo.png`,
  `${API_URL.replace(
    "/api/v3",
    ""
  )}/profile-images/avatar/monkeyboy/profile-monkeyboy.png`,
  `${API_URL.replace(
    "/api/v3",
    ""
  )}/profile-images/avatar/monkeygirl/profile-monkeygirl.png`,
  `${API_URL.replace(
    "/api/v3",
    ""
  )}/profile-images/avatar/shark/profile-shark.png`,
  `${API_URL.replace(
    "/api/v3",
    ""
  )}/profile-images/avatar/sheep/profile-sheep.png`,
  `${API_URL.replace(
    "/api/v3",
    ""
  )}/profile-images/avatar/unicorn/profile-unicorn.png`,
  require("../../assets/images/deer-sad.png"),
  require("../../assets/images/email-sent.png"),
  require("../../assets/images/security/securityDog/security-dog-illustration.png"),
  require("../../assets/images/security/securityDog/security-dog-illustration-dark.png"),
  require("../../assets/images/security/securityDiane/security-diane-illustration.png"),
  require("../../assets/images/security/securityDiane/security-diane-illustration-dark.png"),
  require("../../assets/images/calculator.png"),
  require("../../assets/images/security-dog.png"),
  require("../../assets/images/stacked_coins.png"),
  require("../../assets/images/maintenance/hippo-maintenance.png"),
  require("../../assets/images/icons/help-center-dark.png"),
  require("../../assets/images/icons/help-center.png"),
  require("../../assets/images/icons/support-dark.png"),
  require("../../assets/images/icons/support.png"),
  require("../../assets/images/illustrations-v3/monkey-success/monkey-success.png"),
  require("../../assets/images/checkmark-circle.png"), // to remove after modals redesign
  require("../../assets/images/checkmark-square.png"),
  require("../../assets/images/checkmark.png"),
  require("../../assets/images/coin-stack-icon.png"),
  require("../../assets/images/deposit-icn.png"),
  require("../../assets/images/gift-circle.png"),
  require("../../assets/images/icon-apply-for-a-new-loan.png"),
  require(".././../assets/images/icons/cel-dark.png"),
  require("../../assets/images/icons/cel.png"),
  require("../../assets/images/icons/crypto.png"),
  require(".././../assets/images/icons/crypto-dark.png"),
  require("../../assets/images/icons/dollars.png"),
  require("../../assets/images/icons/dollars-dark.png"),
  require("../../assets/images/icons/referrals/dog.png"),
  require("../../assets/images/loyaltyIcons/celsiusCircleIcon3x.png"),
  require("../../assets/images/loyaltyIcons/celsiusCircleIconDark3x.png"),
  require("../../assets/images/loyaltyIcons/interestCircleIcon3x.png"),
  require("../../assets/images/loyaltyIcons/interestCircleIconDark3x.png"),
  require("../../assets/images/loyaltyIcons/reward-icon3x.png"),
  require("../../assets/images/loyaltyIcons/reward-dark-icon3x.png"),
  require("../../assets/images/loyaltyIcons/star-dark-bg3x.png"),
  require("../../assets/images/loyaltyIcons/star-dark-icon3x.png"),
  require("../../assets/images/loyaltyIcons/withdraw-icon-dark3x.png"),
  require("../../assets/images/loyaltyIcons/withdraw-icon3x.png"),
  require("../../assets/images/Onboarding-Welcome3x.png"),
  require("../../assets/images/modal-alert.png"),
  require("../../assets/images/alert.png"),
  require("../../assets/images/alert-icon.png"),
  require("../../assets/images/kyc-icon.png"),
  require("../../assets/images/coins/dollar-icon.png"),
  require("../../assets/images/present-image.png"),
  require("../../assets/images/illustration-borrow-dollars_white.png"),
  require("../../assets/images/hands-in-the-air.png"),
  require("../../assets/images/money-currency-union.png"),
  require("../../assets/images/money-currency-union-dark.png"),
  require("../../assets/images/hands-in-the-air-dark.png"),
  require("../../assets/images/icon-send.png"),
  require("../../assets/images/icons/bank-wire-dark.png"),
  require("../../assets/images/icons/bank-wire-light.png"),
  require("../../assets/images/icons/credit-card-dark.png"),
  require("../../assets/images/icons/credit-card-light.png"),
  require("../../assets/images/coins/binance.png"),
  require("../../assets/images/coins/binanceusd.png"),
  require("../../assets/images/coins/tethergold.png"),
  require("../../assets/images/coins/iota.png"),
  require("../../assets/images/checkEmail.png"),
  require("../../assets/images/error.png"),
  require("../../assets/images/hodlModeStatus.png"),
];

export default {
  FONTS,
  CACHE_IMAGES,
  WEIGHT,
};
