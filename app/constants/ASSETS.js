const FONTS = [
  { 'barlow-thin': require('../../assets/fonts/Barlow/Barlow-Thin.ttf') },
  { 'barlow-thin-italic': require('../../assets/fonts/Barlow/Barlow-ThinItalic.ttf') },
  { 'barlow-extra-light': require('../../assets/fonts/Barlow/Barlow-ExtraLight.ttf') },
  { 'barlow-extra-light-italic': require('../../assets/fonts/Barlow/Barlow-ExtraLightItalic.ttf') },
  { 'barlow-light': require('../../assets/fonts/Barlow/Barlow-Light.ttf') },
  { 'barlow-light-italic': require('../../assets/fonts/Barlow/Barlow-LightItalic.ttf') },
  { 'barlow-regular': require('../../assets/fonts/Barlow/Barlow-Regular.ttf') },
  // { 'barlow-regular-italic': require('../../assets/fonts/Barlow/Barlow-RegularItalic.ttf') },
  { 'barlow-medium': require('../../assets/fonts/Barlow/Barlow-Medium.ttf') },
  { 'barlow-medium-italic': require('../../assets/fonts/Barlow/Barlow-MediumItalic.ttf') },
  { 'barlow-semi-bold': require('../../assets/fonts/Barlow/Barlow-SemiBold.ttf') },
  { 'barlow-semi-bold-italic': require('../../assets/fonts/Barlow/Barlow-SemiBoldItalic.ttf') },
  { 'barlow-bold': require('../../assets/fonts/Barlow/Barlow-Bold.ttf') },
  { 'barlow-bold-italic': require('../../assets/fonts/Barlow/Barlow-BoldItalic.ttf') },
  { 'barlow-extra-bold': require('../../assets/fonts/Barlow/Barlow-ExtraBold.ttf') },
  { 'barlow-extra-bold-italic': require('../../assets/fonts/Barlow/Barlow-ExtraBoldItalic.ttf') },
  { 'barlow-black': require('../../assets/fonts/Barlow/Barlow-Black.ttf') },
  { 'barlow-black-italic': require('../../assets/fonts/Barlow/Barlow-BlackItalic.ttf') },

];

const WEIGHT = {
  

  '100': { regular: 'barlow-thin', italic: 'barlow-thin-italic'},
  '200': { regular: 'barlow-extra-light', italic: 'barlow-extra-light-italic' },
  '300': { regular: 'barlow-light', italic: 'barlow-light-italic'},
  '400': { regular: 'barlow-regular', italic: 'barlow-regular-italic'},
  '500': { regular: 'barlow-medium', italic: 'barlow-medium-italic'},
  '600': { regular: 'barlow-semi-bold', italic: 'barlow-bold-italic'},
  '700': { regular: 'barlow-bold', italic: 'barlow-bold-italic'},
  '900': { regular: 'black', italic: 'black-italic'}
};

const FONT = {

  Thin: 'barlow-thin',
  ThinItalic: "barlow-thin-italic",
  ExtraLight: 'barlow-extra-light',
  ExtraLightItalic:'barlow-extra-light-italic',
  Light:'barlow-light',
  LightItalic:'barlow-light-italic',
  Regular:'barlow-regular',
  RegularItalic:'barlow-regular-italic',
  Medium:'barlow-medium',
  MediumItalic:'barlow-medium-italic',
  SemiBold:'barlow-semi-bold',
  SemiBoldItalic:'barlow-semi-bold-italic',
  Bold: 'barlow-bold',
  BoldItalic:'barlow-bold-italic',
  ExtraBold:'barlow-extra-bold',
  ExtraBoldItalic:'barlow-extra-bold-italic',
  Black: 'barlow-black',
  BlackItalic: 'barlow-black-italic',
}

const CACHE_IMAGES = [
  require('../../assets/images/illustrations-v3/PolarBearFistUp3x.png'),
  require('../../assets/images/illustrations-v3/PolarBearHODL3x.png'),
  require('../../assets/images/illustrations-v3/PolarBearSad3x.png'),
  // require('../../assets/images/icons/celsius_symbol_white.png'),
  // require('../../assets/images/icons/animated-spinner.gif'),
  // require('../../assets/images/icons/white_spinner.gif'),
  // require('../../assets/images/icons/icon-check.png'),
  // require('../../assets/images/icons/camera-flip.png'),
  // require('../../assets/images/two-thumbs-up.png'),
  // require('../../assets/images/bubble-pointer.png'),
  // require('../../assets/images/avatar-mouse-girl.jpg'),
  // require('../../assets/images/avatar-bear.jpg'),
  // require('../../assets/images/avatar-cat.jpg'),
  // require('../../assets/images/avatar-deer.jpg'),
  // require('../../assets/images/avatar-girl-dog.jpg'),
  // require('../../assets/images/avatar-hippo.jpg'),
  // require('../../assets/images/avatar-monkey.jpg'),
  // require('../../assets/images/avatar-monkey-girl.jpg'),
  // require('../../assets/images/avatar-sheep.jpg'),
  // require('../../assets/images/camera-mask-circle.png'),
  // require('../../assets/images/camera-mask-document.png'),
  // require('../../assets/images/phone_doggirl3x.png'),
  // require('../../assets/images/bear-NoKYC3x.png'),
  // require('../../assets/images/bear-happyKYC3x.png'),
  // require('../../assets/images/frenchy.png'),
  // require('../../assets/images/interest-illu.png'),
  // require('../../assets/images/deerTransactionHistory.png'),
  // require('../../assets/images/illuNoKYC3x.png'),
  // require('../../assets/images/OfflineMode/deer-tangled3x.png'),
  // require('../../assets/images/Onboarding_background3x.png'),
  // require('../../assets/images/interactivePart3x.png'),
  // require('../../assets/images/Conversation3x.png'),
  // require('../../assets/images/security_dog3x.png'),
  // require('../../assets/images/Group_232-3x.png'),
  // require('../../assets/images/authSuccess3x.png'),
  // require('../../assets/images/hodl-bear.png'),
  // require('../../assets/images/7pie.png'),
  // require('../../assets/images/9pie.png'),
  // require('../../assets/images/12pie.png'),
  // require('../../assets/images/diane-with-laptop3x.png'),
  // require('../../assets/images/squirrel-modal3x.png'),
  // require('../../assets/images/celsius-logo3x.png'),
  require('../../assets/images/bear-happyKYC3x.png'),
  require('../../assets/images/deerTransactionHistory.png'),
  require('../../assets/images/illuNoKYC3x.png'),
  require('../../assets/images/OfflineMode/deer-tangled3x.png'),
  require('../../assets/images/diane-sad.png'),
  require('../../assets/images/empty-profile/empty-profile.png'),
  require('../../assets/images/icons/contacts-circle/contacts-circle.png'),
  require('../../assets/images/icons/fb-circle/fb-circle.png'),
  require('../../assets/images/icons/tw-circle/tw-circle.png'),
];

export default {
  FONTS,
  CACHE_IMAGES,
  WEIGHT,
  FONT
}
