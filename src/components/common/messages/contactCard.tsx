import React, { useState } from 'react';
import Image from 'next/image';
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoImage from "../../../../public/images/Screenshot (573).png"; // Adjust the path as needed

const defaultProfileImage = logoImage; // Use the imported image as the default profile image

interface ContactCardProps {
  contact: {
    name: string;
    date: string; // This should be the timestamp for the last message
    latestMessage: string;
    profileImage: string | null;
  };
  setCurrentContact: (contact: any) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, setCurrentContact }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="cursor-pointer rounded-md hover:bg-zinc-900 relative p-2 transition-colors duration-200 ease-in-out"
      onClick={() => setCurrentContact(contact)}
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
        <div className="text-xs text-gray-400">{new Date(contact.date).toLocaleTimeString()}</div>
        {isHovered && (
          <div className="absolute right-0 top-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2">
                  <Ellipsis />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => console.log('Move to Other')}>Move to Other</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Mark as unread')}>Mark as unread</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Star')}>Star</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Archive')}>Archive</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Report this ad')}>Report this ad</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Delete conversation')}>Delete conversation</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Why am I seeing this ad')}>Why am I seeing this ad</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
