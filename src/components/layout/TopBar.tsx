import React from 'react';
import { Bell, Settings, User } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-outline-variant bg-surface-bright shrink-0">
      <div className="flex items-center gap-4">
        {/* Breadcrumbs or dynamic title could go here */}
      </div>

      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant hover:text-on-surface transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full" />
        </button>
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <Settings size={20} />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
          <div className="text-right">
            <p className="text-sm font-semibold text-on-surface">Admin User</p>
            <p className="text-xs text-on-surface-variant">System Operator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary border border-outline-variant">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};
