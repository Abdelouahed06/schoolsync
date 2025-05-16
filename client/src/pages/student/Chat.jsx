import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getContacts, receiveMessage } from '../../redux/actions/chatActions';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import Notification from '../../components/common/Notification';
import ContactList from '../../components/chat/ContactList';
import ChatWindow from '../../components/chat/ChatWindow';
import MessageInput from '../../components/chat/MessageInput';
import socket from '../../utils/socket';

const Chat = () => {
  const dispatch = useDispatch();
  const { userType, token } = useSelector((state) => state.auth);
  const { error } = useSelector((state) => state.chat);
  const [selectedContact, setSelectedContact] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (token) {
      socket.auth = { token };
      socket.connect();

      socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });

      socket.on('message', (message) => {
        dispatch(receiveMessage(message));
      });

      socket.on('connect_error', (err) => {
        console.error('Socket.IO connection error:', err.message);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [token, dispatch]);

  useEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          expanded ? 'md:ml-64' : 'md:ml-16'
        }`}
      >
        <Header expanded={expanded} setExpanded={setExpanded} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 pt-20 md:pt-16">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Chat
          </h1>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)]">
            <div className="flex flex-col md:flex-row h-full">
              <div
                className={`w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-200 ${
                  selectedContact ? 'hidden md:block' : 'block'
                }`}
              >
                <ContactList
                  onSelectContact={setSelectedContact}
                  selectedContact={selectedContact}
                  userType={userType}
                />
              </div>
              <div
                className={`flex-1 flex flex-col ${
                  selectedContact ? 'block' : 'hidden md:flex'
                }`}
              >
                {selectedContact ? (
                  <>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="md:hidden p-4 text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Back to Contacts
                    </button>
                    <ChatWindow selectedContact={selectedContact} userType={userType} />
                    <MessageInput selectedContact={selectedContact} userType={userType} />
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Select a contact to start chatting
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Notification />
    </div>
  );
};

export default Chat;