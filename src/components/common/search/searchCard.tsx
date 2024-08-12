import React, { useState } from 'react';
import Image from 'next/image';
import { Search } from "lucide-react"; // Adjust import if using a different icon library

interface SearchCardProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
    company: string;
    profileImage: string;
  };
}

const SearchCard: React.FC<SearchCardProps> = ({ user }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="cursor-pointer rounded-md p-2 flex items-center transition-colors duration-200 ease-in-out hover:bg-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Search className="w-4 h-4 text-gray-500 mr-2" />
      <div className="flex-1">
        <span className="text-sm font-semibold">{`${user.firstName} ${user.lastName}`}</span>
        <span className="text-xs text-gray-500"> • You • {user.role} @ {user.company}</span>
      </div>
      <Image
        src={user.profileImage}
        alt={`${user.firstName} ${user.lastName}`}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full ml-2"
      />
    </div>
  );
};

export default SearchCard;
