import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage } from '../../redux/actions/chatActions';

const MessageInput = ({ selectedContact, userType }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedContact) return;

    const formData = {
      receiverId: selectedContact._id,
      receiverType: userType === 'teacher' ? 'Student' : 'Teacher',
      content,
    };

    dispatch(sendMessage(formData));
    setContent('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || !selectedContact) return;

    setFile(selectedFile);

    const formData = new FormData();
    formData.append('receiverId', selectedContact._id);
    formData.append('receiverType', userType === 'teacher' ? 'Student' : 'Teacher');
    formData.append('content', content || 'File attachment');
    formData.append('file', selectedFile);

    dispatch(sendMessage(formData));
    setFile(null);
    setContent('');
    fileInputRef.current.value = null;
  };

  const startRecording = async () => {
    if (!selectedContact) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());

        if (blob) {
          const formData = new FormData();
          formData.append('receiverId', selectedContact._id);
          formData.append('receiverType', userType === 'teacher' ? 'Student' : 'Teacher');
          formData.append('content', 'Voice message');
          formData.append('file', blob, 'voice-message.mp3');

          dispatch(sendMessage(formData));
          setAudioBlob(null);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      {isRecording && (
        <div className="mb-2 text-center text-red-500 font-medium">
          Recording: {formatTime(recordingTime)}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <label htmlFor="file-input" className="cursor-pointer">
          <svg
            className="w-6 h-6 text-gray-500 hover:text-gray-700 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          <input
            id="file-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={!selectedContact}
            accept="image/*,video/*,audio/*,.pdf"
          />
        </label>

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm"
          disabled={!selectedContact}
          aria-label="Type a message"
        />

        {isRecording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            aria-label="Stop recording"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 6h12v12H6z"
              />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
            disabled={!selectedContact}
            aria-label="Record voice message"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-11a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
        )}

        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-2 rounded-full hover:from-indigo-600 hover:to-indigo-700 disabled:bg-gray-400 transition"
          disabled={!selectedContact || (!content.trim() && !file)}
          aria-label="Send message"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;