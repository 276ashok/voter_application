import React from 'react';
import { Upload, Plus, Users, Menu } from 'lucide-react';

const Navbar = ({ onAddRecord, onUpload, toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-border shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-6 justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-secondary rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md hidden sm:block">
            <Users className="w-5 h-5" />
          </div>
          <h1 className="text-base md:text-lg font-semibold tracking-tight truncate">Voter Data Management</h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={onUpload}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload File</span>
          </button>
          
          <button 
            onClick={onAddRecord}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Record</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
