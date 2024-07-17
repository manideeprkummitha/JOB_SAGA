"use client";

import { useState } from 'react';
import { Ellipsis, ArrowRight, Paperclip, FileText, Music } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const defaultProfileImage = "path/to/default/profile/image.png"; // Set the path to your default profile image

export default function Messages() {
  const [messages, setMessages] = useState([
    { sender: 'Mani Pramodh', time: '8:40 AM', text: `I'm not sure\nLet me check\nI got it`, date: new Date(2023, 5, 19) },
    { sender: 'Mani Pramodh', time: '8:40 AM', text: `How about today?`, date: new Date() },
  ]);

  const [contacts, setContacts] = useState([
    { name: 'Malakonda Milk Dairy Pvt Ltd', date: 'Jun 17', latestMessage: 'Latest message here...', profileImage: null },
    { name: 'Atlassian', date: 'Jun 28', latestMessage: 'Latest message here...', profileImage: null },
    // ... add more contacts
  ]);

  const [currentContact, setCurrentContact] = useState(contacts[0]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() || file) {
      setLoading(true);

      setTimeout(() => {
        const newMessages = [
          ...messages,
          {
            sender: 'You',
            time: new Date().toLocaleTimeString(),
            text: newMessage.trim() || `File: ${file.name}`,
            date: new Date(),
            file: file ? URL.createObjectURL(file) : null,
            fileType: file ? file.type : null,
          },
        ];

        setMessages(newMessages);
        setLoading(false);
        setNewMessage('');
        setFile(null);
      }, 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "TODAY";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "YESTERDAY";
    } else {
      return format(date, 'MMMM dd, yyyy');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r p-4 overflow-hidden">
        <div className='flex justify-between'>
          <h2 className="text-xl font-semibold mb-4">Messaging</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <Ellipsis />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>Focused</DropdownMenuItem>
                <DropdownMenuItem>Others</DropdownMenuItem>
                <DropdownMenuItem>Archived</DropdownMenuItem>
                <DropdownMenuItem>Spam</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <input
          type="text"
          placeholder="Search messages"
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="overflow-y-auto h-full">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-md hover:bg-gray-200"
              onClick={() => setCurrentContact(contact)}
            >
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center">
                  <img
                    src={contact.profileImage || defaultProfileImage}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="text-sm font-medium">{contact.name}</div>
                    <div className="text-xs text-gray-400 truncate w-48">{contact.latestMessage}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{contact.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b p-4 flex-shrink-0 flex justify-between items-center">
          <div className='flex items-center'>
            <h2 className="text-xl font-semibold">{currentContact.name}</h2>
            <span className="text-sm ml-2">CEO, managing director</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <Ellipsis />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuItem>Others</DropdownMenuItem>
                <DropdownMenuItem>Spam</DropdownMenuItem>
                <DropdownMenuItem>Mute</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-6">
              {index === 0 || formatDate(new Date(messages[index - 1].date)) !== formatDate(new Date(message.date)) ? (
                <div className="text-center text-gray-500 text-sm mb-2">{formatDate(new Date(message.date))}</div>
              ) : null}
              <div className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-start">
                  {message.sender !== 'You' && (
                    <img
                      src={defaultProfileImage}
                      alt={message.sender}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  )}
                  <div className={`max-w-sm p-3 rounded-lg ${message.sender === 'You' ? 'bg-blue-100' : 'bg-gray-100'}`}
                       style={{ borderRadius: message.sender === 'You' ? '20px 20px 0 20px' : '20px 20px 20px 0' }}>
                    <div className={`text-sm font-medium ${message.sender === 'You' ? 'text-right' : ''}`}>
                      {message.sender} <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <div className="text-sm text-black whitespace-pre-line mt-2">{message.text}</div>
                    {message.file && message.fileType.startsWith('image/') && (
                      <img
                        src={message.file}
                        alt="Uploaded"
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
                    <img
                      src={defaultProfileImage}
                      alt="You"
                      className="w-10 h-10 rounded-full ml-3"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex-shrink-0 w-full">
          <div className="flex items-center mx-auto rounded-full border p-2">
            <label htmlFor="fileInput" className="cursor-pointer">
              <Paperclip className="w-6 h-6 ml-2" />
              <input id="fileInput" type="file" onChange={handleFileChange} className="hidden" accept="image/*,audio/*,application/pdf" />
            </label>
            {file && (
              <div className="flex items-center ml-2">
                {file.type.startsWith('image/') && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-10 h-10 rounded-full mr-2"
                  />
                )}
                {file.type === 'application/pdf' && (
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 mr-2" />
                    <span>{file.name}</span>
                  </div>
                )}
                {file.type.startsWith('audio/') && (
                  <div className="flex items-center">
                    <Music className="w-6 h-6 mr-2" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            )}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 mx-2 p-2 rounded-full border-none focus:outline-none focus:ring-0"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="bg-blue-500 text-white p-2 rounded-full focus:outline-none"
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
      </div>
    </div>
  );
}
