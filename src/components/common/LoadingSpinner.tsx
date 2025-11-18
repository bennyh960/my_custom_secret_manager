import React from "react";

const LoadingSpinner = ({ isLoading, text }: { text?: string; isLoading: boolean }) => {
  if (!isLoading) return null;
  return (
    <div className="text-center py-12 w-full h-full border absolute top-0 left-0 bg-white bg-opacity-75 flex items-center justify-center flex-col">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600 text-sm sm:text-base">{text ?? "Verifying authentication..."}</p>
    </div>
  );
};

export default LoadingSpinner;
