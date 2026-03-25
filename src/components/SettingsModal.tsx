import React, { useState } from 'react';
import { Settings, Shield, AlertTriangle, X, Check, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  onClearData: () => void;
}

export default function SettingsModal({ show, onClose, onClearData }: SettingsModalProps) {
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('ext-github-token') || '');
  const [clearSuccess, setClearSuccess] = useState(false);

  if (!show) return null;

  const handleSaveSettings = () => {
    localStorage.setItem('ext-github-token', githubToken.trim());
    onClose();
  };

  const handleClearData = () => {
    onClearData();
    setGithubToken('');
    setClearSuccess(true);
    setTimeout(() => {
      setClearSuccess(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" /> Cài đặt Hệ thống
        </h2>

        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-200 mb-2">GitHub Personal Access Token (Tùy chọn)</label>
          <div className="relative">
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="Nhập token bắt đầu bằng ghp_..."
              className="block w-full pl-4 pr-10 py-3 border border-slate-600 rounded-xl leading-5 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <p className="text-sm text-slate-400 mt-3 bg-blue-900/20 border border-blue-900 p-3 rounded-lg flex gap-2 items-start">
            <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <span>Việc cung cấp token giúp bạn tăng giới hạn truy xuất GitHub API từ <strong>60 lên 5.000 requests/giờ</strong>, tránh bị lỗi khi tìm kiếm quá nhiều.</span>
          </p>
        </div>

        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700 mb-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-200 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" /> Quyền riêng tư (Privacy)
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Token của bạn (nếu được cung cấp) chỉ được lưu trữ cục bộ (Local Storage) trên trình duyệt này và gửi trực tiếp đến API chính thức của GitHub. Chúng tôi <strong>tuyệt đối không</strong> thu thập, lưu trữ, hay chia sẻ token của bạn tới bất kỳ máy chủ trung gian nào.
            </p>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-base font-bold text-slate-200 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" /> Từ chối trách nhiệm (Disclaimer)
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              ExtenShare hoạt động như một công cụ tìm kiếm dữ liệu mã nguồn mở dựa trên GitHub API. Chúng tôi <strong>không kiểm duyệt</strong> và <strong>không chịu trách nhiệm</strong> về nội dung, tính an toàn, quyền sở hữu trí tuệ hay mã độc (nếu có) của các extension hiển thị trên nền tảng. Vui lòng tự kiểm tra kỹ source code (Mã nguồn) trước khi tải xuống và cài đặt vào trình duyệt của bạn.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-700 pt-6">
          <button
            onClick={handleClearData}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 text-sm order-2 sm:order-1"
          >
            {clearSuccess ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
            {clearSuccess ? 'Đã dọn dẹp an toàn!' : 'Dọn dữ liệu Local'}
          </button>

          <div className="flex w-full sm:w-auto gap-3 order-1 sm:order-2">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handleSaveSettings}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
