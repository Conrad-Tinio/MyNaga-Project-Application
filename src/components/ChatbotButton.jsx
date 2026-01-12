import { useState, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatbotPopup from './ChatbotPopup';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    }
    setIsOpen(true);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full px-5 py-3 shadow-lg shadow-primary-500/25 transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center space-x-2 group"
        aria-label="Open MedMap Assist Chatbot"
        title="MedMap Assist - Ask about medical resources"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-semibold">Chat</span>
      </button>
      <ChatbotPopup 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        anchorPosition={buttonPosition}
      />
    </>
  );
};

export default ChatbotButton;

