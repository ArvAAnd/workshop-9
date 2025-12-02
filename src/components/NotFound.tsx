import React from 'react';

export const NotFound: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
      <p className="text-gray-600">The page you requested doesn't exist or could not be found.</p>
    </div>
  );
};

export default NotFound;
