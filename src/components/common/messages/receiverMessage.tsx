import React from 'react';
import Image from 'next/image';
import { FileText, Music } from 'lucide-react';
import logoImage from "../../../../public/images/Screenshot (573).png"; // Adjust the path as needed

const defaultProfileImage = logoImage; // Use the imported image as the default profile image

interface ReceiverMessageProps {
  message: {
    sender: {
      firstName: string;
      lastName: string;
    };
    content: string;
    time: string;
    date: Date;
    file?: string | null;
    fileType?: string | null;
  };
}

const ReceiverMessage: React.FC<ReceiverMessageProps> = ({ message }) => {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start max-w-full">
        <Image
          src={defaultProfileImage}
          alt={`${message.sender.firstName} ${message.sender.lastName}`}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="max-w-xs p-3 bg-gray-500 rounded-lg break-words" style={{ borderRadius: '20px 20px 20px 0' }}>
          <div className="text-xs font-medium"> {/* Reduced font size */}
            {`${message.sender.firstName} ${message.sender.lastName}`} 
            <span className="text-xxs text-black ml-2">{message.time}</span> {/* Further reduced time size */}
          </div>
          <div className="text-sm text-black whitespace-pre-wrap mt-2">{message.content}</div>
          {message.file && message.fileType?.startsWith('image/') && (
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
                {message.file}
              </a>
            </div>
          )}
          {message.file && message.fileType?.startsWith('audio/') && (
            <div className="flex items-center mt-2">
              <Music className="w-6 h-6 mr-2" />
              <audio controls src={message.file} className="mt-2">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiverMessage;
