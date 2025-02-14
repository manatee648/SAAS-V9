import React, { useState } from 'react';
import { Dumbbell, ArrowLeft } from 'lucide-react';
import type { User } from '../../types';

// Mock organizations (in a real app, this would come from your backend)
const MOCK_ORGANIZATIONS = [
  { id: '1', name: 'Fitness First', code: 'FF123' },
  { id: '2', name: 'Elite Athletics', code: 'EA456' },
];

// Mock users (in a real app, this would come from your backend)
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'coach@example.com',
    name: 'John Coach',
    role: 'coach',
    organizationId: '1',
  },
  {
    id: '2',
    email: 'athlete@example.com',
    name: 'Jane Athlete',
    role: 'athlete',
    organizationId: '1',
  },
  {
    id: '3',
    email: 'athlete2@example.com',
    name: 'Bob Athlete',
    role: 'athlete',
    organizationId: '2',
  },
];

type LoginPageProps = {
  onLogin: (user: User) => void;
  onNavigate: (page: 'landing' | 'login' | 'register') => void;
};

function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = MOCK_USERS.find((u) => u.email === email);
    if (user && password === 'password') { // In real app, use proper password hashing
      onLogin(user);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <button
            onClick={() => onNavigate('landing')}
            className="self-start flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <Dumbbell className="w-12 h-12 text-indigo-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo Accounts:</p>
          <p>Coach: coach@example.com</p>
          <p>Athletes: athlete@example.com, athlete2@example.com</p>
          <p>Password: password</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;