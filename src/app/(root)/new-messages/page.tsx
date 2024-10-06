'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import ContactCard from '@/components/common/messages/contactCard';
import MessageInput from '@/components/common/messages/messageInput';
import SenderMessage from '@/components/common/messages/senderMessage';
import ReceiverMessage from '@/components/common/messages/receiverMessage';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis, Loader as LucideLoader } from "lucide-react"; // Importing LucideLoader
import { useAuth } from '@/auth/context/jwt/auth-provider';
import logoImage from "../../../../public/images/Screenshot (573).png"; // Adjust the path as needed
import SearchCard from '@/components/common/search/searchCard';

const defaultProfileImage = logoImage;

export default function Messages() {
  const { userId: authServiceId } = useAuth(); // This is the authServiceId
  const [sender_UserId, setSender_UserId] = useState<string>(''); // State to store the actual user ID (sender_UserId)
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // Control loading state for message sending
  const [fetchingMessages, setFetchingMessages] = useState(false); // Control loading state for fetching messages

  // New state for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [showSearch, setShowSearch] = useState(true); // State to control the display of search results or contact cards

  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch the actual sender_UserId (userId) based on authServiceId
  useEffect(() => {
    const fetchSenderUserId = async () => {
      try {
        const response = await axios.get(`http://localhost:7002/api/authService/user/${authServiceId}`);
        const actualUserId = response.data.user._id;
        setSender_UserId(actualUserId);
      } catch (error) {
        console.error('Error fetching sender user ID:', error);
      }
    };

    fetchSenderUserId();
  }, [authServiceId]);

  // Fetch conversations and messages
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!sender_UserId) return;

        const conversationsResponse = await axios.get(`http://localhost:7003/api/users/${authServiceId}/conversations`);
        const conversations = conversationsResponse.data;

        const contactPromises = conversations.map(async (conversation: any) => {
          const receiver = conversation.participants.find((participant: any) => participant._id !== sender_UserId);
          const receiverId = receiver?._id;

          if (receiverId) {
            const userResponse = await axios.get(`http://localhost:7002/api/user/${receiverId}`);
            const userDetails = userResponse.data;

            let lastMessage = 'No messages yet...';
            let lastMessageTime = conversation.updatedAt;

            if (conversation.messages && conversation.messages.length > 0) {
              const lastMessageObj = conversation.messages[conversation.messages.length - 1];
              lastMessage = lastMessageObj.content;
              lastMessageTime = lastMessageObj.timestamp;
            }

            return {
              receiverId: receiverId,
              conversationId: conversation._id,
              name: `${userDetails.user.firstName} ${userDetails.user.lastName}`,
              latestMessage: lastMessage,
              date: lastMessageTime,
              profileImage: userDetails.profileImage || defaultProfileImage,
              designation: userDetails.user.role || 'N/A',
            };
          }
        });

        const contactList = await Promise.all(contactPromises);
        setContacts(contactList.filter(Boolean));
        setCurrentContact(contactList[0] || null);

        if (contactList.length > 0) {
          fetchMessages(contactList[0]?.conversationId);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [sender_UserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      setFetchingMessages(true); // Show loader while fetching messages
      const response = await axios.get(`http://localhost:7003/api/conversations/${conversationId}/messages`);
      setMessages(response.data);
      scrollToBottom(); // Scroll to the bottom after loading messages
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setFetchingMessages(false); // Hide loader once fetching is done
    }
  };

  // Function to send a message
  const handleSendMessage = async () => {
    if (newMessage.trim() || file) {
      setLoading(true);
      try {
        const response = await axios.post(
          `http://localhost:7003/api/conversations/${currentContact?.conversationId}/messages`,
          {
            sender: sender_UserId,
            receiver: currentContact?.receiverId,
            content: newMessage.trim() || `File: ${file?.name}`,
          }
        );

        const newMessages = [
          ...messages,
          {
            sender: { firstName: 'You', lastName: '', _id: sender_UserId },
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
      } catch (error) {
        console.error('Error sending message:', error);
        setLoading(false);
      }
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

  // Handle user selection from search results or contact list
  const handleUserSelect = async (user: any) => {
    const existingConversation = contacts.find(
      (contact) => contact.receiverId === user._id
    );
    if (existingConversation) {
      setCurrentContact(existingConversation);
      fetchMessages(existingConversation.conversationId);
      setShowSearch(false);
    } else {
      await createNewConversation(user);
    }
  };

  // Create a new conversation with a selected user
  const createNewConversation = async (selectedUser: any) => {
    try {
      const response = await axios.post(`http://localhost:7003/api/conversations`, {
        participants: [sender_UserId, selectedUser._id],
      });

      const newConversation = {
        receiverId: selectedUser._id,
        conversationId: response.data._id,
        name: `${selectedUser.firstName} ${selectedUser.lastName}`,
        latestMessage: 'No messages yet...',
        date: new Date().toISOString(),
        profileImage: selectedUser.profileImage || defaultProfileImage,
        designation: selectedUser.role || 'N/A',
      };

      setContacts([newConversation, ...contacts]);
      setCurrentContact(newConversation);
      setMessages([]);
      setShowSearch(false);
    } catch (error) {
      console.error('Error creating new conversation:', error);
    }
  };

  // Update conversation status (star, archive, etc.)
  const updateConversationStatus = async (action: string) => {
    if (!currentContact) return;

    try {
      const response = await axios.put(`http://localhost:7003/api/conversations/${currentContact.conversationId}`, {
        action,
        userId: sender_UserId,
      });

      // Optionally, update local state if necessary
    } catch (error) {
      console.error('Error updating conversation status:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Component: Contacts and Search */}
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
                <DropdownMenuItem onClick={() => fetchConversationsByStatus('Others')}>Others</DropdownMenuItem>
                <DropdownMenuItem onClick={() => fetchConversationsByStatus('Starred')}>Starred</DropdownMenuItem>
                <DropdownMenuItem onClick={() => fetchConversationsByStatus('Archived')}>Archived</DropdownMenuItem>
                <DropdownMenuItem onClick={() => fetchConversationsByStatus('Muted')}>Muted</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <input
          type="text"
          placeholder="Search messages"
          className="w-full p-2 mb-4 border rounded"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearch(true);
          }}
        />
        <div className="overflow-y-auto h-full">
          {showSearch && searchQuery.trim() ? (
            searchResults.length > 0 ? (
              searchResults.map((user, index) => (
                <SearchCard
                  key={index}
                  user={user}
                  setCurrentContact={() => handleUserSelect(user)}
                />
              ))
            ) : (
              <p>No search results found.</p>
            )
          ) : contacts.length === 0 ? (
            <p>No conversations found.</p>
          ) : (
            contacts.map((contact, index) => (
              <ContactCard
                key={index}
                contact={contact}
                setCurrentContact={(contact) => {
                  setCurrentContact(contact);
                  fetchMessages(contact.conversationId);
                }}
                isSelected={currentContact?.name === contact.name && currentContact?.latestMessage === contact.latestMessage}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Component: Messages */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b p-4 flex-shrink-0 flex justify-between items-center">
          <div className='flex items-center'>
            <h2 className="text-xl font-semibold">{currentContact?.name}</h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <Ellipsis />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => updateConversationStatus('moveToOther')}>Move to Others</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationStatus('star')}>Star</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationStatus('archive')}>Archive</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationStatus('mute')}>Mute</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationStatus('report')}>Report This</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationStatus('delete')}>Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {fetchingMessages ? (
            <div className="flex justify-center items-center">
              <LucideLoader className="animate-spin h-6 w-6 text-gray-500" />
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index}>
                {message.sender._id === sender_UserId ? (
                  <SenderMessage message={message} />
                ) : (
                  <ReceiverMessage message={message} />
                )}
              </div>
            ))
          )}
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
