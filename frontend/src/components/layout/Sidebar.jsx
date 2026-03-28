import React from 'react';
import { LayoutDashboard, Users, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'voter-data', name: 'Voter Data', icon: Users },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:w-20 lg:w-64'
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border md:hidden">
        <span className="font-semibold text-lg text-primary flex items-center gap-2"><Users className="w-5 h-5" /> Navigation</span>
        <button onClick={() => setIsOpen(false)} className="p-2 text-muted-foreground hover:bg-secondary rounded-md">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.name}
                onClick={() => {
                   if(setCurrentPage) setCurrentPage(item.id);
                   setIsOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
                title={item.name}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`ml-3 whitespace-nowrap ${isOpen ? 'block' : 'hidden lg:block'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-full p-3 border-t border-border bg-muted/20">
        <div className={`flex items-center ${isOpen ? 'justify-start px-2' : 'justify-center lg:justify-start lg:px-2'}`}>
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            A
          </div>
          <div className={`ml-3 overflow-hidden ${isOpen ? 'block' : 'hidden lg:block'}`}>
            <p className="font-semibold text-sm truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
