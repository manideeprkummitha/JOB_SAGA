'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import ContactCard from '@/components/common/messages/contactCard';
import MessageInput from '@/components/common/messages/messageInput';
import SenderMessage from '@/components/common/messages/senderMessage';
import ReceiverMessage from '@/components/common/messages/receiverMessage';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useAuth } from '@/auth/context/jwt/auth-provider';
import logoImage from "../../../../public/images/Screenshot (573).png"; // Adjust the path as needed
import SearchCard from '@/components/common/search/searchCard';

const defaultProfileImage = logoImage;

export default function Messages() {
  const { userId } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // New state for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);

  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        console.log('Fetching conversations for userId:', userId);
        const conversationsResponse = await axios.get(`http://localhost:7003/api/users/${userId}/conversations`);
        console.log("Conversations Response:", conversationsResponse);

        // Extract conversations data from the response object
        const conversations = conversationsResponse.data;

        const contactPromises = conversations.map(async (conversation: any) => {
          // Identify the receiverId from participants array
          const receiver = conversation.participants.find((participant: any) => participant.authServiceId !== userId);
          const receiverId = receiver?._id;

          if (receiverId) {
            const userResponse = await axios.get(`http://localhost:7002/api/user/${receiverId}`);
            const userDetails = userResponse.data;
            console.log("User Details for receiverId:", receiverId, userDetails);

            // Extract lastMessage and lastMessageTime
            let lastMessage = 'No messages yet...';
            let lastMessageTime = conversation.updatedAt;
            console.log("Last Message Time:", lastMessageTime);

            if (conversation.messages && conversation.messages.length > 0) {
              const lastMessageObj = conversation.messages[conversation.messages.length - 1];
              lastMessage = lastMessageObj.content;
              lastMessageTime = lastMessageObj.timestamp;
            }
            console.log("Last Message:", lastMessage);

            return {
              name: `${userDetails.user.firstName} ${userDetails.user.lastName}`,
              latestMessage: lastMessage,
              date: lastMessageTime,
              profileImage: userDetails.profileImage || defaultProfileImage,
            };
          }
        });

        const contactList = await Promise.all(contactPromises);
        setContacts(contactList.filter(Boolean)); // Filter out any undefined values
        setCurrentContact(contactList[0] || null);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // New useEffect to handle search functionality
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim()) {
        try {
          console.log('Searching for:', searchQuery);
          const response = await axios.get(`http://localhost:7002/api/user/search?query=${searchQuery}`);
          console.log('Search Results:', response.data.data);
          setSearchResults(response.data.data); // Update search results
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      } else {
        setSearchResults([]); // Clear search results if the query is empty
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
        <div className="overflow-y-auto h-full">
          {searchQuery.trim() ? (
            searchResults.length > 0 ? (
              searchResults.map((user, index) => (
                <SearchCard
                  key={index}
                  user={user} // Pass the user object directly
                  setCurrentContact={setCurrentContact}
                />
              ))
            ) : (
              <p>No search results found.</p>
            )
          ) : (
            contacts.map((contact, index) => (
              <ContactCard
                key={index}
                contact={contact}
                setCurrentContact={setCurrentContact}
                isSelected={currentContact?.name === contact.name && currentContact?.latestMessage === contact.latestMessage} // Ensure the correct contact is selected
              />
            ))
          )}
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
