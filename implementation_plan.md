# 6 New Features Implementation Plan

## User Review Required

> [!IMPORTANT]
> **Thứ tự triển khai theo dependency:** Dark Mode → Shareable URL → i18n → Trending → Detail Page → Collections.
> Mỗi feature build trên feature trước đó. Bạn có muốn thay đổi thứ tự không?

> [!WARNING]
> **i18n sẽ cần cập nhật TẤT CẢ component** để wrap text bằng [t()](file:///f:/extShare/extension-share/src/components/Footer.tsx#8-25). Đây là thay đổi lớn nhất, ảnh hưởng ~15 files.

> [!CAUTION]  
> **Cần cài thêm 4 dependencies:** `react-i18next`, `i18next`, `i18next-browser-languagedetector`, `react-markdown`.

---

## Proposed Changes

### Feature 1: Dark/Light Mode Toggle

#### [NEW] [useTheme.ts](file:///f:/extShare/extension-share/src/hooks/useTheme.ts)
- `theme` state (`'dark' | 'light'`), toggle function, persist localStorage
- Apply CSS class `dark`/`light` trên `<html>` element

#### [MODIFY] [index.css](file:///f:/extShare/extension-share/src/index.css)
- Thêm CSS custom properties cho 2 themes (backgrounds, text, borders)
- Map Tailwind colors qua CSS variables

#### [NEW] [ThemeToggle.tsx](file:///f:/extShare/extension-share/src/components/ThemeToggle.tsx)
- Icon Sun/Moon toggle button

#### [MODIFY] [Navbar.tsx](file:///f:/extShare/extension-share/src/components/Navbar.tsx)
- Thêm `ThemeToggle` vào navbar

---

### Feature 2: Shareable Search URL

#### [NEW] [useSearchParams.ts](file:///f:/extShare/extension-share/src/hooks/useSearchParams.ts)
- Sync URL params: `?q=keyword&tag=chrome-extension&tab=search`
- On mount: đọc URL → set state → auto search
- On search: cập nhật URL `window.history.replaceState`

#### [MODIFY] [App.tsx](file:///f:/extShare/extension-share/src/App.tsx)
- Integrate `useSearchParams` với search state

---

### Feature 3: i18n (Vietnamese / English)

#### Dependencies: `react-i18next`, `i18next`, `i18next-browser-languagedetector`

#### [NEW] [i18n/index.ts](file:///f:/extShare/extension-share/src/i18n/index.ts)
- i18next config với auto language detection

#### [NEW] [i18n/vi.json](file:///f:/extShare/extension-share/src/i18n/vi.json) + [en.json](file:///f:/extShare/extension-share/src/i18n/en.json)
- Translation keys cho tất cả UI text

#### [NEW] [LanguageSwitcher.tsx](file:///f:/extShare/extension-share/src/components/LanguageSwitcher.tsx)
- Dropdown/Toggle chuyển ngôn ngữ (🇻🇳 / 🇺🇸)

#### [MODIFY] All components
- Wrap tất cả hardcoded text với `useTranslation()` hook

---

### Feature 4: Trending Today

#### [NEW] [useTrending.ts](file:///f:/extShare/extension-share/src/hooks/useTrending.ts)
- Fetch trending: `q=topic:{tag}+created:>={today}&sort=stars`
- Cache 30 phút trong sessionStorage

#### [NEW] [TrendingToday.tsx](file:///f:/extShare/extension-share/src/components/TrendingToday.tsx)
- Grid các repo trending với badge "🔥 Hot Today"

#### [MODIFY] [TabsAndFilters.tsx](file:///f:/extShare/extension-share/src/components/TabsAndFilters.tsx)
- Thêm tab "🔥 Trending"

#### [MODIFY] [App.tsx](file:///f:/extShare/extension-share/src/App.tsx)
- Thêm logic render TrendingToday khi tab active

---

### Feature 5: Extension Detail Page

#### Dependency: `react-markdown`

#### [NEW] [ExtensionDetail.tsx](file:///f:/extShare/extension-share/src/components/ExtensionDetail.tsx)
- Full-screen overlay/modal hiển thị:
  - README.md rendered as HTML
  - Repository info (stars, forks, issues, license)
  - Release history (latest 5 releases)
  - Languages breakdown (bar chart)
  - Download ZIP button

#### [NEW] [useRepoDetail.ts](file:///f:/extShare/extension-share/src/hooks/useRepoDetail.ts)
- Fetch README, releases, languages từ GitHub API

#### [MODIFY] [RepoCard.tsx](file:///f:/extShare/extension-share/src/components/RepoCard.tsx)
- Click vào tên repo → mở ExtensionDetail

#### [MODIFY] [App.tsx](file:///f:/extShare/extension-share/src/App.tsx)
- State quản lý selected repo, render ExtensionDetail

---

### Feature 6: Category/Collection

#### [NEW] [useCollections.ts](file:///f:/extShare/extension-share/src/hooks/useCollections.ts)
- CRUD collections: `{ id, name, emoji, repos[] }`
- Persist localStorage

#### [NEW] [CollectionManager.tsx](file:///f:/extShare/extension-share/src/components/CollectionManager.tsx)
- Popup tạo/sửa/xóa collection

#### [NEW] [CollectionView.tsx](file:///f:/extShare/extension-share/src/components/CollectionView.tsx)
- Hiển thị danh sách collections + repos trong mỗi collection
- Thay thế BookmarksView đơn giản hiện tại

#### [MODIFY] [RepoCard.tsx](file:///f:/extShare/extension-share/src/components/RepoCard.tsx)
- Long-press hoặc dropdown menu → "Add to Collection"

#### [MODIFY] [TabsAndFilters.tsx](file:///f:/extShare/extension-share/src/components/TabsAndFilters.tsx)
- Thêm tab "📁 Bộ sưu tập"

---

## Verification Plan

### Automated
- `pnpm build` sau mỗi feature — đảm bảo 0 TypeScript errors

### Manual
- `pnpm dev` → test từng feature trên browser
- Test dark/light mode toggle
- Test URL sharing (copy/paste URL)
- Test language switching (VI ↔ EN)
- Test trending tab data
- Test detail page: README render, releases
- Test collections: create, add repos, delete
