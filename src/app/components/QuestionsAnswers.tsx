import { Bot } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function QuestionsAnswers() {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Navigate to chat page with the message
    navigate('/chat/arvind', { 
      state: { initialMessage: inputValue } 
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mt-8">
      {/* Section Heading */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Questions & Answers</h3>
      </div>

      {/* Chat Input Row */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div 
          className="bg-white"
          style={{
            padding: '12px 16px'
          }}
        >
          <div className="flex items-center gap-3">
            {/* AI Assistant Icon */}
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #E0E7FF 0%, #DDD6FE 100%)',
                color: '#6366F1'
              }}
            >
              <Bot className="w-5 h-5" strokeWidth={2.5} />
            </div>

            {/* Text Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Continue the conversation…"
              style={{
                flex: 1,
                height: '44px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                padding: '0 14px',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3B82F6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />

            {/* Send Button */}
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              style={{
                height: '44px',
                borderRadius: '12px',
                padding: '0 24px',
                fontSize: '14px',
                fontWeight: 500,
                backgroundColor: inputValue.trim() ? '#000000' : '#E5E7EB',
                color: inputValue.trim() ? '#FFFFFF' : '#9CA3AF',
                border: 'none',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.15s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (inputValue.trim()) {
                  e.currentTarget.style.backgroundColor = '#111111';
                }
              }}
              onMouseLeave={(e) => {
                if (inputValue.trim()) {
                  e.currentTarget.style.backgroundColor = '#000000';
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}