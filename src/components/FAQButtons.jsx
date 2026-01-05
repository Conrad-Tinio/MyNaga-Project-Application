import { HelpCircle, Droplet, Pill, Bed, Activity } from 'lucide-react';

const FAQButtons = ({ onQuestionClick }) => {
  const faqs = [
    {
      id: 1,
      question: "Where can I find O+ blood?",
      icon: Droplet,
      category: "blood"
    },
    {
      id: 2,
      question: "Which hospital has available beds?",
      icon: Bed,
      category: "beds"
    },
    {
      id: 3,
      question: "Is there amoxicillin near me?",
      icon: Pill,
      category: "medicine"
    },
    {
      id: 4,
      question: "Where can I get oxygen tanks?",
      icon: Activity,
      category: "equipment"
    },
    {
      id: 5,
      question: "What facilities are near me?",
      icon: HelpCircle,
      category: "general"
    },
    {
      id: 6,
      question: "Which pharmacy has paracetamol?",
      icon: Pill,
      category: "medicine"
    }
  ];

  return (
    <div className="space-y-2.5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">Quick Questions</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {faqs.map((faq) => {
          const Icon = faq.icon;
          return (
            <button
              key={faq.id}
              onClick={() => onQuestionClick(faq.question)}
              className="flex items-center space-x-2.5 p-3 bg-white border border-gray-200 rounded-xl hover:border-primary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-50/50 transition-all text-left group shadow-sm hover:shadow-md"
            >
              <div className="flex-shrink-0 bg-primary-50 group-hover:bg-primary-100 p-1.5 rounded-lg transition-colors">
                <Icon className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
              </div>
              <span className="text-xs sm:text-sm text-gray-700 group-hover:text-primary-900 flex-1 font-medium leading-snug">
                {faq.question}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FAQButtons;

