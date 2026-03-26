import React from 'react';
import { LayoutDashboard, Users, History, BarChart3, Settings } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: false },
    { name: 'Voter Data', icon: Users, active: true },
    { name: 'Upload History', icon: History, active: false },
    { name: 'Analytics', icon: BarChart3, active: false },
    { name: 'Settings', icon: Settings, active: false },
  ];

  return (
    <aside className="w-64 border-r border-white/5 glass-panel hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 bg-card/40">
      <div className="p-4 flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  item.active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            A
          </div>
          <div className="text-sm">
            <p className="font-semibold">Admin User</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
