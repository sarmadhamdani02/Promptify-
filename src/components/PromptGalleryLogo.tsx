import React from "react";

const PromptGalleryLogo = ({ className = "" }) => {
  return (
    <a
      href="/"
      className={`flex items-center justify-center gap-2 text-4xl font-bold text-gray-900 transition-all duration-300 hover:scale-105 ${className}`}
    >
      Prompt
      <span className="ml-1 bg-blue-500 text-white px-3 py-1 rounded-xl flex items-center justify-center shadow-md">
        Gallery
      </span>
    </a>
  );
};

export default PromptGalleryLogo;
