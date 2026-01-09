
import React, { useState } from 'react';
import { User, Task, TaskStatus, Instruction, AttendanceRecord } from '../types';

interface EmployeeDashboardProps {
  user: User;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  instructions: Instruction[];
  attendance: AttendanceRecord[];
  setAttendance: (att: AttendanceRecord[]) => void;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user, tasks, setTasks, instructions, attendance, setAttendance }) => {
  const [workDone, setWorkDone] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');

  const myTasks = tasks.filter(t => t.assignedTo === user.id);
  const currentAttendance = attendance.find(a => a.employeeId === user.id && a.date === new Date().toLocaleDateString());
  const isCheckedIn = !!currentAttendance && !currentAttendance.checkOutTime;

  const handlePunch = () => {
    const now = new Date();
    if (!isCheckedIn) {
      const newLog: AttendanceRecord = {
        id: 'att-' + Date.now(),
        employeeId: user.id,
        employeeName: user.name,
        date: now.toLocaleDateString(),
        checkInTime: now.toLocaleTimeString(),
      };
      setAttendance([...attendance, newLog]);
    } else {
      const updatedAttendance = attendance.map(a => 
        (a.employeeId === user.id && a.date === now.toLocaleDateString()) 
        ? { ...a, checkOutTime: now.toLocaleTimeString() } 
        : a
      );
      setAttendance(updatedAttendance);
    }
  };

  const handleUpdateStatus = (taskId: string, status: TaskStatus) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    setTasks(updated);
    alert(`Task status updated to ${status}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Punch Section */}
      <section className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between border-t-4 border-safetyOrange">
        <div>
          <h2 className="text-xl font-bold">Field Attendance</h2>
          <p className="text-gray-500 text-sm">Site: {myTasks[0]?.siteLocation || 'Awaiting Assignment'}</p>
          {isCheckedIn && <p className="text-green-600 text-sm font-bold mt-1">✓ Active Session since {currentAttendance.checkInTime}</p>}
        </div>
        <button 
          onClick={handlePunch}
          className={`mt-4 sm:mt-0 px-8 py-4 rounded-full font-black text-white shadow-lg transition-all active:scale-95 ${
            isCheckedIn ? 'bg-red-500 shadow-red-200' : 'bg-safetyOrange shadow-orange-200'
          }`}
        >
          {isCheckedIn ? 'PUNCH OUT' : 'PUNCH IN'}
        </button>
      </section>

      {/* Instructions */}
      <section className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <span className="w-2 h-2 bg-safetyOrange rounded-full mr-2"></span>
          OFFICE INSTRUCTIONS
        </h2>
        <div className="space-y-3">
          {instructions.length > 0 ? instructions.slice(0, 3).map(ins => (
            <div key={ins.id} className="bg-slate-700/50 p-4 rounded-lg border-l-4 border-safetyOrange">
              <p className="text-xs text-gray-400 mb-1">{ins.author} • {ins.date}</p>
              <p className="text-sm">{ins.content}</p>
            </div>
          )) : <p className="text-gray-500 italic">No new instructions today.</p>}
        </div>
      </section>

      {/* Task Assignment */}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Your Assignments</h2>
        <div className="grid gap-4">
          {myTasks.length > 0 ? myTasks.map(task => (
            <div key={task.id} className="border border-gray-100 rounded-xl p-5 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  <p className="text-gray-500 text-sm">{task.description}</p>
                </div>
                <select 
                  className="text-xs font-bold border rounded p-1"
                  value={task.status}
                  onChange={e => handleUpdateStatus(task.id, e.target.value as TaskStatus)}
                >
                  <option value={TaskStatus.PENDING}>Pending</option>
                  <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TaskStatus.COMPLETED}>Completed</option>
                </select>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                {task.siteLocation}
              </div>
            </div>
          )) : <div className="text-center py-10 bg-gray-50 rounded-xl text-gray-400">No tasks assigned to you yet.</div>}
        </div>
      </section>
    </div>
  );
};

export default EmployeeDashboard;
