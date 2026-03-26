import React from 'react';
import { Upload, Plus, Moon, Sun, Users } from 'lucide-react';

const Navbar = ({ onAddRecord, onUpload, toggleTheme, isDark }) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b-0 border-white/5 supports-[backdrop-filter]:bg-background/40">
      <div className="flex h-16 items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <Users className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Voter Data Management</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={onUpload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
          
          <button 
            onClick={onAddRecord}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Record
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
