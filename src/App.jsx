import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ImportantNotice from './components/ImportantNotice';
import GlobalSOS from './components/GlobalSOS';
import ChatbotButton from './components/ChatbotButton';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Analytics from './pages/Analytics';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-700 ease-in-out">
            <Navbar />
            <ImportantNotice />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {/* Global Action Buttons - Available on all pages */}
            <GlobalSOS />
            <ChatbotButton />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;



