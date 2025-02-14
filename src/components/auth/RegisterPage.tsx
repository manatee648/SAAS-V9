import React, { useState } from 'react';
import { Dumbbell, ArrowLeft } from 'lucide-react';
import type { User, UserRole } from '../../types';

// Mock organizations (in a real app, this would come from your backend)
const MOCK_ORGANIZATIONS = [
  { id: '1', name: 'Fitness First', code: 'FF123' },
  { id: '2', name: 'Elite Athletics', code: 'EA456' },
];

type RegisterPageProps = {
  onRegister: (user: User) => void;
  onNavigate: (page: 'landing' | 'login' | 'register') => void;
};

function RegisterPage({ onRegister, onNavigate }: RegisterPageProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: '' as UserRole,
    organizationCode: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      setStep(2);
      return;
    }

    // Validate organization code
    const organization = MOCK_ORGANIZATIONS.find(
      org => org.code === formData.organizationCode
    );

    if (!organization) {
      setError('Invalid organization code');
      return;
    }

    // In a real app, this would be handled by your backend
    const newUser: User = {
      id: Date.now().toString(),
      email: formData.email,
      name: formData.name,
      role: formData.role,
      organizationId: organization.id,
    };

    onRegister(newUser);
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
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600">Step {step} of 2</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'coach' })}
                    className={`p-3 rounded-lg border ${
                      formData.role === 'coach'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-indigo-600'
                    }`}
                  >
                    Coach
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'athlete' })}
                    className={`p-3 rounded-lg border ${
                      formData.role === 'athlete'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-indigo-600'
                    }`}
                  >
                    Athlete
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="organizationCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Code
                </label>
                <input
                  type="text"
                  id="organizationCode"
                  value={formData.organizationCode}
                  onChange={(e) => setFormData({ ...formData, organizationCode: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                  placeholder="Enter your organization code"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Get this from your organization administrator
                </p>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {step === 1 ? 'Continue' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo Organization Codes:</p>
          <p>Fitness First: FF123</p>
          <p>Elite Athletics: EA456</p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;