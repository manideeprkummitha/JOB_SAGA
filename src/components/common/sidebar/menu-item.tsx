'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

interface MenuItemProps {
  href: string;
  icon: ReactNode;
  text: string;
  isMinimized: boolean;
  children?: ReactNode;
}

const MenuItem: FC<MenuItemProps> = ({ href, icon, text, isMinimized, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}>
      {React.cloneElement(icon as React.ReactElement, { className: `${isActive ? 'text-primary' : 'text-muted-foreground'} ${isMinimized ? 'h-6 w-6' : 'h-4 w-4'}` })}
      {!isMinimized && text}
      {children}
    </Link>
  );
};

export default MenuItem;
