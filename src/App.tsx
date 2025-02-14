import React, { useState } from 'react';
import { Dumbbell, Bell } from 'lucide-react';
import type { User } from './types';
import CoachDashboard from './components/coach/CoachDashboard';
import AthleteDashboard from './components/AthleteDashboard';
import LandingPage from './components/auth/LandingPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import AICoachButton from './components/AICoachButton';
import AICoachChat from './components/AICoachChat';

type AuthPage = 'landing' | 'login' | 'register';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<AuthPage>('landing');
  const [showAICoach, setShowAICoach] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAuthPage('landing');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthPage('landing');
    setShowAICoach(false);
  };

  // Show the appropriate authentication page
  if (!user) {
    switch (authPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={setAuthPage} />;
      case 'register':
        return <RegisterPage onRegister={handleLogin} onNavigate={setAuthPage} />;
      default:
        return <LandingPage onNavigate={setAuthPage} />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">Workout Programs</h1>
            </div>
            <div className="flex items-center gap-4">
              {user.role === 'coach' && (
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </button>
              )}
              <span className="text-gray-600">
                Welcome, {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {user.role === 'coach' ? (
        <CoachDashboard user={user} onNewMessage={() => setUnreadMessages(prev => prev + 1)} />
      ) : (
        <AthleteDashboard user={user} />
      )}

      {showAICoach ? (
        <AICoachChat onClose={() => setShowAICoach(false)} />
      ) : (
        <AICoachButton onClick={() => setShowAICoach(true)} />
      )}
    </div>
  );
}

export default App;