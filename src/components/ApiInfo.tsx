import React from "react";

const ApiInfo: React.FC = () => (
  <div className="mt-16 bg-gray-900 rounded-lg border border-gray-800 p-6">
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-green-400">$</span>
      <span className="text-gray-300">curl -X POST api.bg-remover.ai/v1/remove</span>
    </div>
    <div className="text-sm text-gray-500 space-y-2">
      <p>Integrate with our REST API for programmatic access</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-950 rounded p-3 border border-gray-800">
          <div className="text-green-400 text-xs mb-1">Rate Limit</div>
          <div className="text-gray-300">1000/hour</div>
        </div>
        <div className="bg-gray-950 rounded p-3 border border-gray-800">
          <div className="text-green-400 text-xs mb-1">Latency</div>
          <div className="text-gray-300">~2.5s avg</div>
        </div>
        <div className="bg-gray-950 rounded p-3 border border-gray-800">
          <div className="text-green-400 text-xs mb-1">Uptime</div>
          <div className="text-gray-300">99.9% SLA</div>
        </div>
      </div>
    </div>
  </div>
);

export default ApiInfo;
