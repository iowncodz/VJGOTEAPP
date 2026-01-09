
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

  const renderContent = () => {
    if (activeTab === 'attendance') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slateGray">Attendance Management</h2>
          <HRDashboard users={users} attendance={attendance} salaries={salaries} setSalaries={setSalaries} />
        </div>
      );
    }

    if (activeTab === 'tasks') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slateGray">Project Tasks & Sites</h2>
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
        return <div className="p-10 text-center">Select an option from the menu.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
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
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-10">
          <div className="flex items-center">
            <button className="lg:hidden mr-4 text-slateGray p-1" onClick={() => setSidebarOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-safetyOrange rounded flex items-center justify-center lg:hidden">
                <span className="text-[10px] font-black text-white">VJ</span>
              </div>
              <h1 className="text-xl font-bold text-slateGray uppercase tracking-tight">
                VJ GOTE <span className="text-safetyOrange font-normal text-sm ml-2 hidden sm:inline">Construction Portal</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-safetyOrange flex items-center justify-center text-white font-bold shadow-sm">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col">
          <div className="flex-1">
            {renderContent()}
          </div>
          
          <footer className="mt-12 py-6 border-t border-gray-200 text-center no-print">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-safetyOrange/10 rounded-full flex items-center justify-center mb-3">
                 <span className="text-[10px] font-black text-safetyOrange">VJ</span>
              </div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                © {new Date().getFullYear()} VJ Gote Brothers Management System
              </p>
              <p className="text-slateGray text-xs font-bold mt-1">
                Made by <span className="text-safetyOrange">Ayaan</span>
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
