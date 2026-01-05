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
        className="fixed bottom-24 right-6 z-40 bg-primary-600 hover:bg-primary-700 text-white rounded-full px-5 py-3 shadow-2xl transform transition-all hover:scale-105 flex items-center space-x-2 group"
        aria-label="Open MedMap Assist Chatbot"
        title="MedMap Assist - Ask about medical resources"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Chat</span>
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

