'use client'

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';

// Importing custom components for various parts of the messaging interface
import ContactCard from '@/components/common/messages/contactCard';
import MessageInput from '@/components/common/messages/messageInput';
import SenderMessage from '@/components/common/messages/senderMessage';
import ReceiverMessage from '@/components/common/messages/receiverMessage';
import SearchCard from '@/components/common/search/searchCard';

// Importing authentication context to access the user's ID and access token
import { useAuth } from '@/auth/context/jwt/auth-provider';

// Importing UI components
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis, Loader as LucideLoader, X } from "lucide-react"; // Importing loader for indicating loading states
import logoImage from '../../../../public/images/Screenshot (573).png'; // Adjust the path to your image if necessary
import { Input } from '@/components/ui/input';

import useDebounce from '@/hooks/useDebounce';


const defaultProfileImage = logoImage; // Setting a default profile image

// TypeScript types for messages and contacts
type Message = {
  sender: { _id: string; firstName: string; lastName: string };
  receiver: { _id: string; firstName: string; lastName: string } | null;
  content: string;
  conversationId: string;
  time: string;
  date: Date;
  imageUrl?: string | null; // Optional image URL for messages that include an image
  file?: string | null; // Optional file URL (for attachments other than images)
  fileType?: string | null; // Optional file type (e.g., 'image/png')
};

type Contact = {
  receiverId: string;
  conversationId: string;
  name: string;
  latestMessage: string;
  date: string;
  profileImage: string;
  designation: string;
};

export default function Messages() {
  // Destructuring userId and accessToken from authentication context
  const { userId: authServiceId, accessToken } = useAuth(); 
  console.log('accessToken:', accessToken);

  // Defining state variables
  const [sender_UserId, setSender_UserId] = useState<string>(''); // User ID of the message sender
  const [contacts, setContacts] = useState<Contact[]>([]); // List of contacts (conversations)
  const [currentContact, setCurrentContact] = useState<Contact | null>(null); // Currently selected contact
  const [messages, setMessages] = useState<Message[]>([]); // List of messages for the current conversation
  const [newMessage, setNewMessage] = useState<Message['content']>(''); // New message content
  const [file, setFile] = useState<File | null>(null); // File attachment (if any)
  const [loading, setLoading] = useState(false); // Loading state for sending messages
  const [fetchingMessages, setFetchingMessages] = useState(false); // Loading state for fetching messages
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null); // WebSocket connection
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null); // To store the conversation ID directly

  // States related to search functionality in the contact list
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [showSearch, setShowSearch] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Reference to the bottom of the message list to scroll when new messages are added
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the message list smoothly
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const RECONNECT_INTERVAL = 5000;

  // Fetch the actual sender_UserId (userId) based on the provided authServiceId.
  // This maps the user's authentication service ID to the internal user ID for further operations.
  useEffect(() => {
    const fetchSenderUserId = async () => {
      try {
        // Fetch user details from the Auth Service based on the authServiceId
        const response = await axios.get(`http://localhost:7002/api/authService/user/${authServiceId}`);
        const actualUserId = response.data.user._id; // Extract the actual user ID
        setSender_UserId(actualUserId); // Store it in the state
         // Add console log here to check if the sender_UserId is set correctly
      console.log('Setting sender_UserId:', actualUserId);
      } catch (error) {
        console.error('Error fetching sender user ID:', error);
      }
    };

    // Fetch the user ID when the authServiceId is available
    fetchSenderUserId();
  }, [authServiceId]);

  // Establish WebSocket connection when sender_UserId becomes available
useEffect(() => {
  if (sender_UserId) {

    let ws: WebSocket | null = null;
    let reconnectTimer : NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      ws = new WebSocket(`ws://localhost:7007?userId=${sender_UserId}`);
      setWebSocket(ws);

      ws.onopen = () => {
        console.log('WebSocket connection opened');
        if(reconnectTimer) {
          clearTimeout(reconnectTimer);
        }
      };

      // Handle incoming messages
      ws.onmessage = async(event) =>{
        console.log('Received message from WebSocket:', event.data);
        const data = JSON.parse(event.data);
        handleIncomingMessage(data);
      }

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed.Attempting to reconnect...');
        if(reconnectTimer) clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(connectWebSocket, RECONNECT_INTERVAL);
      };
    };

    connectWebSocket();

    // Clean up WebSocket connection on component unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };

    // Handle incoming messages from WebSocket
    // ws.onmessage = async (event) => {
    //   console.log('Received message from WebSocket:', event.data);
    //   const data = JSON.parse(event.data);
    
    //   if (data.type === 'newMessage') {
    //     const receivedConversationId = data.conversationId.toString();
    //     const currentConversationId = currentContact?.conversationId?.toString();
    
    //     console.log('Received conversation ID:', receivedConversationId);
    //     console.log('Current conversation ID:', currentConversationId);
    
    //     // Check if the message belongs to the current conversation based on conversation ID
    //     if (receivedConversationId === currentConversationId) {
    //       console.log('New message belongs to the current conversation:', data);
    
    //       // Set sender and receiver names
    //       let senderName = 'You';
    //       let receiverName = currentContact?.name || 'Receiver';
    
    //       if (data.sender !== sender_UserId) {
    //         try {
    //           const senderResponse = await axios.get(`http://localhost:7002/api/user/${data.sender}`);
    //           senderName = `${senderResponse.data.user.firstName} ${senderResponse.data.user.lastName}`;
    //         } catch (error) {
    //           console.error('Error fetching sender details:', error);
    //         }
    //       }
    
    //       if (data.receiver !== sender_UserId) {
    //         try {
    //           const receiverResponse = await axios.get(`http://localhost:7002/api/user/${data.receiver}`);
    //           receiverName = `${receiverResponse.data.user.firstName} ${receiverResponse.data.user.lastName}`;
    //         } catch (error) {
    //           console.error('Error fetching receiver details:', error);
    //         }
    //       }
    
    //       // Add the received message to the messages state
    //       setMessages((prevMessages) => [
    //         ...prevMessages,
    //         {
    //           sender: { _id: data.sender, firstName: senderName, lastName: '' },
    //           receiver: { _id: data.receiver, firstName: receiverName, lastName: '' },
    //           content: data.content,
    //           conversationId: data.conversationId,
    //           time: new Date().toLocaleTimeString(),
    //           date: new Date(),
    //           imageUrl: data.imageUrl || null,
    //           file: data.file || null,
    //           fileType: data.fileType || null,
    //         },
    //       ]);
    //       scrollToBottom();
    //     } else {
    //       console.log('Received message does not match the current conversation:', data);
    //     }
    //   }
    // };
  
  }
}, [sender_UserId]);

const handleIncomingMessage = async (data: any) => {
  console.log('Current state of currentConversationId:', currentConversationId);

  if (data.type === 'newMessage') {
    const receivedConversationId = data.conversationId.toString();
    console.log('Received conversation ID:', receivedConversationId);
    console.log('Current conversation ID:', currentConversationId);

    // Check if the incoming message belongs to the current conversation
    if (receivedConversationId === currentConversationId) {
      console.log('New message belongs to the current conversation:', data);

      // Initialize sender and receiver names
      let senderName = 'You';
      let receiverName = currentContact?.name || 'Receiver';

      // Fetch sender name if the sender is not the current user
      if (data.sender !== sender_UserId) {
        try {
          const senderResponse = await axios.get(`http://localhost:7002/api/user/${data.sender}`);
          senderName = `${senderResponse.data.user.firstName} ${senderResponse.data.user.lastName}`;
        } catch (error) {
          console.error('Error fetching sender details:', error);
        }
      }

      // Fetch receiver name if the receiver is not the current user
      if (data.receiver !== sender_UserId) {
        try {
          const receiverResponse = await axios.get(`http://localhost:7002/api/user/${data.receiver}`);
          receiverName = `${receiverResponse.data.user.firstName} ${receiverResponse.data.user.lastName}`;
        } catch (error) {
          console.error('Error fetching receiver details:', error);
        }
      }

      // Update messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: { _id: data.sender, firstName: senderName, lastName: '' },
          receiver: { _id: data.receiver, firstName: receiverName, lastName: '' },
          content: data.content,
          conversationId: data.conversationId,
          time: new Date().toLocaleTimeString(),
          date: new Date(),
          imageUrl: data.imageUrl || null,
          file: data.file || null,
          fileType: data.fileType || null,
        },
      ]);

      scrollToBottom(); // Scroll to the latest message
    } else {
      console.log('Received message does not match the current conversation:', data);
    }
  }
};


  // Function to send a new message
const handleSendMessage = () => {
    if (webSocket && newMessage.trim()) {
        const messageData = {
            type: 'newMessage',
            sender: sender_UserId, // Ensure this is the correct user ID
            receiver: currentContact?.receiverId, // Ensure this is the correct receiver ID
            content: newMessage,
            conversationId: currentContact?.conversationId,
        };

        // Log the message being sent
        console.log('Sending message through WebSocket:', messageData);

        // Send the message via WebSocket
        webSocket.send(JSON.stringify(messageData));

        // Add the message to local state for immediate display
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: { _id: sender_UserId, firstName: 'You', lastName: '' },
          receiver: {
            _id: currentContact?.receiverId || '',
            firstName: currentContact?.name || 'Unknown',
            lastName: '',
          },
          content: newMessage,
          conversationId: currentContact?.conversationId || '',
          time: new Date().toLocaleTimeString(),
          date: new Date(),
          imageUrl: null,
          file: null,
          fileType: null,
        },
      ]);

        // Clear the input field and scroll to the bottom
        setNewMessage('');
        scrollToBottom();
    } else {
        console.error('WebSocket is not connected or message is empty.');
    }
};

  // Ensure the scroll happens after every message state update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // // Fetch all conversations for the user and their messages
  // useEffect(() => {
  //   const fetchConversations = async () => {
  //     try {
  //       if (!sender_UserId) return;
  //       setLoading(true); 
  //       // Fetch all conversations for the current user from the conversation service
  //       const conversationsResponse = await axios.get(`http://localhost:7003/api/users/${authServiceId}/conversations`);
  //       const conversations = conversationsResponse.data;

  //       // Process each conversation to extract the receiver's details and latest message
  //       const contactPromises = conversations.map(async (conversation: any) => {
  //         const receiver = conversation.participants.find((participant: any) => participant._id !== sender_UserId);
  //         const receiverId = receiver?._id;

  //         if (receiverId) {
  //           const userResponse = await axios.get(`http://localhost:7002/api/user/${receiverId}`);
  //           const userDetails = userResponse.data;

  //           let lastMessage = 'No messages yet...';
  //           let lastMessageTime = conversation.updatedAt;

  //           if (conversation.messages && conversation.messages.length > 0) {
  //             const lastMessageObj = conversation.messages[conversation.messages.length - 1];
  //             lastMessage = lastMessageObj.content;
  //             lastMessageTime = lastMessageObj.timestamp;
  //           }

  //           return {
  //             receiverId: receiverId,
  //             conversationId: conversation._id,
  //             name: `${userDetails.user.firstName} ${userDetails.user.lastName}`,
  //             latestMessage: lastMessage,
  //             date: lastMessageTime,
  //             profileImage: userDetails.profileImage || defaultProfileImage,
  //             designation: userDetails.user.role || 'N/A',
  //           };
  //         }
  //       });

  //       // Wait for all contact details to be processed and filter out undefined results
  //       const contactList = await Promise.all(contactPromises);
  //       setContacts(contactList.filter(Boolean));

  //       // Set the first contact as the current conversation
  //       const firstContact = contactList[0] || null;
  //       setCurrentContact(firstContact);
  //       console.log('Setting currentContact:', firstContact);
  
  //       // If there are conversations, fetch the messages for the first conversation
  //       if (contactList.length > 0) {
  //         fetchMessages(contactList[0]?.conversationId);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching conversations:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchConversations();
  // }, [sender_UserId]);

  // Fetch messages for a specific conversation from the conversation service
  const fetchMessages = async (conversationId: string) => {
    if(!conversationId) return;

    try {
      setFetchingMessages(true);
      const response = await axios.get(`http://localhost:7003/api/conversations/${conversationId}/messages`);
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setFetchingMessages(false);
    }
  };

// Handle user selection from search results or contact list
const handleUserSelect = async (user: any) => {
  console.log("User selected:", user);
  console.log("Current contacts:", contacts);

  // Check if the user is already in the contacts list
  const existingConversation = contacts.find(
    (contact) => contact.receiverId === (user._id || user.receiverId) // Ensure to handle both user._id and user.receiverId
  );

  if (existingConversation) {
    console.log('Existing conversation found:', existingConversation); 
    setCurrentContact(existingConversation);
    setCurrentConversationId(existingConversation.conversationId); // Set the conversation ID
    fetchMessages(existingConversation.conversationId);
    setShowSearch(false);
    console.log('Setting currentContact in handleUserSelect:', existingConversation);
  } else {
    console.log("No existing conversation found, creating a new one with:", user);
    await createNewConversation(user);
  }

  // Clear search query and results
  setSearchQuery('');
  setSearchResults([]);
  setShowSearch(false);
};



// In the useEffect that fetches conversations
useEffect(() => {
  const fetchConversations = async () => {
    try {
      if (!sender_UserId) return;
      setLoading(true);
      
      console.log('Fetching conversations for sender_UserId:', sender_UserId);

      // Fetch all conversations for the current user from the conversation service
      const conversationsResponse = await axios.get(`http://localhost:7003/api/users/${authServiceId}/conversations`);
      const conversations = conversationsResponse.data;
      console.log('Conversations fetched:', conversations);

      // Process each conversation to extract the receiver's details and latest message
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

      // Wait for all contact details to be processed and filter out undefined results
      const contactList = await Promise.all(contactPromises);
      setContacts(contactList.filter(Boolean));

      // Set the first contact as the current conversation
      const firstContact = contactList[0] || null;
      setCurrentContact(firstContact);
      setCurrentConversationId(firstContact?.conversationId || null); // Set the conversation ID
      console.log('Setting currentContact in fetchConversations:', firstContact);

      // If there are conversations, fetch the messages for the first conversation
      if (contactList.length > 0) {
        fetchMessages(contactList[0]?.conversationId);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchConversations();
}, [sender_UserId]);

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
    setCurrentConversationId(newConversation.conversationId); // Set the conversation ID
    console.log('Setting currentConversationId in createNewConversation:', newConversation.conversationId);
    setMessages([]);
    setShowSearch(false);
  } catch (error) {
    console.error('Error creating new conversation:', error);
  }
};


  // Update conversation status (e.g., star, archive)
  const updateConversationStatus = async (action: string) => {
    if (!currentContact) return;

    try {
      await axios.put(`http://localhost:7003/api/conversations/${currentContact.conversationId}`, {
        action,
        userId: sender_UserId,
      });
    } catch (error) {
      console.error('Error updating conversation status:', error);
    }
  };

  // Handle 'Enter' key press in the message input to send the message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file input change to store the selected file in state
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // fetch search results when search query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if(!debouncedSearchQuery.trim()) return; // do nothing if the search query is empty

      setSearchLoading(true);
      setSearchError(null);
      setSearchResults([]);

      try{
        const response = await axios.get('http://localhost:7002/api/user/search', {
          params:{query:debouncedSearchQuery, page:1, limit:10},
        })

        console.log(" search results:", response)

        setSearchResults(response.data.data);
      } catch(error){

        setSearchError("Error fetching search results");
        console.error("Error fetching search results:", error);
;      } finally{
        setSearchLoading(false);
      }
    };

    if(debouncedSearchQuery.trim()){
      fetchSearchResults();
    }

  },[debouncedSearchQuery])

  // Function to update conversation flags using the API
  const updateConversationFlag = async (flagType, value) => {
    if (!currentContact) return;

    try {
        // Construct the payload as per the API's expected format
        const payload = {
            statuses: [flagType], // Wrap the flagType in an array as the API expects 'statuses' to be an array
            userId: sender_UserId , // Add the userId from currentContact or a fallback
            conversationId: currentContact.conversationId, // Include the conversationId for clarity
            value: value // Include the flag value
        };

        const response = await axios.post(
            `http://localhost:7003/api/conversations/actions`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json', // Ensure proper Content-Type
                },
            }
        );

        if (response.status === 200) {
            console.log(`Conversation ${flagType} updated successfully`);

            // Update the contact locally to reflect the change
            setContacts((prevContacts) =>
                prevContacts.map((contact) =>
                    contact.conversationId === currentContact.conversationId
                        ? { ...contact, [flagType]: value }
                        : contact
                )
            );
        } else {
            console.error(`Failed to update conversation ${flagType}`);
        }
    } catch (error) {
        console.error(`Error updating conversation ${flagType}:`, error);
    }
};



  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Left component: for contacts and search */}
      <div className='w-1/3 border-r p-4 overflow-hidden'>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold m-0">Messaging</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='items-center'>
                <Ellipsis />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationStatus('Others')}>Others</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationStatus('Starred')}>Starred</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationStatus('Archived')}>Archived</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationStatus('Muted')}>Muted</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex mb-4">

          <Input
            placeholder="Search messages"
            className="w-full p-2 border rounded"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearch(true);
            }}
          />
          {searchQuery && (
            <button
              className="mx-3 text-gray-500 hover:text-red-500"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setShowSearch(false);
              }}
            >
              <X className='size-6'/>
            </button>
          )}
        </div>

        
       {/* Add a Loader here */}
       <div className="overflow-y-auto h-full">
            {(loading || searchLoading) ? ( // Check if contacts or search results are still being loaded
              <div className="flex justify-center items-center h-full">
                <LucideLoader className="animate-spin h-6 w-6 text-gray-500" />
              </div>
            ) : showSearch && searchQuery.trim() ? (
              searchResults.length > 0 ? (
                searchResults.map((user, index) => (
                  <SearchCard
                      key={index}
                      user={{
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        company: user.company,
                        profileImage: user.profileImage,
                      }}
                      onClick={() => handleUserSelect(user)} // Trigger handleUserSelect
                    />
                ))
              ) : (
                <p className="text-center text-gray-500">No search results found.</p>
              )
            ) : contacts.length > 0 ? ( // Show existing contacts if there is no search
              contacts.map((contact, index) => (
                <ContactCard
                    key={index}
                    contact={contact}
                    onClick={() => handleUserSelect(contact)} // Trigger handleUserSelect
                    isSelected={currentContact?.receiverId === contact.receiverId}
                  />
              ))
            ) : (
              <p className="text-center text-gray-500">No conversations found.</p>
            )}
          </div>



      </div>

      {/*Right Component*/}
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
                <DropdownMenuItem onClick={() => updateConversationFlag('other', true)}>Move to Others</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationFlag('starred', true)}>Star</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationFlag('archived', true)}>Archive</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationFlag('muted', true)}>Mute</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationFlag('reported', true)}>Report This</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationFlag('spam', true)}>Mark as Spam</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationFlag('starred', false)}>Unstar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationFlag('archived', false)}>Unarchive</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateConversationFlag('muted', false)}>Unmute</DropdownMenuItem>
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
          disabled={!newMessage.trim() || !webSocket}
        />
      </div>
    </div>
  );
}
