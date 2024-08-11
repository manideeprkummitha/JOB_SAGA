'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { messagingServiceAxios } from '@/utils/axios';
import ContactCard from '@/components/common/messages/contactCard';
import MessageInput from '@/components/common/messages/messageInput';
import SenderMessage from '@/components/common/messages/senderMessage';
import ReceiverMessage from '@/components/common/messages/receiverMessage';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useAuth } from '@/auth/context/jwt/auth-provider';
import logoImage from "../../../../public/images/Screenshot (573).png"; // Adjust the path as needed
import { format } from 'date-fns';

const defaultProfileImage = logoImage; // Use the imported image as the default profile image

interface Contact {
  name: string;
  date: string;
  latestMessage: string;
  profileImage: string | null;
}

const dummyContacts: Contact[] = [
  { name: 'Malakonda Milk Dairy Pvt Ltd', date: 'Jun 17', latestMessage: 'Latest message here...', profileImage: null },
  { name: 'Atlassian', date: 'Jun 28', latestMessage: 'Latest message here...', profileImage: null },
  { name: 'Google', date: 'Jul 01', latestMessage: 'Latest message here...', profileImage: null },
  { name: 'Facebook', date: 'Jul 05', latestMessage: 'Latest message here...', profileImage: null },
  { name: 'Amazon', date: 'Jul 10', latestMessage: 'Latest message here...', profileImage: null },
  { name: 'Netflix', date: 'Jul 15', latestMessage: 'Latest message here...', profileImage: null },
];

export default function Messages() {
  const { userId } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>(dummyContacts);
  const [currentContact, setCurrentContact] = useState<Contact | null>(dummyContacts[0]);
  const [messages, setMessages] = useState([
    { sender: 'Mani Pramodh', time: '8:40 AM', text: `I'm not sure\nLet me check\nI got it`, date: new Date(2023, 5, 19) },
    { sender: 'Mani Pramodh', time: '8:40 AM', text: `How about today?`, date: new Date() },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() || file) {
      setLoading(true);

      setTimeout(() => {
        const newMessages = [
          ...messages,
          {
            sender: 'You',
            time: new Date().toLocaleTimeString(),
            text: newMessage.trim() || `File: ${file!.name}`,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const formatDate = (date: Date) => {
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
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/3 border-r p-4 overflow-hidden">
        <div className='flex justify-between mb-4'>
          <h2 className="text-xl font-semibold m-0">Messaging</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='items-center'>
                <Ellipsis />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>Focused</DropdownMenuItem>
                <DropdownMenuItem>Starred</DropdownMenuItem>
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
          {contacts.slice(0, 5).map((contact, index) => (
            <ContactCard key={index} contact={contact} setCurrentContact={setCurrentContact} />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b p-4 flex-shrink-0 flex justify-between items-center">
          <div className='flex items-center'>
            <h2 className="text-xl font-semibold">{currentContact?.name}</h2>
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
            <div key={index}>
              {index === 0 || formatDate(new Date(messages[index - 1].date)) !== formatDate(new Date(message.date)) ? (
                <div className="text-center text-black-500 text-sm mb-2">{formatDate(new Date(message.date))}</div>
              ) : null}
              {message.sender === 'You' ? (
                <SenderMessage message={message} />
              ) : (
                <ReceiverMessage message={message} />
              )}
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          handleFileChange={handleFileChange}
          file={file}
          loading={loading}
        />
      </div>
    </div>
  );
}
