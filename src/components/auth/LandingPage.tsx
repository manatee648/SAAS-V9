import React from 'react';
import { Dumbbell, ArrowRight } from 'lucide-react';

type LandingPageProps = {
  onNavigate: (page: 'landing' | 'login' | 'register') => void;
};

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <Dumbbell className="w-16 h-16 text-indigo-600 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Transform Your Training
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Connect coaches and athletes with personalized workout programs, real-time tracking, and team collaboration.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('register')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-3 text-indigo-600 hover:text-indigo-700 transition-colors text-lg font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                For Coaches
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Create and manage workout programs</li>
                <li>• Track athlete progress</li>
                <li>• Organize teams and groups</li>
                <li>• Real-time communication</li>
              </ul>
            </div>
            <div className="p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                For Athletes
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Access personalized workouts</li>
                <li>• Track your progress</li>
                <li>• Connect with your team</li>
                <li>• Get coach feedback</li>
              </ul>
            </div>
            <div className="p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                For Teams
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Team leaderboards</li>
                <li>• Group progress tracking</li>
                <li>• Team communication</li>
                <li>• Shared workout programs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}