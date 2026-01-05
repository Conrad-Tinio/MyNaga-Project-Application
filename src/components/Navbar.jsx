import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-primary-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">MedMap Naga</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/chatbot"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition"
            >
              MedMap Assist
            </Link>
            {isAdmin() && (
              <>
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition"
                >
                  Admin Panel
                </Link>
                <Link
                  to="/analytics"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition"
                >
                  Analytics
                </Link>
              </>
            )}
            {user ? (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-primary-500">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-medium bg-primary-500 hover:bg-primary-400 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-primary-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-primary-800">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600"
            >
              Dashboard
            </Link>
            <Link
              to="/chatbot"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600"
            >
              MedMap Assist
            </Link>
            {isAdmin() && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600"
                >
                  Admin Panel
                </Link>
                <Link
                  to="/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600"
                >
                  Analytics
                </Link>
              </>
            )}
            {user ? (
              <div className="pt-4 border-t border-primary-600">
                <div className="flex items-center px-3 py-2 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-primary-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium bg-primary-500 hover:bg-primary-400"
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



