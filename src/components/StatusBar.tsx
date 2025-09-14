import React from "react";

interface StatusBarProps {
  isProcessing: boolean;
  isModelLoading?: boolean;
  processedCount?: number;
}

const StatusBar: React.FC<StatusBarProps> = ({
  isProcessing,
  isModelLoading,
  processedCount,
}) => {
  return (
    <div className="bg-gray-900 border-b border-gray-800 px-3 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-2 sm:gap-0 text-xs">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="text-green-400">●</span>
          <span className="text-gray-400">Ready</span>
          {isModelLoading && (
            <>
              <span className="text-blue-400">●</span>
              <span className="text-blue-400">Loading model...</span>
            </>
          )}
          {isProcessing && !isModelLoading && (
            <>
              <span className="text-yellow-400">●</span>
              <span className="text-yellow-400">Processing...</span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 text-gray-500">
          <span>Processed: {processedCount}</span>
          <span className="inline">•</span>
          <span className="hidden sm:inline">AI Model: RMBG-1.4</span>
          <span className="sm:hidden">Model: RMBG-1.4</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
