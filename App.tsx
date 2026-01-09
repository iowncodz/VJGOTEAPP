// @ts-ignore
const React = window.React;
const { useState, useEffect, useCallback } = React;

import { User, UserRole, Task, Instruction, AttendanceRecord, SalaryRecord } from './types';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { MOCK_USERS, MOCK_TASKS, MOCK_INSTRUCTIONS } from './constants';
import { db } from './lib/db';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vjgote_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [users, setUsers] = useState(MOCK_USERS);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [instructions, setInstructions] = useState(MOCK_INSTRUCTIONS);
  const [attendance, setAttendance] = useState([]);
  const [salaries, setSalaries] = useState([]);
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
    window.location.reload();
  };

  if (isBootstrapping) {
    return React.createElement('div', { className: "flex items-center justify-center min-h-screen bg-slate-900" }, 
      React.createElement('div', { className: "text-orange-500 font-bold" }, "SYNCING...")
    );
  }

  if (currentUser) {
    return React.createElement(Dashboard, {
      user: currentUser,
      users: users,
      tasks: tasks,
      setTasks: (val: any) => db.setCollection('tasks', val),
      instructions: instructions,
      setInstructions: (val: any) => db.setCollection('instructions', val),
      attendance: attendance,
      setAttendance: (val: any) => db.setCollection('attendance', val),
      salaries: salaries,
      setSalaries: (val: any) => db.setCollection('salaries', val),
      onLogout: handleLogout
    });
  }

  return React.createElement(LoginPage, { users: users, onLogin: handleLogin });
};

export default App;