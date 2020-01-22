import ACTIONS from "../../constants/ACTIONS";

const initialState = {
  contacts: [],
};

export default function contactsReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.GET_CONNECTED_CONTACTS_SUCCESS:
      return {
        ...state,
        contacts: [...action.contacts.friendsWithApp],
      };

    default:
      return { ...state };
  }
}
