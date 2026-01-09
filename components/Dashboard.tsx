
import React, { useState } from 'react';
import { User, UserRole, Task, Instruction, AttendanceRecord, SalaryRecord } from '../types';
import Sidebar from './Sidebar';
import EmployeeDashboard from './EmployeeDashboard';
import HRDashboard from './HRDashboard';
import OwnerDashboard from './OwnerDashboard';

interface DashboardProps {
  user: User;
  users: User[];
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  instructions: Instruction[];
  setInstructions: (instructions: Instruction[]) => void;
  attendance: AttendanceRecord[];
  setAttendance: (attendance: AttendanceRecord[]) => void;
  salaries: SalaryRecord[];
  setSalaries: (salaries: SalaryRecord[]) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, users, tasks, setTasks, instructions, setInstructions, attendance, setAttendance, salaries, setSalaries, onLogout 
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const logoUrl = "https://cdn-icons-png.flaticon.com/512/1063/1063376.png";

  const renderContent = () => {
    if (activeTab === 'attendance') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slateGray uppercase tracking-tight">Attendance Tracking</h2>
          <HRDashboard users={users} attendance={attendance} salaries={salaries} setSalaries={setSalaries} />
        </div>
      );
    }

    if (activeTab === 'tasks') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slateGray uppercase tracking-tight">Project Management</h2>
          {user.role === UserRole.OWNER ? (
             <OwnerDashboard 
              user={user} users={users} tasks={tasks} setTasks={setTasks} 
              setInstructions={setInstructions} instructions={instructions} 
            />
          ) : (
            <EmployeeDashboard 
              user={user} tasks={tasks} setTasks={setTasks} 
              instructions={instructions} attendance={attendance} setAttendance={setAttendance} 
            />
          )}
        </div>
      );
    }

    if (activeTab === 'reports') {
       return <HRDashboard users={users} attendance={attendance} salaries={salaries} setSalaries={setSalaries} />;
    }

    switch (user.role) {
      case UserRole.EMPLOYEE:
        return (
          <EmployeeDashboard 
            user={user} 
            tasks={tasks} 
            setTasks={setTasks} 
            instructions={instructions}
            attendance={attendance}
            setAttendance={setAttendance}
          />
        );
      case UserRole.HR:
        return <HRDashboard users={users} attendance={attendance} salaries={salaries} setSalaries={setSalaries} />;
      case UserRole.OWNER:
        return (
          <OwnerDashboard 
            user={user} 
            users={users} 
            tasks={tasks} 
            setTasks={setTasks} 
            setInstructions={setInstructions}
            instructions={instructions}
          />
        );
      default:
        return <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest">Select an option from the menu.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar 
        user={user} 
        onLogout={onLogout} 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center justify-between px-6 lg:px-10 flex-shrink-0 z-10">
          <div className="flex items-center">
            <button className="lg:hidden mr-4 text-slateGray p-2 bg-gray-100 rounded-xl" onClick={() => setSidebarOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-safetyOrange/10 rounded-xl flex items-center justify-center lg:hidden">
                <img src={logoUrl} className="w-6 h-6" alt="Logo" />
              </div>
              <h1 className="text-xl font-black text-slateGray uppercase tracking-tighter">
                VJ GOTE <span className="text-safetyOrange font-bold text-xs ml-2 hidden sm:inline tracking-widest bg-orange-50 px-2 py-1 rounded-md">PORTAL</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slateGray leading-none mb-1">{user.name}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{user.role}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-deepBlue p-1 shadow-lg border-2 border-white ring-4 ring-gray-50 overflow-hidden">
               <div className="w-full h-full rounded-xl bg-safetyOrange flex items-center justify-center text-white font-black text-lg">
                 {user.name.charAt(0)}
               </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-10 flex flex-col custom-scrollbar">
          <div className="flex-1">
            {renderContent()}
          </div>
          
          <footer className="mt-20 py-10 border-t border-gray-100 text-center no-print">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 p-3 border border-gray-50">
                 <img src={logoUrl} className="w-full h-full grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all" alt="Footer Logo" />
              </div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">
                © {new Date().getFullYear()} VJ Gote Brothers Infrastructure
              </p>
              <p className="text-slateGray text-[10px] font-black mt-3 uppercase tracking-[0.2em]">
                Designed & Built by <span className="text-safetyOrange">Ayaan</span>
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
