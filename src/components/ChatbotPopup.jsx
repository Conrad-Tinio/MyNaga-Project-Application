import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, MessageCircle, Sparkles } from 'lucide-react';
import { facilities, getResourceAvailability, resourceCategories, resourceStatus } from '../data/mockData';
import { calculateDistance } from '../data/mockData';
import FAQButtons from '../components/FAQButtons';

const ChatbotPopup = ({ isOpen, onClose, anchorPosition }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      content: "Hi! 👋 I'm **MedMap Assist**, your friendly guide to finding medical resources in Naga City.\n\nI can help you find:\n• 🩸 Blood supplies\n• 💊 Medicines\n• 🛏️ Hospital beds\n• 🏥 Medical equipment\n\n**How can I help you today?**"
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFAQs, setShowFAQs] = useState(true);
  const messagesEndRef = useRef(null);
  const popupRef = useRef(null);
  const availability = getResourceAvailability();
  const [userLocation, setUserLocation] = useState(null);
  const [position, setPosition] = useState({ bottom: '24px', right: '24px' });

  useEffect(() => {
    if (!isOpen) return;
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          setUserLocation({ lat: 13.6192, lon: 123.1814 });
        }
      );
    } else {
      setUserLocation({ lat: 13.6192, lon: 123.1814 });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && anchorPosition && popupRef.current) {
      const popup = popupRef.current;
      const popupRect = popup.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate position relative to button
      let bottom = viewportHeight - anchorPosition.y + 80;
      let right = viewportWidth - anchorPosition.x - 20;
      
      // Ensure popup stays within viewport
      if (bottom + popupRect.height > viewportHeight) {
        bottom = viewportHeight - popupRect.height - 20;
      }
      if (bottom < 20) {
        bottom = 20;
      }
      if (right + popupRect.width > viewportWidth) {
        right = viewportWidth - popupRect.width - 20;
      }
      if (right < 20) {
        right = 20;
      }
      
      setPosition({ bottom: `${bottom}px`, right: `${right}px` });
    }
  }, [isOpen, anchorPosition]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const processQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    const results = [];

    availability.forEach(item => {
      const facility = facilities.find(f => f.id === item.facilityId);
      if (!facility) return;

      const resourceMatches = item.resourceName.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(item.resourceName.toLowerCase());

      const facilityMatches = facility.name.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(facility.name.toLowerCase());

      const bloodTypes = ['o+', 'o-', 'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-'];
      const bloodMatch = bloodTypes.some(bt => lowerQuery.includes(bt) && 
        item.resourceName.toLowerCase().includes(`blood type ${bt}`));

      const synonyms = {
        'bed': ['bed', 'beds', 'room', 'ward'],
        'medicine': ['medicine', 'medication', 'drug', 'pill'],
        'blood': ['blood', 'donation'],
        'oxygen': ['oxygen', 'o2', 'tank']
      };

      let synonymMatch = false;
      Object.keys(synonyms).forEach(key => {
        if (synonyms[key].some(syn => lowerQuery.includes(syn)) && 
            item.resourceType === resourceCategories[key.toUpperCase() === 'BED' ? 'BEDS' : key.toUpperCase()]) {
          synonymMatch = true;
        }
      });

      if ((resourceMatches || facilityMatches || bloodMatch || synonymMatch) && item.status === resourceStatus.AVAILABLE) {
        const distance = userLocation
          ? calculateDistance(userLocation.lat, userLocation.lon, facility.latitude, facility.longitude)
          : null;
        results.push({ ...item, facility, distance });
      }
    });

    results.sort((a, b) => {
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return a.facility.name.localeCompare(b.facility.name);
    });

    return results.slice(0, 5);
  };

  const formatResponse = (results, query) => {
    if (results.length === 0) {
      return "I couldn't find any available resources matching your query. 😔\n\n**Try:**\n• Checking the spelling\n• Using different keywords\n• Contacting facilities directly\n\nWould you like to search for something else?";
    }

    let response = `✅ I found **${results.length}** ${results.length === 1 ? 'facility' : 'facilities'} with available resources:\n\n`;

    results.forEach((item, index) => {
      const distance = item.distance !== null ? `📍 ${item.distance.toFixed(1)} km away` : '';
      response += `**${index + 1}. ${item.facility.name}**\n`;
      response += `   • ${item.resourceName} ${distance ? distance : ''}\n`;
      response += `   • 📍 ${item.facility.address}\n`;
      response += `   • 📞 ${item.facility.phone}\n\n`;
    });

    response += "💡 **Tip:** Call ahead to confirm availability.\n\nWould you like more information?";
    return response;
  };

  const handleQuestionClick = (question) => {
    setShowFAQs(false);
    submitQuery(question);
  };

  const submitQuery = async (queryText) => {
    const query = queryText.trim();
    if (!query || isProcessing) return;

    setInput('');
    setIsProcessing(true);
    setShowFAQs(false);

    const newMessages = [...messages, {
      id: messages.length + 1,
      role: 'user',
      content: query
    }];
    setMessages(newMessages);

    setTimeout(() => {
      const results = processQuery(query);
      const botResponse = formatResponse(results, query);

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        role: 'bot',
        content: botResponse
      }]);
      setIsProcessing(false);
      setShowFAQs(true);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    submitQuery(input);
  };

  const renderMessage = (content) => {
    const parts = content.split(/(\*\*.*?\*\*|📍|📞|✅|😔|💡|👋|🩸|💊|🛏️|🏥)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Popup positioned near button */}
      <div 
        ref={popupRef}
        className="fixed z-50 bg-white rounded-2xl shadow-2xl w-[90vw] sm:w-[420px] h-[600px] sm:h-[680px] flex flex-col border border-gray-100 overflow-hidden animate-fade-in"
        style={{
          bottom: position.bottom,
          right: position.right,
          maxHeight: '85vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Enhanced */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-600 to-primary-700 text-white p-4 flex items-center justify-between flex-shrink-0 shadow-md">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl shadow-lg flex-shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <span className="truncate">MedMap Assist</span>
                <Sparkles className="w-4 h-4 flex-shrink-0" />
              </h2>
              <p className="text-xs text-primary-100 truncate">Your medical resource assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1.5 transition-all flex-shrink-0 ml-2"
            aria-label="Close chatbot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area - Enhanced */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[85%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4.5 h-4.5" />
                  ) : (
                    <Bot className="w-4.5 h-4.5" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {renderMessage(message.content)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* FAQ Buttons - Enhanced styling */}
          {showFAQs && messages.length <= 1 && (
            <div className="pt-2 animate-fade-in">
              <FAQButtons onQuestionClick={handleQuestionClick} />
            </div>
          )}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[85%]">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-2.5 border border-gray-200 shadow-sm">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form - Enhanced */}
        <div className="border-t border-gray-200 bg-white flex-shrink-0">
          {/* FAQ Buttons - Show after responses */}
          {showFAQs && messages.length > 1 && (
            <div className="px-3 pt-3 pb-2 border-b border-gray-100 max-h-40 overflow-y-auto">
              <FAQButtons onQuestionClick={handleQuestionClick} />
            </div>
          )}
          <form onSubmit={handleSubmit} className="p-3 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about medical resources..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all shadow-sm"
              disabled={isProcessing}
              onFocus={() => setShowFAQs(false)}
            />
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatbotPopup;
