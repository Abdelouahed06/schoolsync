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
export const sendMessage = (formData) => async (dispatch) => {
  try {
    const isFormData = formData instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const res = await api.post('/messages/send', formData, config);
    dispatch({ type: SEND_MESSAGE_SUCCESS, payload: res.data.data });
    toast.success('Message sent successfully!');
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_FAIL,
      payload: error.response?.data?.message || 'Failed to send message',
    });
    toast.error(error.response?.data?.message || 'Failed to send message');
  }
};

// Get Conversation
export const getConversation = (contactId, page = 1, limit = 20) => async (dispatch) => {
  try {
    const res = await api.get(`/messages/${contactId}?page=${page}&limit=${limit}`);
    dispatch({ type: GET_CONVERSATION_SUCCESS, payload: { contactId, messages: res.data } });
  } catch (error) {
    dispatch({
      type: GET_CONVERSATION_FAIL,
      payload: error.response?.data?.message || 'Failed to fetch conversation',
    });
    toast.error(error.response?.data?.message || 'Failed to fetch conversation');
  }
};

export const receiveMessage = (message) => (dispatch) => {
  dispatch({ type: RECEIVE_MESSAGE, payload: message });
};