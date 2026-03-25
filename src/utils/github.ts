// Helper để lấy Header chứa GitHub Token nếu người dùng đã cài đặt
export const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('ext-github-token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Cache để lưu dữ liệu HOẶC Promise của contributors, tránh gọi API nhiều lần và N+1
export const contributorsCache: Record<string, unknown> = {};
