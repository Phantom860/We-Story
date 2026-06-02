import { useState, useEffect } from 'react';
import { CalendarHeart, Plus, Calendar, X, Trash2, Edit3, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

interface IAnniversary {
  id: string;
  name: string;
  date: string;
  cycle: 'yearly' | 'monthly' | 'once';
  description: string;
  daysUntil: number;
}

const cycles = [
  { value: 'yearly', label: '每年' },
  { value: 'monthly', label: '每月' },
  { value: 'once', label: '单次' }
];

// 圆盘倒计时组件
function CircularCountdown({ days }: { days: number }) {
  const isExpired = days === -1;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  // 假设一年最多365天，计算进度
  const progress = Math.min(days / 365, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        {/* 背景圆环 */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="6"
        />
        {/* 进度圆环 */}
        {!isExpired && (
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="hsl(340 70% 70%)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        )}
      </svg>
      {/* 中心文字 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isExpired ? (
          <span className="text-sm font-bold text-muted-foreground">已过</span>
        ) : (
          <>
            <span className="text-xl font-bold text-primary">{days}</span>
            <span className="text-xs text-muted-foreground">天</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function AnniversaryPage() {
  const [anniversaries, setAnniversaries] = useState<IAnniversary[]>(() => {
    const saved = localStorage.getItem('__global_friendship_anniversaries');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: '相识纪念日',
        date: '2025-06-15',
        cycle: 'yearly',
        description: '我们第一次见面的日子，在图书馆的角落',
        daysUntil: 18
      },
      {
        id: '2',
        name: 'Ta的生日',
        date: '2026-07-15',
        cycle: 'yearly',
        description: '最好的朋友的生日',
        daysUntil: 43
      },
      {
        id: '3',
        name: '第一次旅行',
        date: '2025-08-20',
        cycle: 'yearly',
        description: '我们第一次一起去旅行',
        daysUntil: 79
      },
      {
        id: '4',
        name: '第一次看电影',
        date: '2025-05-01',
        cycle: 'once',
        description: '我们一起看的第一部电影',
        daysUntil: -1
      }
    ];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAnniversary, setEditingAnniversary] = useState<IAnniversary | null>(null);
  const [newAnniversary, setNewAnniversary] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    cycle: 'yearly' as 'yearly' | 'monthly' | 'once',
    description: ''
  });

  useEffect(() => {
    localStorage.setItem('__global_friendship_anniversaries', JSON.stringify(anniversaries));
  }, [anniversaries]);

  const calculateDaysUntil = (date: string, cycle: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const target = new Date(date);
    target.setFullYear(today.getFullYear());
    target.setHours(0, 0, 0, 0);
    
    // 单次纪念日，如果日期已过则返回 -1
    if (cycle === 'once' && target < today) {
      return -1;
    }
    
    // 每年重复，如果日期已过则计算明年
    if (target < today && cycle === 'yearly') {
      target.setFullYear(today.getFullYear() + 1);
    }
    
    // 每月重复，如果日期已过则计算下个月
    if (target < today && cycle === 'monthly') {
      target.setMonth(target.getMonth() + 1);
    }
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 0 ? 0 : diffDays;
  };

  const handleAddAnniversary = () => {
    if (!newAnniversary.name.trim()) return;
    
    const anniversary: IAnniversary = {
      id: Date.now().toString(),
      name: newAnniversary.name,
      date: newAnniversary.date,
      cycle: newAnniversary.cycle,
      description: newAnniversary.description,
      daysUntil: calculateDaysUntil(newAnniversary.date, newAnniversary.cycle)
    };
    
    setAnniversaries([anniversary, ...anniversaries]);
    setNewAnniversary({
      name: '',
      date: new Date().toISOString().split('T')[0],
      cycle: 'yearly',
      description: ''
    });
    setShowAddForm(false);
  };

  const handleEditAnniversary = () => {
    if (!editingAnniversary || !newAnniversary.name.trim()) return;
    
    setAnniversaries(anniversaries.map(a => 
      a.id === editingAnniversary.id 
        ? {
            ...a,
            name: newAnniversary.name,
            date: newAnniversary.date,
            cycle: newAnniversary.cycle,
            description: newAnniversary.description,
            daysUntil: calculateDaysUntil(newAnniversary.date, newAnniversary.cycle)
          }
        : a
    ));
    setShowEditForm(false);
    setEditingAnniversary(null);
    setNewAnniversary({
      name: '',
      date: new Date().toISOString().split('T')[0],
      cycle: 'yearly',
      description: ''
    });
  };

  const openEditForm = (anniversary: IAnniversary) => {
    setEditingAnniversary(anniversary);
    setNewAnniversary({
      name: anniversary.name,
      date: anniversary.date,
      cycle: anniversary.cycle,
      description: anniversary.description
    });
    setShowEditForm(true);
  };

  const getCycleText = (cycle: string) => {
    switch (cycle) {
      case 'yearly': return '每年';
      case 'monthly': return '每月';
      case 'once': return '单次';
      default: return '';
    }
  };

  const handleDeleteAnniversary = (id: string) => {
    setAnniversaries(anniversaries.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarHeart className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground tracking-wide">纪念日</h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
        >
          <Plus className="w-5 h-5" />
          添加纪念日
        </button>
      </div>

      {/* 新增/编辑纪念日表单 */}
      {(showAddForm || showEditForm) && (
        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {showEditForm ? '编辑纪念日' : '添加新纪念日'}
            </h2>
            <button
              onClick={() => {
                setShowAddForm(false);
                setShowEditForm(false);
                setEditingAnniversary(null);
                setNewAnniversary({
                  name: '',
                  date: new Date().toISOString().split('T')[0],
                  cycle: 'yearly',
                  description: ''
                });
              }}
              className="p-2 hover:bg-accent rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">纪念日名称</label>
              <input
                type="text"
                value={newAnniversary.name}
                onChange={(e) => setNewAnniversary({ ...newAnniversary, name: e.target.value })}
                placeholder="例如: 相识纪念日"
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">日期</label>
              <input
                type="date"
                value={newAnniversary.date}
                onChange={(e) => setNewAnniversary({ ...newAnniversary, date: e.target.value })}
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">重复周期</label>
              <div className="flex flex-wrap gap-2">
                {cycles.map((cycle) => (
                  <button
                    key={cycle.value}
                    onClick={() => setNewAnniversary({ ...newAnniversary, cycle: cycle.value as 'yearly' | 'monthly' | 'once' })}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      newAnniversary.cycle === cycle.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {cycle.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">描述</label>
              <textarea
                value={newAnniversary.description}
                onChange={(e) => setNewAnniversary({ ...newAnniversary, description: e.target.value })}
                placeholder="记录这个纪念日的意义..."
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all min-h-[120px] resize-y"
              />
            </div>
            <button
              onClick={showEditForm ? handleEditAnniversary : handleAddAnniversary}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
            >
              <CalendarHeart className="w-5 h-5" />
              {showEditForm ? '保存修改' : '添加纪念日'}
            </button>
          </div>
        </div>
      )}

      {/* 纪念日列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {anniversaries.map((anniversary) => (
          <div
            key={anniversary.id}
            className="bg-card border-2 border-border rounded-3xl p-6 shadow hover:-translate-y-2 hover:shadow-lg hover:rotate-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground">{anniversary.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditForm(anniversary)}
                  className="p-2 hover:bg-accent text-muted-foreground hover:text-primary rounded-xl transition-all"
                  title="编辑纪念日"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-xl transition-all"
                      title="删除纪念日"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除</AlertDialogTitle>
                      <AlertDialogDescription>
                        确定要删除「{anniversary.name}」这个纪念日吗？此操作无法撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3">
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteAnniversary(anniversary.id)}>
                        删除
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <Calendar className="w-5 h-5" />
              <span>{anniversary.date}</span>
            </div>

            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <RefreshCw className="w-5 h-5" />
              <span>{getCycleText(anniversary.cycle)}</span>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {anniversary.description}
            </p>

            <div className="pt-4 border-t-2 border-dashed border-muted">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">倒计时</span>
                <CircularCountdown days={anniversary.daysUntil} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {anniversaries.length === 0 && (
        <div className="text-center py-12">
          <CalendarHeart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground">暂无纪念日</p>
        </div>
      )}
    </div>
  );
}