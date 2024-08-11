// components/Messages/ContactList.js
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import logoImage from "../../../../public/images/Screenshot (573).png"; // Adjust the path as needed

const defaultProfileImage = logoImage; // Use the imported image as the default profile image

export default function ContactList({ contacts, setCurrentContact }) {
  return (
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
              <div className="text-xs text-gray-400">{contact.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
