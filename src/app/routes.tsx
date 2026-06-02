import { useState, createContext, useContext } from 'react';
import { createBrowserRouter, Outlet } from 'react-router';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import DiaryPage from './pages/DiaryPage';
import DiaryDetailPage from './pages/DiaryDetailPage';
import AnniversaryPage from './pages/AnniversaryPage';
import WishesPage from './pages/WishesPage';
import WishDetailPage from './pages/WishDetailPage';
import GalleryPage from './pages/GalleryPage';
import GalleryDetailPage from './pages/GalleryDetailPage';
import ChecklistPage from './pages/ChecklistPage';
import TimelinePage from './pages/TimelinePage';
import NotFoundPage from './pages/NotFoundPage';

// 创建侧边栏状态上下文
const SidebarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}>({
  isCollapsed: false,
  setIsCollapsed: () => {}
});

// 自定义Hook
export function useSidebar() {
  return useContext(SidebarContext);
}

function Root() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <main className={`flex-1 relative overflow-auto transition-all duration-300 ${isCollapsed ? 'ml-2' : 'ml-66'}`}>
          {/* 彩色波点背景 */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `
              radial-gradient(rgba(255, 182, 193, 0.6) 2px, transparent 2px),
              radial-gradient(rgba(173, 216, 230, 0.6) 2px, transparent 2px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }} />
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'diary', Component: DiaryPage },
      { path: 'diary/:id', Component: DiaryDetailPage },
      { path: 'anniversaries', Component: AnniversaryPage },
      { path: 'wishes', Component: WishesPage },
      { path: 'wishes/:id', Component: WishDetailPage },
      { path: 'gallery', Component: GalleryPage },
      { path: 'gallery/:id', Component: GalleryDetailPage },
      { path: 'checklist', Component: ChecklistPage },
      { path: 'timeline', Component: TimelinePage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
