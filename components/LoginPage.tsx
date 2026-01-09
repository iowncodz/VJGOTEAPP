
import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
  users: User[];
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ users, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const logoUrl = "https://cdn-icons-png.flaticon.com/512/1063/1063376.png";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    
    if (user) {
      if (password.length >= 4) {
        onLogin(user);
      } else {
        setError('Invalid credentials.');
      }
    } else {
      setError('Access denied. Only registered staff can login.');
    }
  };

  const handleReset = () => {
    if (window.confirm("This will clear all local session data and reload the app. Use this if you are having loading issues. Continue?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <div className="hidden md:flex flex-1 bg-slateGray text-white flex-col justify-center items-center p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: `url(${logoUrl})`, backgroundSize: '100px', backgroundRepeat: 'repeat' }}></div>
        <div className="mb-8 relative z-10">
           <div className="w-40 h-40 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/20">
             <img src={logoUrl} className="w-24 h-24 drop-shadow-lg" alt="VJ Gote Logo" />
           </div>
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tighter z-10">VJ GOTE BROTHERS</h1>
        <p className="text-xl text-gray-400 font-light max-w-md italic z-10 tracking-wide">"Building Tomorrow's Foundations Today"</p>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="md:hidden flex flex-col items-center mb-8">
            <img src={logoUrl} className="w-20 h-20 mb-4 drop-shadow-xl" alt="Logo" />
            <h1 className="text-2xl font-black text-slateGray uppercase tracking-tighter">VJ GOTE BROTHERS</h1>
            <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Management Portal</p>
          </div>
          
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-slateGray tracking-tight">Staff Login</h2>
              <div className="w-12 h-1 bg-safetyOrange mx-auto mt-4 rounded-full"></div>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 text-center animate-bounce">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-safetyOrange outline-none transition-all font-medium"
                  placeholder="name@vjgote.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Key</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-safetyOrange outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-safetyOrange hover:bg-orange-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-200 active:scale-[0.98] mt-4 uppercase tracking-[0.2em] text-xs"
              >
                Access Dashboard
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-100 text-center flex flex-col space-y-4">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                Contact Management for Account Setup
              </p>
              <button 
                onClick={handleReset}
                className="text-[9px] text-gray-300 hover:text-safetyOrange font-black uppercase tracking-widest transition-colors"
              >
                Sync Issues? Force Reload
              </button>
            </div>
          </div>
          
          <div className="mt-12 text-center opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
            <p className="text-slateGray text-[10px] font-black uppercase tracking-[0.3em]">
              Architected by <span className="text-safetyOrange">Ayaan</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
