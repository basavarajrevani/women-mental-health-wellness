import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, RotateCcw, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAIResponse } from '../../utils/ai';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  suggestProfessional?: boolean;
}

export const SimpleChatSupport: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${user?.name || 'there'}! 👋 I'm your AI mental health support assistant powered by Google Gemini. I'm here to listen, provide support, and help you find resources. How are you feeling today?`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Crisis detection for immediate intervention
  const detectCrisis = (message: string): boolean => {
    const crisisKeywords = [
      'suicide', 'kill myself', 'hurt myself', 'end it all', 'want to die',
      'no point living', 'better off dead', 'self harm', 'cut myself'
    ];
    const lowerMessage = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Check for crisis keywords and show immediate alert
    if (detectCrisis(messageText)) {
      setTimeout(() => {
        alert('🆘 Crisis Support Alert\n\nI\'m concerned about your safety. Please reach out for immediate help:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency Services: 911\n\nYou don\'t have to go through this alone. Help is available 24/7.');
      }, 500);
    }

    try {
      // Get AI response using Gemini
      const aiResponse = await getAIResponse(messageText, chatHistory);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestProfessional: aiResponse.suggestProfessional
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update chat history for context
      setChatHistory(prev => [
        ...prev,
        { role: 'user', parts: messageText },
        { role: 'model', parts: aiResponse.content }
      ]);

    } catch (error) {
      console.error('Error getting AI response:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment. If you're in crisis, please contact 988 or emergency services immediately.",
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: `Hello ${user?.name || 'there'}! 👋 I'm your AI mental health support assistant powered by Google Gemini. I'm here to listen, provide support, and help you find resources. How are you feeling today?`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatHistory([]); // Clear chat history as well
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden h-[500px] sm:h-[600px] lg:h-[700px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="bg-white/20 p-1.5 sm:p-2 rounded-full flex-shrink-0">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm sm:text-base truncate">Mental Health Support Chat</h3>
            <p className="text-blue-100 text-xs sm:text-sm truncate">Powered by Gemini AI • {isLoading ? 'Thinking...' : 'Ready to help'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => alert('🆘 Emergency Resources:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency Services: 911')}
            className="p-1.5 sm:p-2 hover:bg-red-600 rounded-full bg-red-500 transition-colors"
            title="Emergency Help"
          >
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={clearChat}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Clear Chat"
          >
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] sm:max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start gap-1.5 sm:gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${message.sender === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                  {message.sender === 'user' ? (
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  ) : (
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl p-2.5 sm:p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

                  {/* Professional help suggestion */}
                  {message.sender === 'assistant' && message.suggestProfessional && (
                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <p className="text-xs text-amber-800 font-medium">
                          Consider speaking with a mental health professional for personalized support.
                        </p>
                      </div>
                    </div>
                  )}

                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                <Loader className="h-4 w-4 text-white animate-spin" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">Gemini AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Responses */}
      {messages.length === 1 && (
        <div className="p-3 bg-white border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2 font-medium">Quick responses:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              "I'm feeling anxious",
              "I'm having a hard day",
              "I need someone to talk to",
              "I'm feeling overwhelmed",
              "I need coping strategies",
              "I'm feeling better today"
            ].map((response, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(response)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-left"
              >
                {response}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 text-white p-2 sm:p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          💙 Powered by Google Gemini AI • For emergencies: 988 or 911
        </p>
      </div>
    </div>
  );
};

export default SimpleChatSupport;
