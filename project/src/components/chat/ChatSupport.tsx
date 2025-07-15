import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  AlertTriangle,
  RotateCcw,
  HelpCircle,
  Loader
} from 'lucide-react';
import { chatSupportAPI } from '../../services/ChatSupportAPI';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  suggestions?: string[];
  resources?: string[];
  isEmergency?: boolean;
}

interface ChatSupportProps {
  className?: string;
}

export const ChatSupport: React.FC<ChatSupportProps> = ({ className = '' }) => {
  const { user } = useAuth();

  console.log('🔧 ChatSupport component rendering...', { user: user?.name });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `Hello ${user?.name || 'there'}! 👋 I'm your AI mental health support assistant. I'm here to listen, provide support, and help you find resources. How are you feeling today?`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmergencyHelp, setShowEmergencyHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      console.log('🤖 Sending message to AI:', messageText);
      const response = await chatSupportAPI.sendMessage(messageText);
      console.log('✅ AI Response received:', response);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions,
        resources: response.resources,
        isEmergency: response.isEmergency
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Show emergency help if needed
      if (response.isEmergency) {
        setShowEmergencyHelp(true);
      }

    } catch (error) {
      console.error('❌ Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again, or if this is an emergency, please contact emergency services immediately at 988 or 911.",
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ["Try sending your message again", "Contact emergency services if urgent"],
        resources: ["🆘 National Suicide Prevention Lifeline: 988", "🆘 Emergency Services: 911"]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: `Hello ${user?.name || 'there'}! 👋 I'm your AI mental health support assistant. I'm here to listen, provide support, and help you find resources. How are you feeling today?`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    chatSupportAPI.clearHistory();
  };

  const quickResponses = [
    "I'm feeling anxious",
    "I'm having a hard day",
    "I need someone to talk to",
    "I'm feeling overwhelmed",
    "I need coping strategies",
    "I'm feeling better today"
  ];

  console.log('🎯 ChatSupport rendering with messages:', messages.length);

  return (
    <div className={`w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden h-[700px] ${className}`}>
      {/* Debug info */}
      <div className="bg-yellow-100 p-2 text-xs text-yellow-800 border-b">
        🔧 ChatSupport loaded • User: {user?.name || 'Anonymous'} • Messages: {messages.length}
      </div>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Mental Health Support Chat</h3>
            <p className="text-blue-100 text-sm">AI Assistant • {isLoading ? 'Thinking...' : 'Ready to help'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmergencyHelp(true)}
            className="p-2 hover:bg-red-600 rounded-full bg-red-500 transition-colors"
            title="Emergency Help"
          >
            <AlertTriangle className="h-4 w-4" />
          </button>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Clear Chat"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-2 rounded-full ${message.sender === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl p-3 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : message.isEmergency 
                      ? 'bg-red-50 border border-red-200 text-red-900'
                      : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600 font-medium">Suggestions:</p>
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition-colors"
                    >
                      💡 {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Resources */}
              {message.resources && message.resources.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600 font-medium">Resources:</p>
                  {message.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg"
                    >
                      {resource}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {(isTyping || isLoading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-purple-600">
                {isLoading ? (
                  <Loader className="h-4 w-4 text-white animate-spin" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {isLoading ? 'AI is thinking...' : 'Typing...'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Responses */}
      {messages.length === 1 && (
        <div className="p-3 bg-white border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2 font-medium">Quick responses:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(response)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-left"
              >
                {response}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            disabled={isTyping || isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping || isLoading}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          💙 AI Mental Health Assistant • For emergencies: 988 or 911
        </p>
      </div>

      {/* Emergency Help Modal */}
      <AnimatePresence>
        {showEmergencyHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
            onClick={() => setShowEmergencyHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Emergency Resources</h3>
                  <p className="text-sm text-gray-600">Immediate help is available</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">🆘 Crisis Support</h4>
                  <div className="space-y-2 text-sm text-red-800">
                    <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
                    <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                    <p><strong>Emergency Services:</strong> 911</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">💙 You Matter</h4>
                  <p className="text-sm text-blue-800">
                    Your life has value and meaning. Professional help is available 24/7. 
                    You don't have to face this alone.
                  </p>
                </div>

                <button
                  onClick={() => setShowEmergencyHelp(false)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatSupport;
