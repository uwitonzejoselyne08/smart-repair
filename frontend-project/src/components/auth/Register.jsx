import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '',
    fullName: '',
    role: 'admin',
  });
  const [formError, setFormError] = useState('');

  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, password, password2, fullName, role } = formData;

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

    if (!username || !password || !password2 || !fullName) {
      setFormError('Please fill in all fields');
      return;
    }

    if (password !== password2) {
      setFormError('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setFormError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
      return;
    }

    const success = await register({
      username,
      password,
      fullName,
      role,
    });

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
            Create Admin <span className="text-[#ff7ff2]">Account</span>
          </h1>

          {/* Error message */}
          {formError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
              <span className="text-sm sm:text-base">{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
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
                placeholder="Choose a username"
                autoComplete="username"
              />
            </div>

            {/* Full Name field */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={onChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7ff2] focus:border-[#ff7ff2] text-gray-900"
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>

            <input type="hidden" name="role" value={role} />

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
                autoComplete="new-password"
              />
              <p className="text-xs text-gray-500 mt-1 pl-1">
                Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.
              </p>
            </div>

            {/* Confirm Password field */}
            <div>
              <label
                htmlFor="password2"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="password2"
                name="password2"
                value={password2}
                onChange={onChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7ff2] focus:border-[#ff7ff2] text-gray-900"
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-[#ff7ff2] hover:bg-[#e66fd8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff7ff2]"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-8 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Already have an account?
              <Link to="/login" className="ml-1 font-medium text-[#ff7ff2] hover:text-[#e66fd8] hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;