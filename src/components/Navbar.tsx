import React from 'react';
import { Chrome, Settings, Github } from 'lucide-react';

interface NavbarProps {
  onSettingsOpen: () => void;
}

export default function Navbar({ onSettingsOpen }: NavbarProps) {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white cursor-pointer" onClick={() => window.location.reload()}>
          <Chrome className="w-6 h-6 text-blue-400" />
          <span>Exten<span className="text-blue-400">Share</span></span>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={onSettingsOpen} className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" /> Cài đặt
          </button>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
            <Github className="w-4 h-4" /> GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
