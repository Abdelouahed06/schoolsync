import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/actions/authActions';
import Notification from '../components/common/Notification';
import { FaLock, FaUser, FaEnvelope, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, userType, error } = useSelector((state) => state.auth);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (userType === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userType === 'teacher') {
        navigate('/teacher/profile', { replace: true });
      } else if (userType === 'student') {
        navigate('/student/profile', { replace: true });
      }
    }
  }, [isAuthenticated, userType, navigate, loginAttempted]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rememberMe) {
      localStorage.setItem('rememberedUsername', formData.username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }
    
    await dispatch(login(formData.username, formData.password));
    setLoginAttempted(true);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    window.location.href = "mailto:essaadouny.abdelouahed@gmail.com?subject=Password Reset Request&body=Please help me reset my password for the school management system.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-800 text-white p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome!</h1>
            <p className="text-blue-100">Sign in to access your school management dashboard</p>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="p-8 md:p-12 md:w-1/2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Login to Your Account</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center">
              <FaLock className="mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-2 font-medium">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                onClick={handleForgotPassword}
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              <FaSignInAlt />
              Login
            </button>
          </form>
        </div>
      </div>
      <Notification />
    </div>
  );
};

export default Login;