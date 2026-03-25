import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

interface FooterProps {
  onSettingsOpen: () => void;
}

export default function Footer({ onSettingsOpen }: FooterProps) {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-8 text-center text-slate-500 text-sm mt-auto w-full">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} ExtenShare. Nền tảng khám phá mã nguồn mở.</p>
        <div className="flex items-center gap-6">
          <button onClick={onSettingsOpen} className="hover:text-slate-300 transition-colors flex items-center gap-1">
            <Shield className="w-4 h-4" /> Quyền riêng tư
          </button>
          <button onClick={onSettingsOpen} className="hover:text-slate-300 transition-colors flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> Từ chối trách nhiệm
          </button>
        </div>
      </div>
    </footer>
  );
}
