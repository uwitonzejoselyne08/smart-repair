
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-[#fdeca6]">
      <h1 className="text-6xl font-bold text-[#ff7ff2] mb-4">404</h1>
      <p className="text-2xl text-gray-800 mb-8">Page Not Found</p>
      <p className="text-gray-700 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="bg-[#ff7ff2] hover:bg-[#e66fd8] text-white font-medium py-2 px-6 rounded-md transition duration-300"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;