import React, { useState } from 'react';
import Image from 'next/image';
import logoImage from "../../../../public/images/Screenshot (573).png"; // Adjust the path as needed

const defaultProfileImage = logoImage; // Use the imported image as the default profile image

interface ContactCardProps {
  contact: {
    name: string;
    date: string; // This should be the timestamp for the last message
    latestMessage: string;
    profileImage: string | null;
    receiverId: string; // Add receiverId to the contact object
  };
  onClick: () => void; // Changed to onClick prop
  isSelected: boolean; // New prop to check if this contact is selected
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onClick, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`cursor-pointer rounded-md p-2 transition-colors duration-200 ease-in-out mt-2 ${
        isSelected ? 'bg-zinc-800' : 'hover:bg-zinc-900'
      }`}
      onClick={onClick} // Use onClick prop here
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between relative">
        <div className="flex items-center">
          <Image
            src={contact.profileImage || defaultProfileImage}
            alt={contact.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="text-sm font-medium">{contact.name}</div>
            <div className="text-xs text-gray-400 truncate w-48">{contact.latestMessage}</div>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {new Date(contact.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
