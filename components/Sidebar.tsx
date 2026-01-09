import React from 'react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, isOpen, onClose, activeTab, setActiveTab }) => {
  const logoUrl = "https://cdn-icons-png.flaticon.com/512/1063/1063376.png";
  
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'attendance', label: 'Attendance', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'tasks', label: 'Task List', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ];

  if (user.role === UserRole.OWNER || user.role === UserRole.HR) {
    menuItems.push({ id: 'reports', label: 'Staff Data', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' });
  }

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 w-72 bg-deepBlue text-white transform transition-transform duration-300 ease-in-out z-30 lg:static lg:translate-x-0
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
    `}>
      <div className="p-8">
        <div className="flex items-center space-x-3">
           <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center p-1 border border-white/10 group">
             <img src={logoUrl} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt="VJ Gote Logo" />
           </div>
           <div>
             <span className="text-lg font-black tracking-tight block leading-none">VJ GOTE</span>
             <span className="text-[9px] font-black text-safetyOrange uppercase tracking-widest mt-1 block">Engineering</span>
           </div>
        </div>
      </div>

      <nav className="mt-4 px-6 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-safetyOrange text-white shadow-lg shadow-orange-900/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
            </svg>
            <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-6 space-y-4">
        <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Active Project</p>
            <p className="text-[11px] font-bold mt-1 text-slate-300 truncate">Skyline Towers, Sector 12</p>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black uppercase text-[10px] tracking-widest"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;