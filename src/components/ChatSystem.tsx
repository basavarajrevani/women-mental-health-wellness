import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Smile,
  Paperclip,
  X,
  Users,
  Phone,
  Video,
  MoreVertical,
  AlertTriangle,
  Heart,
  Shield,
  Clock,
  Star,
  Flag,
  UserPlus,
  Headphones,
  Zap
} from 'lucide-react';
import { useGlobalContext } from '../contexts/GlobalContext';

const ChatSystem: React.FC = () => {
  const { chatRooms, activeChatRoom, setActiveChatRoom, sendChatMessage, currentUser, addNotification } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCrisisHelp, setShowCrisisHelp] = useState(false);
  const [showPeerSupport, setShowPeerSupport] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Crisis keywords detection
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm',
    'want to die', 'no point', 'hopeless', 'can\'t go on', 'give up'
  ];

  // Peer support matching
  const [availablePeers] = useState([
    { id: 'peer1', name: 'Sarah M.', avatar: '👩‍⚕️', specialties: ['anxiety', 'depression'], isOnline: true, rating: 4.9 },
    { id: 'peer2', name: 'Alex J.', avatar: '🌟', specialties: ['trauma', 'PTSD'], isOnline: true, rating: 4.8 },
    { id: 'peer3', name: 'Maya K.', avatar: '🦋', specialties: ['eating disorders', 'body image'], isOnline: false, rating: 4.7 },
    { id: 'peer4', name: 'Jordan L.', avatar: '🌈', specialties: ['LGBTQ+ support', 'identity'], isOnline: true, rating: 4.9 },
  ]);

  const activeRoom = chatRooms.find(room => room.id === activeChatRoom);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeRoom?.messages]);

  const detectCrisisMessage = (messageText: string): boolean => {
    const lowerMessage = messageText.toLowerCase();
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const handleCrisisIntervention = () => {
    setShowCrisisHelp(true);

    // Send immediate support message
    if (activeChatRoom && currentUser) {
      sendChatMessage(activeChatRoom, {
        senderId: 'system',
        senderName: 'Crisis Support Bot',
        senderAvatar: '🆘',
        content: 'I noticed you might be going through a difficult time. You\'re not alone. Professional help is available 24/7. Please consider reaching out to a crisis helpline or emergency services if you\'re in immediate danger.',
        type: 'text',
        isEdited: false,
        reactions: {},
      });
    }

    // Add urgent notification
    addNotification({
      userId: currentUser?.id || '',
      type: 'system',
      title: 'Crisis Support Available',
      message: 'Immediate help resources have been provided. You matter and help is available.',
      isRead: false,
    });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !activeChatRoom || !currentUser) return;

    // Check for crisis keywords
    if (detectCrisisMessage(message)) {
      handleCrisisIntervention();
    }

    sendChatMessage(activeChatRoom, {
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderAvatar: currentUser.avatar,
      content: message.trim(),
      type: 'text',
      isEdited: false,
      reactions: {},
    });

    setMessage('');
    inputRef.current?.focus();
  };

  const connectToPeerSupport = (peerId: string) => {
    const peer = availablePeers.find(p => p.id === peerId);
    if (peer && currentUser) {
      // Create a private peer support room
      const supportRoomId = `peer_support_${currentUser.id}_${peerId}`;

      addNotification({
        userId: currentUser.id,
        type: 'system',
        title: 'Peer Support Connected',
        message: `You've been connected with ${peer.name} for peer support. They specialize in ${peer.specialties.join(', ')}.`,
        isRead: false,
      });

      setShowPeerSupport(false);
      alert(`Connected with ${peer.name} for peer support!`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const emojis = ['😊', '😂', '❤️', '👍', '👏', '🙏', '💪', '🌟', '🎉', '🤗', '😢', '😰', '😌', '🧘‍♀️', '🌈'];

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <MessageCircle className="h-6 w-6" />
        {chatRooms.some(room => room.messages.length > 0) && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">
                    {activeRoom ? activeRoom.name : 'Support Chat'}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {activeRoom ? `${activeRoom.participants.length} members` : 'Select a room'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCrisisHelp(true)}
                  className="p-1 hover:bg-red-700 rounded bg-red-600"
                  title="Crisis Help"
                >
                  <AlertTriangle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowPeerSupport(true)}
                  className="p-1 hover:bg-green-700 rounded bg-green-600"
                  title="Peer Support"
                >
                  <UserPlus className="h-4 w-4" />
                </button>
                {activeRoom && (
                  <>
                    <button className="p-1 hover:bg-blue-700 rounded">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-blue-700 rounded">
                      <Video className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-blue-700 rounded">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-blue-700 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!activeRoom ? (
              /* Room Selection */
              <div className="flex-1 p-4">
                <h4 className="font-medium text-gray-900 mb-3">Choose a support room:</h4>
                <div className="space-y-2">
                  {chatRooms.map((room) => (
                    <motion.button
                      key={room.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveChatRoom(room.id)}
                      className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">{room.name}</h5>
                          <p className="text-sm text-gray-600">{room.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{room.participants.length}</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeRoom.messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No messages yet</p>
                      <p className="text-gray-400 text-sm">Start the conversation!</p>
                    </div>
                  ) : (
                    activeRoom.messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${
                          msg.senderId === currentUser?.id ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                            {msg.senderAvatar}
                          </div>
                        </div>
                        <div className={`flex-1 max-w-xs ${
                          msg.senderId === currentUser?.id ? 'text-right' : ''
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-700">
                              {msg.senderId === currentUser?.id ? 'You' : msg.senderName}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <div className={`p-3 rounded-lg ${
                            msg.senderId === currentUser?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          {Object.keys(msg.reactions).length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {Object.entries(msg.reactions).map(([emoji, users]) => (
                                <span
                                  key={emoji}
                                  className="text-xs bg-gray-200 px-2 py-1 rounded-full"
                                >
                                  {emoji} {users.length}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full p-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Smile className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                          <Paperclip className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </motion.button>
                  </div>

                  {/* Emoji Picker */}
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 grid grid-cols-5 gap-2"
                      >
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addEmoji(emoji)}
                            className="p-2 hover:bg-gray-100 rounded text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crisis Help Modal */}
      <AnimatePresence>
        {showCrisisHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Crisis Support</h3>
                </div>
                <button
                  onClick={() => setShowCrisisHelp(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">🆘 Immediate Help</h4>
                  <p className="text-red-800 text-sm mb-3">
                    If you're in immediate danger or having thoughts of self-harm, please contact emergency services or a crisis helpline right away.
                  </p>
                  <div className="space-y-2">
                    <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                      📞 Call 988 (Suicide & Crisis Lifeline)
                    </button>
                    <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                      💬 Text HOME to 741741 (Crisis Text Line)
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">🤝 Professional Support</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => window.location.hash = '/resources'}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Find Therapists & Counselors
                    </button>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Schedule Emergency Session
                    </button>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">💚 Community Support</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setShowCrisisHelp(false);
                        setShowPeerSupport(true);
                      }}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Connect with Peer Support
                    </button>
                    <button
                      onClick={() => window.location.hash = '/community'}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Join Support Groups
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Remember: You are not alone. Your life has value. Help is available.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Peer Support Modal */}
      <AnimatePresence>
        {showPeerSupport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserPlus className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Peer Support</h3>
                </div>
                <button
                  onClick={() => setShowPeerSupport(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 text-sm">
                  Connect with trained peer supporters who have lived experience and can provide understanding, hope, and practical guidance.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Available Peer Supporters</h4>
                {availablePeers.map((peer) => (
                  <div key={peer.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                            {peer.avatar}
                          </div>
                          {peer.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{peer.name}</h5>
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{peer.rating}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className={`text-sm ${peer.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                              {peer.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {peer.specialties.map((specialty, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => connectToPeerSupport(peer.id)}
                        disabled={!peer.isOnline}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          peer.isOnline
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {peer.isOnline ? 'Connect' : 'Offline'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2">What to Expect</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Confidential one-on-one support</li>
                  <li>• Shared lived experience and understanding</li>
                  <li>• Practical coping strategies and resources</li>
                  <li>• Non-judgmental listening and encouragement</li>
                  <li>• Connection to additional support services</li>
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatSystem;
