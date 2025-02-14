import React from 'react';
import { Bot } from 'lucide-react';

type AICoachButtonProps = {
  onClick: () => void;
};

function AICoachButton({ onClick }: AICoachButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
    >
      <Bot className="w-6 h-6" />
    </button>
  );
}

export default AICoachButton;