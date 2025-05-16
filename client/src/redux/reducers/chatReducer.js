import {
  GET_CONTACTS_SUCCESS,
  GET_CONTACTS_FAIL,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  GET_CONVERSATION_SUCCESS,
  GET_CONVERSATION_FAIL,
  RECEIVE_MESSAGE,
} from '../actions/chatActions';

const initialState = {
  contacts: [],
  conversations: {},
  error: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTACTS_SUCCESS:
      return { ...state, contacts: action.payload, error: null };
    case GET_CONTACTS_FAIL:
      return { ...state, error: action.payload };
    case SEND_MESSAGE_SUCCESS: {
      const { receiverId, senderId } = action.payload;
      const contactId = receiverId;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [contactId]: [
            ...(state.conversations[contactId] || []),
            action.payload,
          ],
        },
        error: null,
      };
    }
    case SEND_MESSAGE_FAIL:
      return { ...state, error: action.payload };
    case GET_CONVERSATION_SUCCESS:
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.payload.contactId]: action.payload.messages,
        },
        error: null,
      };
    case GET_CONVERSATION_FAIL:
      return { ...state, error: action.payload };
    case RECEIVE_MESSAGE: {
      const { senderId, receiverId } = action.payload;
      const contactId = senderId;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [contactId]: [
            ...(state.conversations[contactId] || []),
            action.payload,
          ],
        },
        error: null,
      };
    }
    default:
      return state;
  }
};

export default chatReducer;