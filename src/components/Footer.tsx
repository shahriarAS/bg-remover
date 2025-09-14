import React from "react";

const Footer: React.FC = () => (
  <footer className="border-t border-gray-800 bg-gray-950 py-6 px-6 mt-16">
    <div className="max-w-6xl mx-auto text-center flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row items-center justify-center space-x-4 text-xs text-gray-600 gap-2 lg:gap-0">
        <span>© 2025 bg.shahriarahmed.me</span>
        <span className="hidden lg:block">•</span>
        <span>Powered by Transformers.js & RMBG-1.4</span>
      </div>
      <div className="flex items-center justify-center gap-4 text-sm">
        <a
          target="_blank"
          href="https://www.shahriarahmed.me/case-study/bg-remover"
          className="text-gray-400 hover:text-green-400 cursor-pointer transition-colors underline decoration-gray-600 hover:decoration-green-400"
        >
          case-study
        </a>
        <span className="text-gray-600">•</span>
        <a
          target="_blank"
          href="https://github.com/shahriarAS/bg-remover"
          className="text-gray-400 hover:text-green-400 cursor-pointer transition-colors underline decoration-gray-600 hover:decoration-green-400"
        >
          github
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
