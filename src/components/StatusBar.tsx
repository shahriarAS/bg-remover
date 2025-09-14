import React from "react";

interface StatusBarProps {
  isProcessing: boolean;
  isModelLoading?: boolean;
  isModelReady?: boolean;
  processedCount?: number;
  modelLoadingProgress?: number;
  modelLoadingMessage?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
  isProcessing,
  isModelLoading,
  isModelReady,
  processedCount,
  modelLoadingMessage,
}) => {
  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span className={`text-${isModelReady ? 'green' : 'gray'}-400`}>●</span>
          <span className={`text-${isModelReady ? 'green' : 'gray'}-400`}>
            {isModelReady ? 'Ready' : 'Starting up...'}
          </span>
          {isModelLoading && (
            <>
              <span className="text-blue-400">●</span>
              <span className="text-blue-400">
                {modelLoadingMessage}
              </span>
            </>
          )}
          {isProcessing && !isModelLoading && (
            <>
              <span className="text-yellow-400">●</span>
              <span className="text-yellow-400">Processing image...</span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4 text-gray-500">
          <span>Images processed: {processedCount}</span>
          <span>•</span>
          <span>AI Model: RMBG-1.4</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
