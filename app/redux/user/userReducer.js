import ACTIONS from "../../constants/ACTIONS";
import { mapProfile } from "../../utils/user-util";

/**
 * TODO make it a function add JSDoc & desc for return
 */
const initialState = {
  profile: {
    profile_picture: null,
  },

  // TODO move to userDataReducer
  appSettings: {
    theme: "light",
    activeHodlMode: undefined,
  },

  bankAccountInfo: null, // TODO move to userDataReducer
};

export default (state = initialState, action) => {
  let profile;
  switch (action.type) {
    case ACTIONS.LOGIN_USER_SUCCESS:
    case ACTIONS.REGISTER_USER_SUCCESS:
    case ACTIONS.REGISTER_USER_FACEBOOK_SUCCESS:
    case ACTIONS.REGISTER_USER_GOOGLE_SUCCESS:
    case ACTIONS.REGISTER_USER_TWITTER_SUCCESS:
    case ACTIONS.LOGIN_USER_GOOGLE_SUCCESS:
    case ACTIONS.LOGIN_USER_FACEBOOK_SUCCESS:
    case ACTIONS.LOGIN_USER_TWITTER_SUCCESS:
    case ACTIONS.GET_USER_PERSONAL_INFO_SUCCESS:
    case ACTIONS.UPDATE_USER_PERSONAL_INFO_SUCCESS:
    case ACTIONS.GET_USER_TAXPAYER_INFO_SUCCESS:
      profile = mapProfile(action.personalInfo || action.user);
      return {
        ...state,
        profile: {
          ...state.profile,
          ...profile,
          ...action.taxPayerInfo,
        },
      };

    case ACTIONS.UPDATE_USER_ADDRESS_INFO_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          country: action.addressInfo.address.country,
          ...action.addressInfo,
        },
      };
    case ACTIONS.UPDATE_USER_TAXPAYER_INFO_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.taxpayerInfo,
        },
      };

    case ACTIONS.UPLOAD_PLOFILE_IMAGE_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          profile_picture: action.image,
        },
      };

    case ACTIONS.GET_INDIVIDUAL_LINK_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          individual_referral_link: action.link,
        },
      };

    case ACTIONS.GET_LINKED_BANK_ACCOUNT_SUCCESS:
      return {
        ...state,
        bankAccountInfo: {
          ...action.bankAccountInfo,
        },
      };

    case ACTIONS.SET_APP_SETTINGS_SUCCESS:
    case ACTIONS.GET_APP_SETTINGS_SUCCESS:
      return {
        ...state,
        appSettings: {
          ...state.appSettings,
          ...action.userAppData,
        },
      };

    case ACTIONS.GET_MEMBER_STATUS_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          celsius_member: action.isNewMember || state.profile.celsius_member,
        },
      };

    case ACTIONS.SET_PIN_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          has_pin: true,
        },
      };

    case ACTIONS.TWITTER_GET_ACCESS_TOKEN:
      return {
        ...state,
        profile: {
          ...state.profile,
          twitter_oauth_token: action.twitter_tokens.oauth_token,
          twitter_oauth_secret: action.twitter_tokens.oauth_token_secret,
        },
      };

    case ACTIONS.SET_HODL_PROPS:
      return {
        ...state,
        appSettings: {
          ...state.appSettings,
          activeHodlMode: action.activeHodlMode,
        },
      };

    default:
      return state;
  }
};
