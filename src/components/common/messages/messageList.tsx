// components/common/messages/MessageList.js
import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { FileText, Music } from "lucide-react";
import logoImage from "../../../../public/images/Screenshot (573).png"; // Adjust the path as needed

const defaultProfileImage = logoImage; // Use the imported image as the default profile image

const formatDate = (date) => {
  if (!date) {
    console.error('Invalid date:', date);
    return 'Invalid Date';
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    console.error('Invalid parsed date:', parsedDate);
    return 'Invalid Date';
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (parsedDate.toDateString() === today.toDateString()) {
    return "TODAY";
  } else if (parsedDate.toDateString() === yesterday.toDateString()) {
    return "YESTERDAY";
  } else {
    return format(parsedDate, 'MMMM dd, yyyy');
  }
};

const MessageList = ({ messages }) => (
  <div className="flex-1 overflow-y-auto p-4">
    {messages.map((message, index) => (
      <div key={index} className="mb-6">
        {index === 0 || formatDate(messages[index - 1].date) !== formatDate(message.date) ? (
          <div className="text-center text-black-500 text-sm mb-2">{formatDate(message.date)}</div>
        ) : null}
        <div className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
          <div className="flex items-start">
            {message.sender !== 'You' && (
              <Image
                src={defaultProfileImage}
                alt={message.sender}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div className={`max-w-sm p-3 rounded-lg ${message.sender === 'You' ? 'bg-blue-500' : 'bg-gray-500'}`}
                 style={{ borderRadius: message.sender === 'You' ? '20px 20px 0 20px' : '20px 20px 20px 0' }}>
              <div className={`text-sm font-medium ${message.sender === 'You' ? 'text-right' : ''}`}>
                {message.sender} <span className="text-xs text-black ml-2">{message.time}</span>
              </div>
              <div className="text-sm text-black whitespace-pre-line mt-2">{message.text}</div>
              {message.file && message.fileType.startsWith('image/') && (
                <Image
                  src={message.file}
                  alt="Uploaded"
                  width={200}
                  height={200}
                  className="mt-2 max-w-xs rounded-lg cursor-pointer"
                  onClick={() => window.open(message.file, '_blank')}
                />
              )}
              {message.file && message.fileType === 'application/pdf' && (
                <div className="flex items-center mt-2">
                  <FileText className="w-6 h-6 mr-2" />
                  <a href={message.file} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    {message.file.name}
                  </a>
                </div>
              )}
              {message.file && message.fileType.startsWith('audio/') && (
                <div className="flex items-center mt-2">
                  <Music className="w-6 h-6 mr-2" />
                  <audio controls src={message.file} className="mt-2">
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
            {message.sender === 'You' && (
              <Image
                src={defaultProfileImage}
                alt="You"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full ml-3"
              />
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default MessageList;
