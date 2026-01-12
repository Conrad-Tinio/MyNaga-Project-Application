import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Mock authentication - in production, this would call an API
    if (email && password) {
      // Demo credentials
      if (email === 'admin@naga.gov.ph' || email === 'staff@naga.gov.ph') {
        const userData = {
          id: 1,
          name: email.includes('admin') ? 'Admin User' : 'Staff User',
          email,
          role: email.includes('admin') ? 'admin' : 'staff'
        };
        login(userData);
        navigate('/admin');
      } else {
        setError('Invalid credentials. Use admin@naga.gov.ph or staff@naga.gov.ph for demo');
      }
    } else {
      setError('Please enter both email and password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div>
          <div className="flex justify-center mb-4">
            <div className="glass bg-gradient-to-br from-primary-600 to-primary-700 p-4 rounded-2xl shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 mb-2">
            Login to <span className="text-gradient">MedMap Naga</span>
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            For LGU staff and health facility personnel
          </p>
        </div>
        <form className="mt-8 space-y-6 glass p-8 rounded-2xl shadow-xl" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-300/60 text-red-700 px-4 py-3 rounded-xl animate-slide-down shadow-sm">
              <div className="flex items-center space-x-2">
                <span className="text-red-600 font-bold">⚠</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-3">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-modern w-full"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-3">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-modern w-full"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="glass bg-blue-50/60 border border-blue-200/40 rounded-xl p-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong className="font-semibold">Demo Credentials:</strong><br />
              Admin: admin@naga.gov.ph<br />
              Staff: staff@naga.gov.ph<br />
              Password: any (for demo)
            </p>
          </div>

          <div>
            <button
              type="submit"
              className="btn-primary w-full py-3 rounded-xl text-base font-semibold shadow-lg"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;



