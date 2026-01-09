
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
      // Mock password check for demo; typically password would be validated on server
      if (password.length >= 4) {
        onLogin(user);
      } else {
        setError('Invalid access key.');
      }
    } else {
      setError('Access denied. Only registered staff can login.');
    }
  };

  const handleReset = () => {
    if (window.confirm("Clear session and reload?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left Branding Panel */}
      <div className="hidden md:flex flex-1 bg-slate-800 text-white flex-col justify-center items-center p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: `url(${logoUrl})`, backgroundSize: '120px', backgroundRepeat: 'repeat' }}></div>
        <div className="mb-8 relative z-10">
           <div className="w-48 h-48 bg-white/10 backdrop-blur-xl rounded-[3rem] flex items-center justify-center shadow-2xl border border-white/20">
             <img src={logoUrl} className="w-28 h-28 drop-shadow-2xl" alt="VJ Gote Logo" />
           </div>
        </div>
        <div className="z-10">
          <h1 className="text-5xl font-black mb-4 tracking-tighter">VJ GOTE BROTHERS</h1>
          <div className="h-1.5 w-24 bg-orange-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-slate-400 font-medium max-w-md italic tracking-wide">"Building Tomorrow's Foundations Today"</p>
        </div>
        <div className="absolute bottom-10 text-[10px] font-black tracking-[0.4em] opacity-30">EST. 1998</div>
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-4 p-3 border border-gray-100">
              <img src={logoUrl} className="w-full h-full" alt="Logo" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">VJ GOTE</h1>
            <p className="text-[10px] text-orange-500 font-black tracking-[0.3em] uppercase mt-1">Infrastructure Portal</p>
          </div>
          
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-white">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Staff Login</h2>
              <p className="text-slate-400 text-xs mt-2 font-medium">Enter your credentials to access the cloud portal</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-[11px] font-black rounded-2xl border border-red-100 text-center animate-pulse uppercase tracking-widest">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-500/30 focus:bg-white outline-none transition-all font-semibold text-slate-800"
                    placeholder="name@vjgote.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Access Key</label>
                <div className="relative group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-500/30 focus:bg-white outline-none transition-all font-semibold text-slate-800"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98] mt-4 uppercase tracking-[0.2em] text-xs"
              >
                Access Dashboard
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-50 text-center flex flex-col space-y-4">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Secured Infrastructure Management Portal
              </p>
              <button 
                onClick={handleReset}
                className="text-[9px] text-slate-300 hover:text-orange-500 font-black uppercase tracking-[0.2em] transition-colors"
              >
                Sync Issues? Force Reload
              </button>
            </div>
          </div>
          
          <div className="mt-12 text-center opacity-30 transition-all hover:opacity-100 cursor-default group">
            <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.4em]">
              Architected by <span className="text-orange-500 group-hover:underline">Ayaan</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
