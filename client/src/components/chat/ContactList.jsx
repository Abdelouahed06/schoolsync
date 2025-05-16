import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getConversation } from '../../redux/actions/chatActions';

const ContactList = ({ onSelectContact, selectedContact, userType }) => {
  const dispatch = useDispatch();
  const { contacts, conversations } = useSelector((state) => state.chat);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectContact = (contact) => {
    const contactId = contact._id;
    dispatch(getConversation(contactId));
    onSelectContact(contact);
  };

  const filteredContacts = contacts.filter((contact) =>
    `${contact.firstName} ${contact.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto bg-gray-100">
      <div className="sticky top-0 bg-gray-100 p-4 border-b border-gray-200 z-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Contacts</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts..."
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
          aria-label="Search contacts"
        />
      </div>
      {filteredContacts.length === 0 ? (
        <p className="p-4 text-gray-500">No contacts found.</p>
      ) : (
        <ul className="p-2 space-y-2">
          {filteredContacts.map((contact) => {
            const conversation = conversations[contact._id] || [];
            const lastMessage = conversation[conversation.length - 1];
            const contactName = `${contact.firstName} ${contact.lastName}`;
            const profilePicUrl = contact.profilePic
              ? `http://localhost:5000${contact.profilePic}`
              : null;

            return (
              <li
                key={contact._id}
                onClick={() => handleSelectContact(contact)}
                className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${
                  selectedContact?._id === contact._id
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-white hover:bg-gray-200'
                }`}
                role="button"
                tabIndex={0}
                aria-selected={selectedContact?._id === contact._id}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSelectContact(contact);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {profilePicUrl ? (
                    <img
                      src={profilePicUrl}
                      alt={contactName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-sm">
                      {contactName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {contactName}
                    </p>
                    {lastMessage && (
                      <span className="text-xs text-gray-500">
                        {new Date(lastMessage.sentAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {lastMessage
                      ? lastMessage.content
                      : `Start chatting with ${contactName}`}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ContactList;