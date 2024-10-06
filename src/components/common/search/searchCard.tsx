import { Search } from "lucide-react";
import Image from "next/image";
import defaultProfileImage from "../../../../public/images/Screenshot (573).png"; // Adjust the path as needed

interface SearchCardProps {
  user: {
    firstName?: string;
    lastName?: string;
    role?: string;
    company?: string;
    profileImage?: string;
  };
  onClick: () => void; // Changed to onClick prop
}

const SearchCard: React.FC<SearchCardProps> = ({ user, onClick }) => {
  if (!user) {
    return (
      <div className="flex items-center p-2">
        <span className="text-sm font-semibold">User not found</span>
      </div>
    );
  }

  const fullName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  const role = user.role || 'Role not specified';
  const company = user.company || 'Company not specified';

  return (
    <div
      className="flex items-center p-2 cursor-pointer hover:bg-zinc-600 rounded-md"
      onClick={onClick} // Use the onClick prop here
    >
      <Search className="w-5 h-5 text-gray-200 mx-2" />
      <div className="flex-1 ml-2">
        <span className="text-sm font-semibold">{fullName}</span>
        <span className="text-xs text-gray-200"> • You • {role} @ {company}</span>
      </div>
      <Image
        src={user.profileImage || defaultProfileImage}
        alt="Profile Image"
        width={32}
        height={32}
        className="rounded-full"
      />
    </div>
  );
};

export default SearchCard;
