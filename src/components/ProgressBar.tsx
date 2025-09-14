import React from "react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full h-6 bg-gray-800 rounded-lg overflow-hidden shadow-inner mt-4 mb-6">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      >
        <span className="text-xs text-white font-bold ml-2 align-middle">
          {progress > 5 ? `${Math.round(progress)}%` : ""}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
