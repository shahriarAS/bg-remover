import React from "react";

const Intro: React.FC = () => (
  <div className="mb-12">
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
      <div className="flex items-center space-x-2 text-gray-400 mb-4">
        <span className="text-green-400">$</span>
        <span>bg-remover --help</span>
      </div>
      <div className="space-y-2 text-sm">
        <p className="text-gray-300">AI-powered background removal service</p>
        <p className="text-gray-500">Upload an image and get transparent PNG output</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-green-400">Supported:</span>
            <div className="text-gray-400">PNG, JPG, WEBP</div>
          </div>
          <div>
            <span className="text-green-400">Max size:</span>
            <div className="text-gray-400">10MB</div>
          </div>
          <div>
            <span className="text-green-400">Processing:</span>
            <div className="text-gray-400">&lt;5s average</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Intro;
