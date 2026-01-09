
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <div className="hidden md:flex flex-1 bg-slateGray text-white flex-col justify-center items-center p-12 text-center">
        <div className="mb-8">
           <div className="w-32 h-32 bg-safetyOrange rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-12">
             <span className="text-5xl font-black text-white">VJ</span>
           </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">VJ GOTE BROTHERS</h1>
        <p className="text-xl text-gray-300 font-light max-w-md italic">"Excellence in Engineering & Infrastructure"</p>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-safetyOrange rounded-xl flex items-center justify-center mb-4 shadow-lg">
               <span className="text-2xl font-black text-white">VJ</span>
            </div>
            <h1 className="text-2xl font-bold text-slateGray uppercase tracking-tighter">VJ GOTE BROTHERS</h1>
            <p className="text-sm text-gray-500">Official Portal</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-800">Secure Login</h2>
              <p className="text-sm text-gray-500 mt-1">Please enter your company credentials</p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safetyOrange outline-none transition-all"
                  placeholder="name@vjgote.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safetyOrange outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-safetyOrange hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-all shadow-lg active:scale-[0.98] mt-2 uppercase tracking-widest text-sm"
              >
                Enter Workspace
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Contact HR to request account access
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-slateGray text-xs font-bold mt-1">
              Made by <span className="text-safetyOrange">Ayaan</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
