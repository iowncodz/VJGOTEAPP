
import React, { useState } from 'react';
import { User, AttendanceRecord, UserRole, SalaryRecord } from '../types';
import { db } from '../lib/db';

interface HRDashboardProps {
  users: User[];
  attendance: AttendanceRecord[];
  salaries: SalaryRecord[];
  setSalaries: (s: SalaryRecord[]) => void;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ users, attendance, salaries, setSalaries }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: UserRole.EMPLOYEE });
  const [form, setForm] = useState({ base: 0, allowance: 0, deduction: 0 });
  
  const employees = users.filter(u => u.role === UserRole.EMPLOYEE);

  const handleOpenSalary = (user: User) => {
    const existing = salaries.find(s => s.employeeId === user.id);
    if (existing) {
      setForm({ base: existing.base, allowance: existing.allowance, deduction: existing.deduction });
    } else {
      setForm({ base: 0, allowance: 0, deduction: 0 });
    }
    setSelectedUser(user);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role
    };
    await db.add('users', newUser);
    setShowAddStaff(false);
    setNewStaff({ name: '', email: '', role: UserRole.EMPLOYEE });
  };

  const handleDeleteStaff = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to remove ${userName}? This will revoke their access to the VJ Gote Portal immediately.`)) {
      await db.delete('users', userId);
      await db.delete('salaries', userId, 'employeeId');
    }
  };

  const handleSaveSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const net = form.base + form.allowance - form.deduction;
    const newRecord: SalaryRecord = {
      employeeId: selectedUser.id,
      base: form.base,
      allowance: form.allowance,
      deduction: form.deduction,
      net: net,
      lastUpdated: new Date().toLocaleDateString()
    };
    const filtered = salaries.filter(s => s.employeeId !== selectedUser.id);
    const updatedSalaries = [...filtered, newRecord];
    setSalaries(updatedSalaries);
    await db.setCollection('salaries', updatedSalaries);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Registration Modal */}
      {showAddStaff && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-slateGray mb-2">New Staff Member</h2>
            <p className="text-sm text-gray-500 mb-6">Create official company credentials.</p>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-safetyOrange" placeholder="Full Name" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
              <input required type="email" className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-safetyOrange" placeholder="Company Email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
              <select className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-safetyOrange appearance-none" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value as UserRole})}>
                <option value={UserRole.EMPLOYEE}>Field Employee</option>
                <option value={UserRole.HR}>HR Manager</option>
                <option value={UserRole.OWNER}>Owner / Director</option>
              </select>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowAddStaff(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-slateGray">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-safetyOrange text-white rounded-2xl font-bold shadow-lg shadow-orange-200">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payroll Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-slateGray mb-1">Payroll Update</h2>
            <p className="text-sm text-gray-500 mb-8">{selectedUser.name}</p>
            <form onSubmit={handleSaveSalary} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Base Amount (₹)</label>
                <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-safetyOrange font-bold" value={form.base} onChange={e => setForm({...form, base: Number(e.target.value)})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Allowances</label>
                  <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-safetyOrange font-bold" value={form.allowance} onChange={e => setForm({...form, allowance: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Deductions</label>
                  <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-safetyOrange font-bold text-red-500" value={form.deduction} onChange={e => setForm({...form, deduction: Number(e.target.value)})} />
                </div>
              </div>
              <div className="pt-6 border-t mt-4">
                <div className="flex justify-between items-center mb-6 px-1">
                  <span className="font-bold text-slateGray uppercase text-xs tracking-widest">Net Payable</span>
                  <span className="text-2xl font-black text-safetyOrange">₹{(form.base + form.allowance - form.deduction).toLocaleString()}</span>
                </div>
                <div className="flex space-x-3">
                  <button type="button" onClick={() => setSelectedUser(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold">Discard</button>
                  <button type="submit" className="flex-1 py-4 bg-deepBlue text-white rounded-2xl font-bold shadow-lg shadow-slate-200">Save Record</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <h2 className="text-2xl font-black text-slateGray uppercase tracking-tight">Staff & Payroll</h2>
        <button onClick={() => setShowAddStaff(true)} className="w-full sm:w-auto bg-deepBlue text-white px-8 py-4 rounded-2xl text-xs font-black uppercase shadow-xl hover:bg-black transition-all active:scale-95">
          + Add New Staff
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 no-print overflow-hidden">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Staff Directory</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
               {users.map(emp => (
                  <div key={emp.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all group border border-transparent hover:border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white ${emp.role === UserRole.EMPLOYEE ? 'bg-safetyOrange' : 'bg-deepBlue'} shadow-sm`}>
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none mb-1">{emp.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{emp.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {emp.role === UserRole.EMPLOYEE && (
                        <button onClick={() => handleOpenSalary(emp)} className="p-3 text-gray-400 hover:text-safetyOrange transition-colors" title="Manage Payroll">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteStaff(emp.id, emp.name)} 
                        className="p-3 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Staff member"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
               ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-6 no-print overflow-hidden">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Daily Punch Logs</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="text-sm">
                  {attendance.length > 0 ? [...attendance].slice(0, 10).map(log => (
                    <tr key={log.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-4 font-bold text-slateGray">{log.employeeName}</td>
                      <td className="py-4 text-gray-500 font-medium">{log.date}</td>
                      <td className="py-4 font-black text-green-600 tabular-nums">{log.checkInTime}</td>
                      <td className="py-4 font-black text-red-400 tabular-nums">{log.checkOutTime || '--:--'}</td>
                    </tr>
                  )) : (
                    <tr><td className="py-10 text-center text-gray-300 italic">Waiting for field activity...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slateGray text-white rounded-[2rem] shadow-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-safetyOrange/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-safetyOrange/20 transition-all duration-700"></div>
            <div className="w-16 h-16 bg-safetyOrange/20 rounded-2xl flex items-center justify-center mb-6">
               <svg className="w-8 h-8 text-safetyOrange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div className="text-4xl font-black mb-2 tracking-tighter tabular-nums">₹{salaries.reduce((acc, s) => acc + s.net, 0).toLocaleString()}</div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Estimated Monthly Payroll</p>
            <button onClick={() => window.print()} className="w-full bg-safetyOrange text-white py-5 rounded-2xl text-sm font-black uppercase shadow-lg shadow-orange-900/20 hover:scale-105 active:scale-95 transition-all">
              Print Official Report
            </button>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-col items-center text-center">
             <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
             </div>
             <p className="text-xs font-black text-slateGray uppercase tracking-widest">Database Health</p>
             <p className="text-[10px] text-green-600 font-bold mt-1">REAL-TIME SYNC ACTIVE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
