
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
    { id: 'tasks', label: 'Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ];

  if (user.role === UserRole.OWNER || user.role === UserRole.HR) {
    menuItems.push({ id: 'reports', label: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' });
  }

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 w-72 bg-deepBlue text-white transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-30 lg:static lg:translate-x-0
      ${isOpen ? 'translate-x-0 shadow-[20px_0_60px_rgba(0,0,0,0.5)]' : '-translate-x-full'}
    `}>
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center space-x-4">
           <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center p-2 border border-white/10 group">
             <img src={logoUrl} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt="VJ Gote Logo" />
           </div>
           <div>
             <span className="text-xl font-black tracking-tight block leading-none">VJ GOTE</span>
             <span className="text-[9px] font-black text-safetyOrange uppercase tracking-[0.2em] mt-1 block">Engineering</span>
           </div>
        </div>
      </div>

      <nav className="mt-8 px-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all ${
              activeTab === item.id 
                ? 'bg-safetyOrange text-white shadow-lg shadow-orange-900/40' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
            </svg>
            <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-6 space-y-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-[1.5rem] p-5 border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Active HQ</p>
            <p className="text-sm font-bold mt-1 text-gray-200">VJ Gote Towers, PH-II</p>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-black uppercase text-xs tracking-widest"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Exit Portal</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
