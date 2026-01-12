import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Sparkles } from 'lucide-react';
import { facilities, getResourceAvailability, resourceCategories, resourceStatus } from '../data/mockData';
import { calculateDistance } from '../data/mockData';
import FAQButtons from '../components/FAQButtons';

const Chatbot = () => {
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
  const availability = getResourceAvailability();
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    const results = [];

    // Enhanced search with better matching
    availability.forEach(item => {
      const facility = facilities.find(f => f.id === item.facilityId);
      if (!facility) return;

      // Check if resource matches query
      const resourceMatches = item.resourceName.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(item.resourceName.toLowerCase());

      // Check if facility matches query
      const facilityMatches = facility.name.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(facility.name.toLowerCase());

      // Check for blood type queries
      const bloodTypes = ['o+', 'o-', 'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-'];
      const bloodMatch = bloodTypes.some(bt => lowerQuery.includes(bt) && 
        item.resourceName.toLowerCase().includes(`blood type ${bt}`));

      // Check for common synonyms
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

    // Sort by distance if available, otherwise by facility name
    results.sort((a, b) => {
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return a.facility.name.localeCompare(b.facility.name);
    });

    return results.slice(0, 5); // Limit to 5 results
  };

  const formatResponse = (results, query) => {
    if (results.length === 0) {
      return "I couldn't find any available resources matching your query. 😔\n\n**Try:**\n• Checking the spelling\n• Using different keywords (e.g., 'blood type O+', 'hospital beds', 'amoxicillin')\n• Contacting facilities directly for current availability\n\n**Or ask me:**\n• \"What resources are available?\"\n• \"Show me nearby hospitals\"\n\nWould you like to search for something else?";
    }

    let response = `✅ I found **${results.length}** ${results.length === 1 ? 'facility' : 'facilities'} with available resources:\n\n`;

    results.forEach((item, index) => {
      const distance = item.distance !== null ? `📍 ${item.distance.toFixed(1)} km away` : '';
      response += `**${index + 1}. ${item.facility.name}**\n`;
      response += `   • ${item.resourceName} ${distance ? distance : ''}\n`;
      response += `   • 📍 ${item.facility.address}\n`;
      response += `   • 📞 ${item.facility.phone}\n\n`;
    });

    response += "💡 **Tip:** Call ahead to confirm availability before visiting.\n\nWould you like more information about any of these facilities?";
    return response;
  };

  const handleQuestionClick = (question) => {
    setShowFAQs(false);
    // Auto-submit the question
    submitQuery(question);
  };

  const submitQuery = async (queryText) => {
    const query = queryText.trim();
    if (!query || isProcessing) return;

    setInput('');
    setIsProcessing(true);
    setShowFAQs(false);

    // Add user message
    const newMessages = [...messages, {
      id: messages.length + 1,
      role: 'user',
      content: query
    }];
    setMessages(newMessages);

    // Simulate processing delay
    setTimeout(() => {
      const results = processQuery(query);
      const botResponse = formatResponse(results, query);

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        role: 'bot',
        content: botResponse
      }]);
      setIsProcessing(false);
      setShowFAQs(true); // Show FAQs again after response
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    submitQuery(input);
  };

  const renderMessage = (content) => {
    // Simple markdown-like formatting
    const parts = content.split(/(\*\*.*?\*\*|📍|📞|✅|😔|💡|👋|🩸|💊|🛏️|🏥)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center space-x-4 mb-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-4 rounded-2xl shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-primary-400/30 rounded-2xl blur-xl"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center space-x-2">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">MedMap Assist</span>
                <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
              </h1>
              <p className="text-gray-600 text-base mt-1.5 font-medium">
                Your AI assistant for finding medical resources in Naga City
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="card-modern flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 250px)', minHeight: '500px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[85%] ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white'
                        : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-5 py-3.5 shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white'
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

            {/* FAQ Buttons - Show when no messages or after bot response */}
            {showFAQs && messages.length <= 1 && (
              <div className="pt-4">
                <FAQButtons onQuestionClick={handleQuestionClick} />
              </div>
            )}

            {isProcessing && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-lg">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white rounded-2xl px-5 py-3.5 border border-gray-200 shadow-md">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 p-5 bg-gradient-to-b from-gray-50 to-white">
            {/* Quick Suggestions */}
            {showFAQs && messages.length > 1 && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <FAQButtons onQuestionClick={handleQuestionClick} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about medical resources... (e.g., Where can I find O+ blood?)"
                  className="input-modern w-full"
                  disabled={isProcessing}
                  onFocus={() => setShowFAQs(false)}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="btn-primary px-6 py-3.5 rounded-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 glass bg-blue-50/80 border border-blue-200/50 rounded-xl p-5 backdrop-blur-sm animate-fade-in">
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong className="font-semibold">ℹ️ Note:</strong> MedMap Assist is a non-diagnostic resource-finding assistant. 
            It does not provide medical advice or diagnoses. Always consult healthcare professionals for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
