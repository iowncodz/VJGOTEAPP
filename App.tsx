
import React, { useState, useEffect } from 'react';
import { User, UserRole, Task, TaskStatus, Instruction, AttendanceRecord, SalaryRecord } from './types';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { MOCK_USERS, MOCK_TASKS, MOCK_INSTRUCTIONS } from './constants';
import { db } from './lib/db';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const [u, t, i, a, s] = await Promise.all([
          db.collection('users'),
          db.collection('tasks'),
          db.collection('instructions'),
          db.collection('attendance'),
          db.collection('salaries')
        ]);

        if (u.length === 0) {
          await Promise.all([
            db.setCollection('users', MOCK_USERS),
            db.setCollection('tasks', MOCK_TASKS),
            db.setCollection('instructions', MOCK_INSTRUCTIONS)
          ]);
          return;
        }

        setUsers(u);
        setTasks(t);
        setInstructions(i);
        setAttendance(a);
        setSalaries(s);
      } finally {
        if (showLoading) setLoading(false);
      }
    };

    const unsubscribe = db.onSnapshot(() => {
      fetchData(false);
    });

    fetchData();
    
    const savedUser = localStorage.getItem('vjgote_session');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    // FIX: Wrap the unsubscribe call in a void function to match the Destructor type requirement.
    // The db.onSnapshot returns a () => boolean, but React expects void | Destructor.
    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdateTasks = async (newTasks: Task[]) => await db.setCollection('tasks', newTasks);
  const handleUpdateInstructions = async (newInstructions: Instruction[]) => await db.setCollection('instructions', newInstructions);
  const handleUpdateAttendance = async (newAttendance: AttendanceRecord[]) => await db.setCollection('attendance', newAttendance);
  const handleUpdateSalaries = async (newSalaries: SalaryRecord[]) => await db.setCollection('salaries', newSalaries);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('vjgote_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vjgote_session');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-safetyOrange"></div>
          <div className="absolute inset-0 flex items-center justify-center font-black text-safetyOrange text-xl">VJ</div>
        </div>
        <h2 className="mt-8 text-2xl font-bold text-slateGray uppercase tracking-widest">VJ GOTE BROTHERS</h2>
        <p className="text-gray-400 mt-2 animate-pulse font-medium">Connecting to Secure Cloud Database...</p>
        <p className="text-[10px] text-gray-300 mt-10 uppercase font-bold tracking-widest">Made by Ayaan</p>
      </div>
    );
  }

  if (currentUser) {
    return (
      <Dashboard 
        user={currentUser} 
        users={users}
        tasks={tasks}
        setTasks={handleUpdateTasks}
        instructions={instructions}
        setInstructions={handleUpdateInstructions}
        attendance={attendance}
        setAttendance={handleUpdateAttendance}
        salaries={salaries}
        setSalaries={handleUpdateSalaries}
        onLogout={handleLogout} 
      />
    );
  }

  return <LoginPage users={users} onLogin={handleLogin} />;
};

export default App;
