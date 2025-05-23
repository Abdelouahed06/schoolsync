import api from '../../utils/api';
import { toast } from 'react-toastify';

// Action Types
export const GET_CONTACTS_SUCCESS = 'GET_CONTACTS_SUCCESS';
export const GET_CONTACTS_FAIL = 'GET_CONTACTS_FAIL';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAIL = 'SEND_MESSAGE_FAIL';
export const GET_CONVERSATION_SUCCESS = 'GET_CONVERSATION_SUCCESS';
export const GET_CONVERSATION_FAIL = 'GET_CONVERSATION_FAIL';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

// Get Contacts
export const getContacts = () => async (dispatch) => {
  try {
    const res = await api.get('/messages/contacts');
    dispatch({ type: GET_CONTACTS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: GET_CONTACTS_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch contacts',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch contacts');
  }
};

// Send Message
export const sendMessage = (formData) => async (dispatch, getState) => {
  try {
    const isFormData = formData instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const res = await api.post('/messages/send', formData, config);
    
    const { user } = getState().auth;
    
    const messageWithSender = {
      ...res.data.data,
      senderId: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      },
      sentAt: new Date().toISOString(),
      read: false
    };
    
    console.log('Sending message to store:', messageWithSender);
    dispatch({ type: SEND_MESSAGE_SUCCESS, payload: messageWithSender });
    toast.success('Message sent successfully!');
  } catch (error) {
    console.error('Error sending message:', error);
    dispatch({
      type: SEND_MESSAGE_FAIL,
      payload: error.response?.data?.message || 'Failed to send message',
    });
    toast.error(error.response?.data?.message || 'Failed to send message');
  }
};

// Get Conversation
export const getConversation = (contactId, page = 1, limit = 20) => async (dispatch, getState) => {
  try {
    const res = await api.get(`/messages/${contactId}?page=${page}&limit=${limit}`);
    console.log('Fetched conversation:', { contactId, messages: res.data });
    
    const { user } = getState().auth;
    
    const processedMessages = res.data.map(message => ({
      ...message,
      senderId: message.senderId._id === user._id 
        ? { _id: user._id, firstName: user.firstName, lastName: user.lastName }
        : message.senderId,
      sentAt: message.sentAt || new Date().toISOString(),
      read: message.read || false
    }));
    
    dispatch({ 
      type: GET_CONVERSATION_SUCCESS, 
      payload: { 
        contactId, 
        messages: processedMessages 
      } 
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    dispatch({
      type: GET_CONVERSATION_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch conversation',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch conversation');
  }
};

export const receiveMessage = (message) => (dispatch) => {
  console.log('Received message in action:', message);
  dispatch({ type: RECEIVE_MESSAGE, payload: message });
};