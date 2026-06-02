import { NavLink } from 'react-router';
import { Home, BookOpen, CalendarHeart, Star, Image, CheckSquare, Clock, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebar } from '../routes';

const navigation = [
  { name: '首页', path: '/', icon: Home },
  { name: '日常记录', path: '/diary', icon: BookOpen },
  { name: '纪念日', path: '/anniversaries', icon: CalendarHeart },
  { name: '心愿清单', path: '/wishes', icon: Star },
  { name: '相册', path: '/gallery', icon: Image },
  { name: '打卡清单', path: '/checklist', icon: CheckSquare },
  { name: '时间轴', path: '/timeline', icon: Clock },
];

export default function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <div className={`fixed top-0 bottom-0 bg-sidebar border-r-2 border-sidebar-border flex flex-col transition-all duration-500 ease-out z-40 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className={`p-4 border-b-2 border-sidebar-border flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
        <div className={`${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'} bg-primary rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Heart className={`${isCollapsed ? 'w-6 h-6' : 'w-7 h-7'} text-primary-foreground fill-primary-foreground`} />
        </div>
        {!isCollapsed && (
          <div className="ml-3 overflow-hidden">
            <h1 className="text-xl font-bold text-sidebar-foreground whitespace-nowrap">友谊记录</h1>
            <p className="text-xs text-muted-foreground whitespace-nowrap">珍藏每一刻</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:scale-105'
              } ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            {!isCollapsed && <span className="font-bold whitespace-nowrap">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t-2 border-sidebar-border ${isCollapsed ? 'flex justify-center' : 'flex flex-col items-center'}`}>
        {isCollapsed ? (
          <Heart className="w-5 h-5 text-primary fill-primary animate-pulse" />
        ) : (
          <>
            <div className="text-xs text-muted-foreground mb-1">Our Memories</div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-primary fill-primary" />
              <Heart className="w-2 h-2 text-primary fill-primary" />
              <Heart className="w-3 h-3 text-primary fill-primary" />
            </div>
          </>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-10 cursor-pointer"
        title={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </div>
  );
}