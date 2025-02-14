import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import type { User, Message } from '../types';

// Mock messages (in a real app, this would come from your backend)
const MOCK_MESSAGES: Record<string, Message[]> = {
  'coach-athlete': [
    {
      id: '1',
      senderId: '1', // coach
      receiverId: '2', // athlete
      content: 'How is your training going?',
      timestamp: new Date('2024-02-20T10:00:00'),
      read: true,
    },
    {
      id: '2',
      senderId: '2', // athlete
      receiverId: '1', // coach
      content: 'Going well! Completed all sets today.',
      timestamp: new Date('2024-02-20T10:05:00'),
      read: true,
    },
  ],
};

// Mock coach data (in a real app, this would come from your backend)
const MOCK_COACH = {
  id: '1',
  name: 'John Smith',
  email: 'coach@example.com',
  role: 'coach' as const,
  organizationId: '1',
};

type ChatInterfaceProps = {
  currentUser: User;
  otherUser: User;
  onClose?: () => void;
  isModal?: boolean;
  onNewMessage?: () => void;
};

function ChatInterface({ currentUser, otherUser, onClose, isModal = false, onNewMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(
    MOCK_MESSAGES['coach-athlete'] || []
  );
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: otherUser.id,
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false,
    };

    // In a real app, this would be handled by your backend
    // The backend would:
    // 1. Save the message
    // 2. Send a real-time notification to the coach (e.g., via WebSocket)
    // 3. Send a push notification if the coach is offline
    // 4. Update the coach's unread message count
    if (currentUser.role === 'athlete' && otherUser.role === 'coach') {
      // Notify coach of new message
      onNewMessage?.();
      
      // For demo purposes, we'll show a browser notification
      if (Notification.permission === 'granted') {
        new Notification('New Message from Athlete', {
          body: `${currentUser.name}: ${message.content}`,
          icon: '/notification-icon.png'
        });
      }
    }

    setMessages([...messages, message]);
    setNewMessage('');
  };

  // Request notification permission when an athlete starts a chat
  useEffect(() => {
    if (currentUser.role === 'athlete' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [currentUser.role]);

  // Get the display name for the chat header
  const getDisplayName = () => {
    if (otherUser.role === 'coach') {
      return `Coach ${MOCK_COACH.name.split(' ')[0]}`; // Show "Coach John" instead of just "Coach"
    }
    return otherUser.name;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col" style={{ maxHeight: '600px', height: isModal ? '600px' : '100%' }}>
      {/* Chat Header */}
      <div className="px-4 py-3 border-b bg-indigo-600 text-white rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{getDisplayName()}</h3>
          <p className="text-sm text-indigo-100">{otherUser.role === 'coach' ? 'Your Coach' : 'Athlete'}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUser.id;
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] break-words rounded-lg px-4 py-2 ${
                  isCurrentUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatInterface;