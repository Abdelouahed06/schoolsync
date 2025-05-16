import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const ChatWindow = ({ selectedContact, userType }) => {
  const { conversations } = useSelector((state) => state.chat);
  const messages = selectedContact ? conversations[selectedContact._id] || [] : [];
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isSentByUser = (message) => {
    return message.senderType.toLowerCase() === userType.toLowerCase();
  };

  const renderAttachment = (attachment) => {
    if (!attachment) return null;

    const attachmentUrl = `http://localhost:5000${attachment.path}`;
    const fileName = attachment.name || 'File';
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
    const isPDF = fileExtension === 'pdf';
    const isAudio = attachment.type === 'voice' || ['mp3', 'wav'].includes(fileExtension);
    const isVideo = ['mp4', 'mov'].includes(fileExtension);

    if (isImage) {
      return (
        <div className="relative mt-2 w-[200px] sm:w-[250px]">
          <img
            src={attachmentUrl}
            alt={fileName}
            className="rounded-lg w-full h-auto object-contain border border-gray-200"
          />
          <a
            href={attachmentUrl}
            download
            className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M8 12l4 4m0 0l4-4m-4 4V4" />
            </svg>
          </a>
        </div>
      );
    } else if (isAudio) {
      return (
        <div className="mt-2 w-[200px] sm:w-[250px] bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
          <audio controls className="w-full h-8">
            <source src={attachmentUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    } else if (isVideo) {
      return (
        <div className="relative mt-2 w-[200px] sm:w-[250px]">
          <video controls className="rounded-lg w-full h-auto border border-gray-200">
            <source src={attachmentUrl} type="video/mp4" />
            Your browser does not support the video element.
          </video>
        </div>
      );
    } else if (isPDF) {
      return (
        <div className="mt-2 w-[200px] sm:w-[250px] bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" />
          </svg>
          <span className="text-gray-800 text-sm truncate flex-1">
            {fileName}
          </span>
          <a
            href={attachmentUrl}
            download
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M8 12l4 4m0 0l4-4m-4 4V4" />
            </svg>
          </a>
        </div>
      );
    } else {
      return (
        <div className="mt-2 w-[200px] sm:w-[250px] bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 shadow-sm">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m-9-3h12a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-800 text-sm truncate flex-1">
            {fileName}
          </span>
          <a
            href={attachmentUrl}
            download
            className="text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M8 12l4 4m0 0l4-4m-4 4V4" />
            </svg>
          </a>
        </div>
      );
    }
  };

  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Select a contact to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="sticky top-0 bg-gray-50 p-4 border-b border-gray-200 z-10">
        <h2 className="text-lg font-semibold text-gray-800">
          Chat with {selectedContact.firstName} {selectedContact.lastName}
          <span className="text-sm text-gray-500 ml-2">({selectedContact.type})</span>
        </h2>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        {messages.map((message, index) => {
          const showDateDivider =
            index === 0 ||
            new Date(message.sentAt).toDateString() !==
              new Date(messages[index - 1]?.sentAt).toDateString();
          const isSent = isSentByUser(message);

          return (
            <div key={message._id}>
              {showDateDivider && (
                <div className="text-center my-4">
                  <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                    {new Date(message.sentAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div
                className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div
                  className={`inline-block p-3 rounded-xl shadow-md max-w-[75%] sm:max-w-[60%] ${
                    isSent
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {message.content && message.content !== 'File attachment' && message.content !== 'Voice message' && (
                    <p className="text-sm">{message.content}</p>
                  )}
                  {renderAttachment(message.attachment)}
                  <p
                    className={`text-xs mt-1 text-right ${
                      isSent ? 'text-indigo-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.sentAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;