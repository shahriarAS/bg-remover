import React from "react";

const DevCredit: React.FC = () => (
  <div className="mt-16 bg-gray-900 rounded-lg border border-gray-800 p-6">
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-green-400">$</span>
      <span className="text-gray-300">whoami</span>
    </div>
    <div className="text-sm text-gray-500 space-y-4">
      <div className="space-y-2">
        <p className="text-gray-300 font-medium">Shahriar Ahmed Shovon</p>
        <p>Software Engineer from Dhaka, Bangladesh</p>
        <p>
          Architecting scalable, production-grade frontend and backend systems
          using TypeScript.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-950 rounded p-3 border border-gray-800">
          <div className="text-green-400 text-xs mb-1">Expertise</div>
          <div className="text-gray-300 text-xs">
            Enterprise-grade solution
          </div>
        </div>
        <div className="bg-gray-950 rounded p-3 border border-gray-800">
          <div className="text-green-400 text-xs mb-1">Philosophy</div>
          <div className="text-gray-300 text-xs">
            Performance • Scalability • Reliability
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-6 pt-4 border-t border-gray-800">
        <a
          href="https://shahriarahmed.me"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 text-xs block"
        >
          shahriarahmed.me
        </a>
        <a
          href="https://github.com/shahriarAS"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 text-xs block"
        >
          github.com/shahriarAS
        </a>
        <a
          href="https://www.linkedin.com/in/shahriar-ahmed-shovon/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 text-xs block"
        >
          linkedin.com/in/shahriar-ahmed-shovon
        </a>
      </div>
    </div>
  </div>
);

export default DevCredit;
