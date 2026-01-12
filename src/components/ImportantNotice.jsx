import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

const ImportantNotice = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b-2 border-amber-400 dark:border-amber-600 shadow-md animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                <span className="font-bold">IMPORTANT:</span> This project is only a prototype. No real data is being used here. The system does not provide medical diagnoses or advise as well.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-1 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors flex-shrink-0"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportantNotice;
