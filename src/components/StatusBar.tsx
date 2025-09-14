import React from "react";
import type { ProcessedImage } from "../App";

interface StatusBarProps {
  isProcessing: boolean;
  processedImages: ProcessedImage[];
  isModelLoading?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ isProcessing, processedImages, isModelLoading }) => (
  <div className="bg-gray-900 border-b border-gray-800 px-6 py-2">
    <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
      <div className="flex items-center space-x-4">
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
      <div className="flex items-center space-x-4 text-gray-500">
        <span>Images processed: {processedImages.length}</span>
        <span>•</span>
        <span>AI Model: RMBG-1.4</span>
      </div>
    </div>
  </div>
);

export default StatusBar;
