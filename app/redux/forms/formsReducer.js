import ACTIONS from "../../constants/ACTIONS";

/**
 * TODO make it a function add JSDoc & desc for return
 */
const initialState = {
  formData: {},
  formErrors: {},
  activeField: null,
};

export default function formsReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_FORM_FIELD:
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };

    case ACTIONS.UPDATE_FORM_FIELDS:
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.fields,
        },
      };

    case ACTIONS.INIT_FORM:
      return {
        ...state,
        formData: action.formData,
      };

    case ACTIONS.CLEAR_FORM:
      return {
        ...state,
        formData: {},
      };

    case ACTIONS.SET_FORM_ERRORS:
      return {
        ...state,
        formErrors: {
          ...state.formErrors,
          ...action.formErrors,
        },
      };

    case ACTIONS.CLEAR_FORM_ERRORS:
      return {
        ...state,
        formErrors: {},
      };

    case ACTIONS.SET_ACTIVE_SCREEN:
      return {
        ...state,
        formData: {
          ...state.formData,
          activeSearch: false,
        },
      };
    case ACTIONS.SET_ACTIVE_FIELD:
      return {
        ...state,
        activeField: action.activeField,
      };
    default:
      return { ...state };
  }
}
