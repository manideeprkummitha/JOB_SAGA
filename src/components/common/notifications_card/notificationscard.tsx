import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { XCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoImage from "../../../../public/images/Screenshot (573).png"; // Adjust the path as needed

const NotificationsCard = () => {
  return (
    <Card className="sm:col-span-2 border rounded-lg shadow-md p-4">
      <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4">
        <Avatar className="w-12 h-12 rounded-lg">
          <AvatarImage alt="Notification Icon" />
          <AvatarFallback>NT</AvatarFallback>
        </Avatar>
        <div className='gap-4'>
          <CardTitle className="font-semibold" style={{ fontSize: '16px' }}>
            Notification Title
          </CardTitle>
          <CardDescription className="text-gray-600" style={{ fontSize: '12px' }}>
            This is a description of the notification content.
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon">
          <XCircle className="text-gray-500" size={20} />
          <span className="sr-only">Delete notification</span>
        </Button>
      </div>
    </Card>
  );
};

export default NotificationsCard;
