// pages/messages.js

"use client";

import { useState } from 'react';

export default function Messages() {
  const [messages, setMessages] = useState([
    { sender: 'Mani Pramodh', time: '8:40 AM', text: `I'm not sure\nLet me check\nI got it\nI'll get back to you\nSoon\nVery soon\nNext week\nMaybe\nI'm not sure\nMaybe\nBye`, date: 'JUN 19, 2023' },
    // Add more messages here as needed
  ]);

  const [contacts, setContacts] = useState([
    { name: 'Malakonda Milk Dairy Pvt Ltd', type: 'company' },
    { name: 'Atlassian', type: 'sponsored', date: 'Jun 28' },
    { name: 'Franklin Tavarez', type: 'contact', date: 'Jun 20' },
    { name: 'Pradeep R kummitha', type: 'contact', date: 'Jun 19' },
    { name: 'RAUNAK BARANWAL', type: 'sponsored', date: 'Jun 17' },
    // Add more contacts here as needed
  ]);

  const [currentContact, setCurrentContact] = useState(contacts[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMessages = [
        ...messages,
        {
          sender: 'You',
          time: new Date().toLocaleTimeString(),
          text: newMessage,
          date: new Date().toLocaleDateString(),
        },
      ];
      setMessages(newMessages);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-700 p-4 bg-gray-800 overflow-hidden">
        <h2 className="text-2xl font-semibold mb-4">Messaging</h2>
        <input
          type="text"
          placeholder="Search messages"
          className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-700 text-gray-300"
        />
        <div className="overflow-y-auto h-full">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className={`mb-4 cursor-pointer ${currentContact.name === contact.name ? 'bg-gray-700' : 'hover:bg-gray-600'}`}
              onClick={() => setCurrentContact(contact)}
            >
              <div className={`flex items-center p-2 rounded ${contact.type === 'sponsored' ? 'bg-gray-600' : ''}`}>
                <div className={`w-10 h-10 bg-gray-300 rounded-full mr-3 ${contact.type === 'company' ? 'bg-red-500' : ''}`} />
                <div>
                  <div className="text-sm font-medium">{contact.name}</div>
                  {contact.date && <div className="text-xs text-gray-400">{contact.date}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="border-b border-gray-700 p-4 flex-shrink-0">
          <h2 className="text-2xl font-semibold">{currentContact.name}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-6">
              <div className="text-gray-500 text-sm mb-2">{message.date}</div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                <div>
                  <div className="text-sm font-medium">
                    {message.sender} <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <div className="text-sm whitespace-pre-line mt-2">{message.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700 bg-gray-800 flex-shrink-0">
          <textarea
            placeholder="Write a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-300 resize-none h-24"
          />
          <button
            className="mt-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
