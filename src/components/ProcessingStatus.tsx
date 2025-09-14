import React from "react";

interface ProcessingStatusProps {
  isProcessing: boolean;
  fileName: string;
  processingProgress: number;
  progressMessage?: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ 
  isProcessing, 
  fileName, 
  processingProgress, 
  progressMessage 
}) => (
  isProcessing ? (
    <div className="mb-8">
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-gray-300">Processing: {fileName}</span>
          </div>
          <span className="text-sm text-gray-500">{Math.round(processingProgress)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
          <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${processingProgress}%` }} />
        </div>
        {progressMessage && (
          <div className="text-sm text-green-400 mb-2">
            {progressMessage}
          </div>
        )}
        <div className="text-xs text-gray-500 space-y-1">
          <div>→ Background removal powered by AI</div>
          <div>→ Using RMBG-1.4 model from Hugging Face</div>
          <div>→ Processing in your browser securely</div>
        </div>
      </div>
    </div>
  ) : null
);

export default ProcessingStatus;
