import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [formError, setFormError] = useState('');

  const { login, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, password } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    if (error) {
      setFormError(error);
      clearError();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, error]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setFormError('Please enter both username and password');
      return;
    }

    const success = await login(formData);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#fdeca6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Card */}
        <div className="bg-[#fdeca6] p-6 sm:p-8 rounded-xl shadow-xl border-t-4 border-[#ff7ff2]">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
            Admin Login to <span className="text-[#ff7ff2]">SmartPark</span>
          </h1>

          {/* Error message */}
          {formError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
              <span className="text-sm sm:text-base">{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Username field */}
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={onChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7ff2] focus:border-[#ff7ff2] text-gray-900"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7ff2] focus:border-[#ff7ff2] text-gray-900"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-[#ff7ff2] hover:bg-[#e66fd8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff7ff2]"
              >
                Login
              </button>
            </div>
          </form>

          {/* Register link */}
          <div className="mt-8 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Don't have an account?
              <Link to="/register" className="ml-1 font-medium text-[#ff7ff2] hover:text-[#e66fd8] hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;