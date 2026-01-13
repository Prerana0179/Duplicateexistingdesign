import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Bot } from 'lucide-react';
import toolsPattern from "figma:asset/10e8c1d28c35a09d9b15b489e80678d303dbf696.png";

interface Message {
  id: string;
  sender: 'customer' | 'arvind';
  text: string;
  createdAtISO: string;
  status?: 'sent' | 'delivered' | 'read'; // For customer messages only
}

const CHAT_STORAGE_KEY = 'tatva_chat_arvind_thread_v1'; // Versioned key for migration

// WhatsApp-style tick components
const SingleTick = ({ color = '#9E9E9E' }: { color?: string }) => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 9L1.5 5L0.5 6L5.5 11L15.5 1L14.5 0L5.5 9Z" fill={color} />
  </svg>
);

const DoubleTick = ({ color = '#9E9E9E' }: { color?: string }) => (
  <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 9L0.5 5L-0.5 6L4.5 11L14.5 1L13.5 0L4.5 9Z" fill={color} />
    <path d="M8.5 9L4.5 5L3.5 6L8.5 11L18.5 1L17.5 0L8.5 9Z" fill={color} />
  </svg>
);

const MessageStatusTicks = ({ status }: { status?: 'sent' | 'delivered' | 'read' }) => {
  if (!status) return null;
  
  if (status === 'sent') {
    return <SingleTick color="#9E9E9E" />;
  } else if (status === 'delivered') {
    return <DoubleTick color="#9E9E9E" />;
  } else if (status === 'read') {
    return <DoubleTick color="#34B7F1" />;
  }
  
  return null;
};

// Real "Questions & Answers" conversation from My Projects page
// This is the canonical source of truth for the chat history
const REAL_QA_CONVERSATION = [
  {
    id: '1',
    sender: 'arvind' as const,
    text: 'Hello! I\'m Arvind, and I\'m here to help with your construction project.',
    createdAtISO: '2025-01-21T10:15:00.000Z',
  },
  {
    id: '2',
    sender: 'customer' as const,
    text: 'hii',
    createdAtISO: '2025-01-21T10:16:00.000Z',
  },
  {
    id: '3',
    sender: 'arvind' as const,
    text: 'Happy to connect. Choose a range for plot size in square feet:\n<1200 sqft.',
    createdAtISO: '2025-01-21T10:17:00.000Z',
  },
  {
    id: '4',
    sender: 'customer' as const,
    text: '<1200 sqft',
    createdAtISO: '2025-01-21T10:18:00.000Z',
  },
  {
    id: '5',
    sender: 'arvind' as const,
    text: 'Smart choice for urban living.\nPlot Type / Zone Options: BBMP, DTCP.',
    createdAtISO: '2025-01-21T10:19:00.000Z',
  },
  {
    id: '6',
    sender: 'customer' as const,
    text: 'DTCP',
    createdAtISO: '2025-01-21T10:20:00.000Z',
  },
  {
    id: '7',
    sender: 'arvind' as const,
    text: 'DTCP brings clear development guidelines.\nChoose approval status:\nYes | Started | Sure.',
    createdAtISO: '2025-01-21T10:21:00.000Z',
  },
  {
    id: '8',
    sender: 'customer' as const,
    text: 'In Progress',
    createdAtISO: '2025-01-21T10:22:00.000Z',
  },
  {
    id: '9',
    sender: 'arvind' as const,
    text: 'Active progress builds project momentum.\nWhat\'s the Soil Test Status?\nOptions: Yes (report available).',
    createdAtISO: '2025-01-21T10:23:00.000Z',
  },
  {
    id: '10',
    sender: 'customer' as const,
    text: 'Scheduled',
    createdAtISO: '2025-01-21T10:24:00.000Z',
  },
  {
    id: '11',
    sender: 'arvind' as const,
    text: 'Excellent for future stability.\nChoose floors:\nG +1 | +2 | +3.',
    createdAtISO: '2025-01-21T10:25:00.000Z',
  },
  {
    id: '12',
    sender: 'customer' as const,
    text: 'G+3',
    createdAtISO: '2025-01-21T10:26:00.000Z',
  },
  {
    id: '13',
    sender: 'arvind' as const,
    text: 'Maximizing your vertical space wisely.\nChoose structure type:\nOptions: RCC Frame.',
    createdAtISO: '2025-01-21T10:27:00.000Z',
  },
  {
    id: '14',
    sender: 'customer' as const,
    text: 'Hybrid',
    createdAtISO: '2025-01-21T10:28:00.000Z',
  },
  {
    id: '15',
    sender: 'arvind' as const,
    text: 'Leveraging diverse construction strengths.\nChoose construction stage:\nOptions: New Project.',
    createdAtISO: '2025-01-21T10:29:00.000Z',
  },
  {
    id: '16',
    sender: 'customer' as const,
    text: 'New Project',
    createdAtISO: '2025-01-21T10:30:00.000Z',
  },
  {
    id: '17',
    sender: 'arvind' as const,
    text: 'Solid foundation for future success.\nChoose your target timeline:\nOptions: < 3 months | 6–9 months.',
    createdAtISO: '2025-01-21T10:31:00.000Z',
  },
  {
    id: '18',
    sender: 'customer' as const,
    text: '6–9 months',
    createdAtISO: '2025-01-21T10:32:00.000Z',
  },
  {
    id: '19',
    sender: 'arvind' as const,
    text: 'Good pace for detailed work.\nChoose a budget range in Lakhs:\nOptions: < ₹20L | ₹35–50L.',
    createdAtISO: '2025-01-21T10:33:00.000Z',
  },
  {
    id: '20',
    sender: 'customer' as const,
    text: '₹35–50L',
    createdAtISO: '2025-01-21T10:34:00.000Z',
  },
];

// Helper function to detect if messages are demo/old data that should be replaced
const isDemoData = (messages: Message[]): boolean => {
  // Check if it's demo data by looking for telltale signs:
  // 1. Very short thread (< 10 messages)
  // 2. Contains generic demo responses like "Could you provide more details"
  // 3. Doesn't contain the real Q&A content markers
  
  if (messages.length < 10) {
    return true; // Too short to be the real Q&A conversation
  }
  
  // Check if it contains demo response patterns
  const hasDemoResponses = messages.some(msg => 
    msg.text.includes('Could you provide more details') ||
    msg.text.includes('Tell me what you need help with and I\'ll guide you') ||
    (msg.text === 'Hi! I\'m Arvind. Tell me what you need help with and I\'ll guide you.')
  );
  
  if (hasDemoResponses) {
    return true;
  }
  
  // Check if it contains real Q&A markers (plot size, DTCP, floors, budget)
  const hasRealQAContent = messages.some(msg => 
    msg.text.includes('plot size in square feet') ||
    msg.text.includes('DTCP') ||
    msg.text.includes('Choose floors') ||
    msg.text.includes('budget range in Lakhs')
  );
  
  // If it doesn't have real Q&A content, it's demo data
  return !hasRealQAContent;
};

// Helper function to format time
const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// Helper function to format date
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

// Helper function to check if two dates are the same day
const isSameDay = (iso1: string, iso2: string) => {
  const d1 = new Date(iso1);
  const d2 = new Date(iso2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

// Load chat history from localStorage
const loadChatHistory = (): Message[] => {
  try {
    // First, check for old storage keys and migrate them
    const oldKey = 'chat:arvind';
    const oldStored = localStorage.getItem(oldKey);
    if (oldStored) {
      console.log('🔄 Migrating from old storage key...');
      localStorage.removeItem(oldKey); // Clean up old key
    }
    
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      const existingMessages = JSON.parse(stored);
      
      // Check if existing data is demo/old data that should be replaced
      if (existingMessages.length > 0 && isDemoData(existingMessages)) {
        console.log('🔄 Detected demo data, replacing with real Q&A conversation...');
        saveChatHistory(REAL_QA_CONVERSATION);
        return REAL_QA_CONVERSATION;
      }
      
      // Valid existing data - return it
      if (existingMessages.length > 0) {
        return existingMessages;
      }
    }
    
    // First time or empty - seed with real Q&A conversation
    console.log('🌱 Seeding with real Q&A conversation...');
    saveChatHistory(REAL_QA_CONVERSATION);
    return REAL_QA_CONVERSATION;
  } catch (error) {
    console.error('Failed to load chat history:', error);
    // On error, return real Q&A conversation
    saveChatHistory(REAL_QA_CONVERSATION);
    return REAL_QA_CONVERSATION;
  }
};

// Save chat history to localStorage
const saveChatHistory = (messages: Message[]) => {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
};

// Get time-based greeting
const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else if (hour >= 17 && hour < 23) {
    return 'Good evening';
  } else {
    return 'Hello';
  }
};

// Get customer name (fallback to empty string if unavailable)
const getCustomerName = (): string => {
  // TODO: Integrate with actual customer profile when available
  // For now, return empty string to use fallback format
  return '';
};

// Generate personalized greeting for first message
const generatePersonalizedGreeting = (): string => {
  const greeting = getTimeBasedGreeting();
  const customerName = getCustomerName();
  
  if (customerName) {
    return `Hello ${greeting} ${customerName}, how can I assist you today?`;
  } else {
    return `Hello ${greeting}, how can I assist you today?`;
  }
};

// Generate mock Arvind response
const generateArvindResponse = (userMessage: string, isFirstMessage: boolean = false): string => {
  // For first message, always return personalized greeting
  if (isFirstMessage) {
    return generatePersonalizedGreeting();
  }
  
  const responses = [
    'Thanks for reaching out! I\'m reviewing your message and I\'m here to help with your project. What specific aspect would you like to discuss?',
    'I understand. Let me help you with that. Could you provide more details so I can assist you better?',
    'That\'s a great question! Based on your project details, I can guide you through the next steps.',
    'I see. Let me analyze your requirements and provide you with the best recommendations.',
  ];
  
  // Simple logic: pick response based on message length or keywords
  if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('?')) {
    return responses[0];
  } else if (userMessage.length > 50) {
    return responses[2];
  } else if (userMessage.toLowerCase().includes('budget') || userMessage.toLowerCase().includes('cost')) {
    return responses[3];
  }
  
  return responses[1];
};

export function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitialMessage = useRef(false);

  const scrollToBottom = () => {
    // Scroll the messages container, not the window
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Load existing chat history (will auto-seed if empty)
    const history = loadChatHistory();
    console.log('📚 Chat history loaded:', history.length, 'messages'); // Debug log
    setMessages(history);

    // Check if there's an initial message passed from the previous page
    const initialMessage = location.state?.initialMessage;
    
    if (initialMessage && !hasProcessedInitialMessage.current) {
      hasProcessedInitialMessage.current = true;
      
      // Check if this message is already the last message (avoid duplicates)
      const lastMessage = history[history.length - 1];
      const isDuplicate = lastMessage && 
                         lastMessage.sender === 'customer' && 
                         lastMessage.text === initialMessage;
      
      if (!isDuplicate) {
        // Add the user's initial message
        const userMessage: Message = {
          id: Date.now().toString(),
          sender: 'customer',
          text: initialMessage,
          createdAtISO: new Date().toISOString()
        };
        
        const updatedHistory = [...history, userMessage];
        setMessages(updatedHistory);
        saveChatHistory(updatedHistory);
        
        // Simulate Arvind's response after a delay
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const arvindReply: Message = {
              id: (Date.now() + 1).toString(),
              sender: 'arvind',
              text: generateArvindResponse(initialMessage, true),
              createdAtISO: new Date().toISOString()
            };
            
            const finalHistory = [...updatedHistory, arvindReply];
            setMessages(finalHistory);
            saveChatHistory(finalHistory);
          }, 700);
        }, 300);
      }
    }
  }, [location.state]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'customer',
      text: inputValue,
      createdAtISO: new Date().toISOString(),
      status: 'sent' // Initial status
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    setInputValue('');

    // Simulate message delivery after 300ms
    setTimeout(() => {
      const deliveredMessages = updatedMessages.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: 'delivered' as const }
          : msg
      );
      setMessages(deliveredMessages);
      saveChatHistory(deliveredMessages);
    }, 300);

    // Simulate Arvind's response after a delay
    setTimeout(() => {
      setIsTyping(true);
      
      // Mark message as read when AI starts typing
      const readMessages = updatedMessages.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, status: 'read' as const }
          : msg
      );
      setMessages(readMessages);
      saveChatHistory(readMessages);
      
      setTimeout(() => {
        setIsTyping(false);
        const arvindReply: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'arvind',
          text: generateArvindResponse(inputValue),
          createdAtISO: new Date().toISOString()
        };
        
        const finalMessages = [...readMessages, arvindReply];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      }, 700);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages with date separators
  const renderMessagesWithDates = () => {
    const elements: JSX.Element[] = [];
    
    messages.forEach((msg, index) => {
      const prevMsg = index > 0 ? messages[index - 1] : null;
      
      // Add date separator if this is the first message or if the date changed
      if (!prevMsg || !isSameDay(prevMsg.createdAtISO, msg.createdAtISO)) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const msgDate = new Date(msg.createdAtISO);
        let dateLabel = formatDate(msg.createdAtISO);
        
        // Check if it's today
        if (isSameDay(msg.createdAtISO, today.toISOString())) {
          dateLabel = 'Today';
        } 
        // Check if it's yesterday
        else if (isSameDay(msg.createdAtISO, yesterday.toISOString())) {
          dateLabel = 'Yesterday';
        }
        
        elements.push(
          <div key={`date-${msg.id}`} className="flex justify-center my-4">
            <div 
              style={{
                backgroundColor: '#E0E7E8',
                color: '#54656F',
                fontSize: '12px',
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)'
              }}
            >
              {dateLabel}
            </div>
          </div>
        );
      }
      
      // Add message bubble
      const isCustomer = msg.sender === 'customer';
      
      elements.push(
        <div
          key={msg.id}
          style={{
            display: 'flex',
            justifyContent: isCustomer ? 'flex-end' : 'flex-start',
            alignItems: 'flex-start',
            gap: '8px',
            marginBottom: '8px',
            paddingLeft: '8px',
            paddingRight: '8px'
          }}
        >
          {/* AI Avatar - Left side for AI messages */}
          {!isCustomer && (
            <div 
              className="flex-shrink-0"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E0E7FF 0%, #DDD6FE 100%)',
                color: '#6366F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bot className="w-4 h-4" strokeWidth={2.5} />
            </div>
          )}

          {/* Message bubble - WhatsApp style */}
          <div 
            style={{
              maxWidth: '70%',
              minWidth: '120px',
              backgroundColor: isCustomer ? '#DCF8C6' : '#FFFFFF',
              borderRadius: isCustomer ? '8px 8px 0 8px' : '8px 8px 8px 0',
              padding: '8px 12px 6px 12px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.12)',
              position: 'relative' as const
            }}
          >
            {/* Message text */}
            <p 
              style={{ 
                whiteSpace: 'pre-line', 
                color: '#111827',
                lineHeight: '1.4',
                fontSize: '14px',
                marginBottom: '16px',
                paddingRight: isCustomer ? '80px' : '60px' // Extra space for timestamp + ticks on customer messages
              }}
            >
              {msg.text}
            </p>
            
            {/* Timestamp and status row - WhatsApp style (bottom-right) */}
            <div 
              style={{ 
                position: 'absolute',
                bottom: '6px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span 
                style={{ 
                  color: '#667781',
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  fontWeight: 400
                }}
              >
                {formatTime(msg.createdAtISO)}
              </span>
              
              {/* Message status ticks - only for customer messages */}
              {isCustomer && msg.status && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '-2px' }}>
                  <MessageStatusTicks status={msg.status} />
                </div>
              )}
            </div>
          </div>

          {/* Customer Avatar - Right side for customer messages */}
          {isCustomer && (
            <div 
              className="flex-shrink-0"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#9B8AFB',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              C
            </div>
          )}
        </div>
      );
    });
    
    return elements;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - FIXED (doesn't scroll) */}
      <div 
        className="flex-shrink-0 bg-white border-b border-gray-200"
        style={{ zIndex: 50 }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-shrink-0">
              {/* Avatar circle - ONLY this element animates */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, #E0E7FF 0%, #DDD6FE 100%)',
                  color: '#6366F1',
                  animation: 'avatarPulse 2.2s ease-in-out infinite',
                }}
              >
                {/* Glow ring - inside avatar circle, behind icon */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    animation: 'avatarGlow 2.2s ease-in-out infinite',
                    zIndex: -1,
                  }}
                />
                
                {/* Bot icon on top */}
                <Bot className="w-6 h-6 relative z-10" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="font-semibold text-lg">Arvind</h1>
              <p className="text-xs text-gray-500">AI Assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container - ONLY THIS SCROLLS */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden relative"
        style={{
          backgroundColor: '#EFE7DC',
          backgroundImage: `linear-gradient(rgba(239, 231, 220, 0.80), rgba(239, 231, 220, 0.80)), url(${toolsPattern})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          backgroundPosition: 'top left',
          backgroundAttachment: 'local', // Scrolls with content (WhatsApp behavior)
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-6 pb-32 relative">
          <div className="space-y-4">
            {renderMessagesWithDates()}

            {/* Typing Indicator */}
            {isTyping && (
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '8px',
                  paddingLeft: '8px',
                  paddingRight: '8px'
                }}
              >
                {/* Typing bubble - WhatsApp style */}
                <div
                  style={{
                    maxWidth: '70%',
                    minWidth: '80px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px 8px 8px 0',
                    padding: '12px 16px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Three dots with pulse animation */}
                  <div className="flex gap-1 items-center">
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        backgroundColor: '#9CA3AF',
                        animationDelay: '0ms',
                        animationDuration: '1.2s'
                      }}
                    ></div>
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        backgroundColor: '#9CA3AF',
                        animationDelay: '150ms',
                        animationDuration: '1.2s'
                      }}
                    ></div>
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        backgroundColor: '#9CA3AF',
                        animationDelay: '300ms',
                        animationDuration: '1.2s'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Bar - FIXED (doesn't scroll) */}
      <div 
        className="flex-shrink-0 bg-white border-t border-gray-200"
        style={{ zIndex: 50 }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message…"
              style={{
                borderRadius: '12px', // Unified with Q&A input radius
                backgroundColor: '#F3F4F6',
                border: '1px solid rgba(17, 24, 39, 0.08)',
              }}
              className="flex-1 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              style={{
                borderRadius: '12px', // Unified with Q&A input radius
              }}
              className="bg-black text-white px-6 py-3 text-sm font-medium hover:bg-[#111111] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        /* AI Avatar Pulse Animation - Header (always active, medium pulse) */
        @keyframes avatarPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.04);
            opacity: 0.95;
          }
        }

        /* AI Avatar Pulse Animation - Active typing state (synced with dots at 1.2s) */
        @keyframes avatarPulseTyping {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.06);
            opacity: 0.92;
          }
        }

        /* AI Avatar Pulse Animation - Idle state (very subtle, slow) */
        @keyframes avatarPulseIdle {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.98;
          }
        }

        /* AI Avatar Glow/Ring Animation */
        @keyframes avatarGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
          }
        }
      `}</style>
    </div>
  );
}