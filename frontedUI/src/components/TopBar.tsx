import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-surface/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 border-b border-surface-variant/10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-surface-container rounded-full transition-all text-primary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="font-headline text-base md:text-lg font-medium text-on-surface truncate max-w-[150px] md:max-w-none">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all"
          />
        </div>
        <button className="p-2 hover:bg-surface-container rounded-full transition-all text-secondary relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface" />
        </button>
      </div>
    </header>
  );
};
