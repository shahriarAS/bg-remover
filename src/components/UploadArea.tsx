import React from "react";

interface UploadAreaProps {
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ dragActive, handleDrag, handleDrop, handleFileSelect, isProcessing }) => (
  <div className="mb-8">
    <div
      className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
        isProcessing
          ? "border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed"
          : dragActive
          ? "border-green-400 bg-green-400/5"
          : "border-gray-700 hover:border-gray-600 bg-gray-900/30"
      }`}
      onDragEnter={isProcessing ? undefined : handleDrag}
      onDragLeave={isProcessing ? undefined : handleDrag}
      onDragOver={isProcessing ? undefined : handleDrag}
      onDrop={isProcessing ? undefined : handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isProcessing}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-lg mb-6">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-200 mb-2">Drop image here or click to browse</h3>
        <p className="text-gray-500 text-sm mb-6">Drag and drop your image file or click to select from your device</p>
        <div className="inline-flex items-center space-x-1 text-xs text-gray-600 bg-gray-800 px-3 py-1 rounded">
          <span>Formats:</span>
          <code className="text-green-400">PNG</code>
          <span>|</span>
          <code className="text-green-400">JPG</code>
          <span>|</span>
          <code className="text-green-400">WEBP</code>
        </div>
      </div>
    </div>
  </div>
);

export default UploadArea;
