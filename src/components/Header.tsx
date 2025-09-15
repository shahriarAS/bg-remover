import React from "react";

const Header: React.FC = () => (
  <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img
              src="/bg-remover.png"
              alt="Logo"
              className="w-10 h-10 rounded shadow"
            />
            <div>
              <h1 className="text-lg font-semibold text-green-400">
                bg.shahriarahmed.me
              </h1>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center space-x-6 text-sm">
          <a
            target="_blank"
            href="https://www.shahriarahmed.me/case-study/bg-remover"
            className="text-gray-400 hover:text-green-400 cursor-pointer transition-colors"
          >
            case-study
          </a>
          <a
            target="_blank"
            href="https://github.com/shahriarAS/bg-remover"
            className="text-gray-400 hover:text-green-400 cursor-pointer transition-colors"
          >
            github
          </a>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
