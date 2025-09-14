import React from "react";
import type { ProcessedImage } from "../App";

interface ResultsProps {
  processedImages: ProcessedImage[];
  formatFileSize: (bytes: number) => string;
  downloadImage: (imageUrl: string, name: string) => void;
}

const Results: React.FC<ResultsProps> = ({ processedImages, formatFileSize, downloadImage }) => (
  processedImages.length > 0 ? (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <span className="text-green-400">$</span>
        <span className="text-gray-300">ls -la processed/</span>
      </div>
      {processedImages.map((image, index) => (
        <div key={index} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 bg-gray-950/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-green-400">{image.name}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{formatFileSize(image.size)}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{image.processingTime}ms</span>
              </div>
              <button
                onClick={() => downloadImage(image.processed, image.name)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M4 21h16" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-400 mb-3">Input</div>
                <div className="aspect-square bg-gray-800 rounded border border-gray-700 overflow-hidden">
                  <img src={image.original} alt="Original" className="w-full h-full object-contain" />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-3">Output (transparent)</div>
                <div className="aspect-square bg-gray-800 rounded border border-gray-700 overflow-hidden relative">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Crect x='0' y='0' width='10' height='10'/%3E%3Crect x='10' y='10' width='10' height='10'/%3E%3C/g%3E%3C/svg%3E\")` }} />
                  <img src={image.processed} alt="Processed" className="relative z-10 w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : null
);

export default Results;
