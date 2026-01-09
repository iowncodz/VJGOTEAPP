import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Task, Instruction, AttendanceRecord, SalaryRecord } from './types';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { MOCK_USERS, MOCK_TASKS, MOCK_INSTRUCTIONS } from './constants';
import { db } from './lib/db';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('vjgote_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [instructions, setInstructions] = useState<Instruction[]>(MOCK_INSTRUCTIONS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [u, t, i, a, s] = await Promise.all([
        db.collection('users'),
        db.collection('tasks'),
        db.collection('instructions'),
        db.collection('attendance'),
        db.collection('salaries')
      ]);
      
      if (u && u.length > 0) setUsers(u);
      if (t && t.length > 0) setTasks(t);
      if (i && i.length > 0) setInstructions(i);
      if (a) setAttendance(a);
      if (s) setSalaries(s);
    } catch (error) {
      console.error("Failed to load cloud data", error);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = db.onSnapshot(loadData);
    return () => {
      unsubscribe();
    };
  }, [loadData]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('vjgote_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vjgote_session');
    window.location.reload(); // Hard refresh on logout to clear any memory state
  };

  if (isBootstrapping) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-deepBlue">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-safetyOrange border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">VJ GOTE CLOUD SYNC</p>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return (
      <Dashboard 
        user={currentUser} 
        users={users}
        tasks={tasks}
        setTasks={(val) => db.setCollection('tasks', val)}
        instructions={instructions}
        setInstructions={(val) => db.setCollection('instructions', val)}
        attendance={attendance}
        setAttendance={(val) => db.setCollection('attendance', val)}
        salaries={salaries}
        setSalaries={(val) => db.setCollection('salaries', val)}
        onLogout={handleLogout} 
      />
    );
  }

  return <LoginPage users={users} onLogin={handleLogin} />;
};

export default App;