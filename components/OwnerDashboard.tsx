
import React, { useState } from 'react';
import { User, Task, TaskStatus, UserRole, Instruction } from '../types';
import { GoogleGenAI } from "@google/genai";

interface OwnerDashboardProps {
  user: User;
  users: User[];
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  instructions: Instruction[];
  setInstructions: (ins: Instruction[]) => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ user, users, tasks, setTasks, instructions, setInstructions }) => {
  const [showModal, setShowModal] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [newInst, setNewInst] = useState('');
  const [assignment, setAssignment] = useState({ title: '', desc: '', workerId: '', site: '' });

  const employees = users.filter(u => u.role === UserRole.EMPLOYEE);

  const handleAiAssist = async () => {
    if (!assignment.title && !assignment.site) {
      alert("Please enter a Title or Site first so AI knows what to generate!");
      return;
    }
    setIsAiGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a professional construction task description for a task titled "${assignment.title}" at site "${assignment.site}". Be concise and mention safety requirements.`,
      });
      setAssignment(prev => ({ ...prev, desc: response.text || '' }));
    } catch (error) {
      console.error(error);
      alert("AI Service currently busy. Please type manually.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    const worker = users.find(u => u.id === assignment.workerId);
    const newTask: Task = {
      id: 't-' + Date.now(),
      title: assignment.title,
      description: assignment.desc,
      assignedTo: assignment.workerId,
      assignedToName: worker?.name || 'Unknown',
      status: TaskStatus.PENDING,
      siteLocation: assignment.site,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks([newTask, ...tasks]);
    setAssignment({ title: '', desc: '', workerId: '', site: '' });
    setShowModal(false);
  };

  const handleSendInstruction = () => {
    if (!newInst.trim()) return;
    const ins: Instruction = {
      id: 'ins-' + Date.now(),
      author: user.name,
      content: newInst,
      date: new Date().toLocaleDateString(),
      priority: 'high'
    };
    setInstructions([ins, ...instructions]);
    setNewInst('');
  };

  return (
    <div className="space-y-8">
      {/* Task Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slateGray">Assign Work</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black p-2">&times;</button>
            </div>
            <form onSubmit={handleAssignTask} className="space-y-4">
              <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-safetyOrange" placeholder="Task Title" value={assignment.title} onChange={e => setAssignment({...assignment, title: e.target.value})} />
              <input required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-safetyOrange" placeholder="Site Location" value={assignment.site} onChange={e => setAssignment({...assignment, site: e.target.value})} />
              
              <div className="relative">
                <textarea required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-safetyOrange" placeholder="Task Details/Instructions" rows={4} value={assignment.desc} onChange={e => setAssignment({...assignment, desc: e.target.value})} />
                <button 
                  type="button"
                  onClick={handleAiAssist}
                  disabled={isAiGenerating}
                  className="absolute bottom-4 right-4 bg-deepBlue text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isAiGenerating ? 'AI THINKING...' : '✨ GENERATE WITH AI'}
                </button>
              </div>

              <select required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-safetyOrange" value={assignment.workerId} onChange={e => setAssignment({...assignment, workerId: e.target.value})}>
                <option value="">Select Field Worker</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              
              <button type="submit" className="w-full bg-safetyOrange text-white py-4 rounded-2xl font-black shadow-xl hover:shadow-orange-200 transition-all active:scale-95">
                PUBLISH ASSIGNMENT
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Cloud Status', val: 'ONLINE', sub: 'SYNCED', color: 'green' },
          { label: 'Field Staff', val: employees.length, sub: 'ACTIVE', color: 'orange' },
          { label: 'Live Sites', val: [...new Set(tasks.map(t => t.siteLocation))].length, sub: 'TRACKING', color: 'blue' },
          { label: 'Uptime', val: '99.9%', sub: 'REAL-TIME', color: 'slate' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slateGray">{stat.val}</p>
            <span className="text-[8px] font-bold text-safetyOrange mt-1">{stat.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slateGray uppercase tracking-tight">Project Master-list</h2>
            <button onClick={() => setShowModal(true)} className="bg-safetyOrange text-white px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center shadow-lg hover:scale-105 transition-transform">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
              Assign Work
            </button>
          </div>
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-safetyOrange/20 transition-all">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-black text-safetyOrange uppercase tracking-widest">{task.siteLocation}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-[10px] text-gray-400">{task.createdAt}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slateGray">{task.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-md line-clamp-1">{task.description}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col items-end">
                   <div className="flex items-center space-x-2 mb-2">
                     <div className="w-6 h-6 bg-slateGray rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                       {task.assignedToName.charAt(0)}
                     </div>
                     <span className="text-xs font-bold text-slateGray">{task.assignedToName}</span>
                   </div>
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${
                      task.status === TaskStatus.COMPLETED ? 'bg-green-100 text-green-700' :
                      task.status === TaskStatus.IN_PROGRESS ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {task.status}
                    </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-deepBlue text-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-lg font-black uppercase tracking-widest mb-6">Broadcast News</h2>
            <textarea 
              className="w-full bg-slate-800 border-none rounded-2xl p-4 text-sm mb-4 outline-none focus:ring-2 focus:ring-safetyOrange text-white"
              placeholder="Post update to all worker dashboards..."
              rows={4}
              value={newInst}
              onChange={e => setNewInst(e.target.value)}
            />
            <button onClick={handleSendInstruction} className="w-full bg-safetyOrange py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all">
              BROADCAST LIVE
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100">
             <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">Active Database Feed</h3>
             <div className="space-y-4">
                {instructions.slice(0, 3).map(ins => (
                  <div key={ins.id} className="flex space-x-3">
                    <div className="w-1 bg-safetyOrange rounded-full"></div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{ins.date}</p>
                      <p className="text-sm text-slateGray font-medium leading-relaxed">{ins.content}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
