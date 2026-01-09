
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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, t, i, a, s] = await Promise.all([
          db.collection('users'),
          db.collection('tasks'),
          db.collection('instructions'),
          db.collection('attendance'),
          db.collection('salaries')
        ]);

        if (u.length === 0) {
          // Silent initialization of mock data
          await Promise.all([
            db.setCollection('users', MOCK_USERS),
            db.setCollection('tasks', MOCK_TASKS),
            db.setCollection('instructions', MOCK_INSTRUCTIONS)
          ]);
          setUsers(MOCK_USERS);
          setTasks(MOCK_TASKS);
          setInstructions(MOCK_INSTRUCTIONS);
        } else {
          setUsers(u);
          setTasks(t);
          setInstructions(i);
          setAttendance(a);
          setSalaries(s);
        }
      } catch (err) {
        console.error("Data fetch error", err);
      } finally {
        setIsReady(true);
      }
    };

    const unsubscribe = db.onSnapshot(() => {
      fetchData();
    });

    fetchData();
    
    const savedUser = localStorage.getItem('vjgote_session');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

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

  // We only show a very minimal spinner if the app is literally still parsing the JS
  if (!isReady) {
    return (
      <div className="min-h-screen bg-deepBlue flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-safetyOrange border-t-transparent rounded-full animate-spin"></div>
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
