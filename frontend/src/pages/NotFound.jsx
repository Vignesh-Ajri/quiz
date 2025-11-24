const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-3">404</h1>
      <p className="text-lg text-gray-600 mb-6">Page not found</p>

      <a href="/" className="text-blue-600 hover:underline font-medium">
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
