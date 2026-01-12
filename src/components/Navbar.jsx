import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, LogOut, User, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`text-white shadow-lg border-b backdrop-blur-xl sticky top-0 z-50 transition-all duration-700 ease-in-out ${
      isDark 
        ? 'bg-slate-900/95 border-white/10' 
        : 'bg-primary-700/90 border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt="MedMap Naga Logo" 
                  className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback if logo doesn't exist yet
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">MedMap Naga</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 active:bg-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              Dashboard
            </Link>
            <Link
              to="/chatbot"
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 active:bg-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              MedMap Assist
            </Link>
            {isAdmin() && (
              <>
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 active:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                >
                  Admin Panel
                </Link>
                <Link
                  to="/analytics"
                  className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 active:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                >
                  Analytics
                </Link>
              </>
            )}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-white/20">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/10 active:scale-95 transition-all duration-200 backdrop-blur-sm relative"
                aria-label="Toggle dark mode"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-300" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200 backdrop-blur-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white/20 hover:bg-white/30 active:scale-95 transition-all duration-200 backdrop-blur-sm shadow-md"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/10 active:scale-95 transition-all duration-200"
              aria-label="Toggle dark mode"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-300" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-slide-down">
          <div className={`px-2 pt-2 pb-3 space-y-1 backdrop-blur-md border-t transition-colors duration-300 ${
            isDark 
              ? 'bg-primary-900/95 border-white/20' 
              : 'bg-primary-800/95 border-white/10'
          }`}>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-white/10 active:bg-white/20 transition-all duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/chatbot"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-white/10 active:bg-white/20 transition-all duration-200"
            >
              MedMap Assist
            </Link>
            {isAdmin() && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-white/10 active:bg-white/20 transition-all duration-200"
                >
                  Admin Panel
                </Link>
                <Link
                  to="/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-white/10 active:bg-white/20 transition-all duration-200"
                >
                  Analytics
                </Link>
              </>
            )}
            {user ? (
              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center px-3 py-2 mb-2 rounded-lg bg-white/10">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-3 py-2 rounded-lg text-base font-medium hover:bg-white/10 active:bg-white/20 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium bg-white/20 hover:bg-white/30 active:scale-95 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;



