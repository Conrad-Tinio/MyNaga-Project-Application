import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import GlobalSOS from './components/GlobalSOS';
import ChatbotButton from './components/ChatbotButton';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Analytics from './pages/Analytics';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
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
  );
}

export default App;



