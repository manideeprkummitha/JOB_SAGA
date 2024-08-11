import React, { useRef, useEffect } from 'react';
import { Paperclip, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  loading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleFileChange,
  file,
  loading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-black-2 flex-shrink-0 w-full sticky bottom-0 bg-black">
      <div className="flex items-center mx-auto rounded-full border p-2">
        <label htmlFor="fileInput" className="cursor-pointer">
          <Paperclip className="w-6 h-6 ml-2 text-gray-400 hover:text-gray-600 transition-colors" />
          <input id="fileInput" type="file" onChange={handleFileChange} className="hidden" accept="image/*,audio/*,application/pdf" />
        </label>
        {file && (
          <div className="flex items-center ml-2">
            {file.type.startsWith('image/') && (
              <Image
                src={URL.createObjectURL(file)}
                alt="Preview"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full mr-2"
              />
            )}
            {file.type === 'application/pdf' && (
              <div className="flex items-center">
                <span className="w-6 h-6 mr-2">PDF</span>
                <span>{file.name}</span>
              </div>
            )}
            {file.type.startsWith('audio/') && (
              <div className="flex items-center">
                <span className="w-6 h-6 mr-2">Audio</span>
                <span>{file.name}</span>
              </div>
            )}
          </div>
        )}
        <textarea
          ref={textareaRef}
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 mx-2 p-2 rounded-full border-none focus:outline-none focus:ring-0 resize-none overflow-hidden bg-black text-white placeholder-gray-500 transition-all duration-200 ease-in-out"
          style={{ minHeight: '40px', maxHeight: '200px' }}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded-full focus:outline-none hover:bg-blue-600 transition-all duration-200 ease-in-out"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V12H4z"></path>
            </svg>
          ) : (
            <ArrowRight className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
