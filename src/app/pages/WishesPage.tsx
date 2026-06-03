import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Star, Plus, TrendingUp, X } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../components/ui/select';

interface IWish {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  completedAt?: string;
}

const priorities = [
  { value: 'low', label: '低', color: 'bg-muted text-muted-foreground' },
  { value: 'medium', label: '中', color: 'bg-accent text-accent-foreground' },
  { value: 'high', label: '高', color: 'bg-primary/20 text-primary' }
];

const categories = ['浪漫', '旅行', '美食', '艺术', '运动', '学习', '生活', '其他'];

export default function WishesPage() {
  const [wishes, setWishes] = useState<IWish[]>(() => {
    const saved = localStorage.getItem('__global_friendship_wishes');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: '一起看日出',
        description: '在海边等待日出,见证新的一天开始',
        status: 'completed',
        priority: 'high',
        category: '浪漫',
        createdAt: '2026-05-01',
        completedAt: '2026-05-28'
      },
      {
        id: '2',
        title: '环游世界',
        description: '一起去看看这个世界的美好',
        status: 'in-progress',
        priority: 'high',
        category: '旅行',
        createdAt: '2026-01-01'
      },
      {
        id: '3',
        title: '学会做对方喜欢的菜',
        description: '用心做一顿美味的晚餐',
        status: 'pending',
        priority: 'medium',
        category: '美食',
        createdAt: '2026-04-15'
      },
      {
        id: '4',
        title: '一起完成一幅画',
        description: '合作完成一幅有意义的画作',
        status: 'pending',
        priority: 'low',
        category: '艺术',
        createdAt: '2026-03-20'
      }
    ];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newWish, setNewWish] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: '浪漫'
  });
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    localStorage.setItem('__global_friendship_wishes', JSON.stringify(wishes));
  }, [wishes]);

  const handleAddWish = () => {
    if (!newWish.title.trim()) return;
    
    const wish: IWish = {
      id: Date.now().toString(),
      title: newWish.title,
      description: newWish.description,
      status: 'pending',
      priority: newWish.priority,
      category: newWish.category,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setWishes([wish, ...wishes]);
    setNewWish({
      title: '',
      description: '',
      priority: 'medium',
      category: '浪漫'
    });
    setShowAddForm(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '许愿中';
      case 'in-progress': return '进行中';
      case 'completed': return '已实现';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-muted text-muted-foreground';
      case 'in-progress': return 'bg-accent text-accent-foreground';
      case 'completed': return 'bg-primary/20 text-primary';
      default: return '';
    }
  };

  const completedCount = wishes.filter(w => w.status === 'completed').length;
  const completionRate = wishes.length > 0 ? Math.round((completedCount / wishes.length) * 100) : 0;
  
  const filteredWishes = wishes.filter(wish => {
    const priorityMatch = priorityFilter === 'all' || wish.priority === priorityFilter;
    const categoryMatch = categoryFilter === 'all' || wish.category === categoryFilter;
    return priorityMatch && categoryMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="w-10 h-10 text-primary fill-primary" />
          <h1 className="text-4xl font-bold text-foreground tracking-wide">心愿清单</h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
        >
          <Plus className="w-5 h-5" />
          新增心愿
        </button>
      </div>

      {/* 新增心愿表单 */}
      {showAddForm && (
        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">许下新心愿</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 hover:bg-accent rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">心愿标题</label>
              <input
                type="text"
                value={newWish.title}
                onChange={(e) => setNewWish({ ...newWish, title: e.target.value })}
                placeholder="你想要实现什么愿望?"
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">详细描述</label>
              <textarea
                value={newWish.description}
                onChange={(e) => setNewWish({ ...newWish, description: e.target.value })}
                placeholder="描述一下这个心愿..."
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all min-h-[120px] resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">优先级</label>
              <div className="flex flex-wrap gap-2">
                {priorities.map((priority) => (
                  <button
                    key={priority.value}
                    onClick={() => setNewWish({ ...newWish, priority: priority.value as 'low' | 'medium' | 'high' })}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      newWish.priority === priority.value
                        ? 'bg-primary text-primary-foreground'
                        : priority.color
                    }`}
                  >
                    {priority.label}优先级
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">分类</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setNewWish({ ...newWish, category })}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      newWish.category === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleAddWish}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
            >
              <Star className="w-5 h-5 fill-primary-foreground" />
              许下心愿
            </button>
          </div>
        </div>
      )}

      {/* 进度统计 */}
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">整体进度</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-primary">{completionRate}%</span>
              <span className="text-sm text-muted-foreground">完成率</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{completedCount}</div>
            <div className="text-sm text-muted-foreground">已实现</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{wishes.length}</div>
            <div className="text-sm text-muted-foreground">总计</div>
          </div>
        </div>
      </div>

      {/* 筛选控件 */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-muted-foreground">优先级:</span>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px] h-12 border-[3px] border-border shadow-sm font-normal text-lg pt-3 pb-3 mt-1 hover:ring-2 hover:ring-[rgba(236,72,153,0.4)] transition-all duration-100">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent className="bg-card border-2 border-border rounded-xl shadow-md">
              <SelectItem value="all" className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">全部</SelectItem>
              <SelectItem value="high" className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">高优先级</SelectItem>
              <SelectItem value="medium" className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">中优先级</SelectItem>
              <SelectItem value="low" className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">低优先级</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-muted-foreground">分类:</span>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px] h-12 border-[3px] border-border shadow-sm font-normal text-lg pt-3 pb-3 mt-1 hover:ring-2 hover:ring-[rgba(236,72,153,0.4)] transition-all duration-100">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent className="bg-card border-2 border-border rounded-xl shadow-md">
              <SelectItem value="all" className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">全部</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 心愿网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWishes.map((wish) => (
          <Link
            key={wish.id}
            to={`/wishes/${wish.id}`}
            className="block bg-card border-2 border-border rounded-3xl p-6 shadow hover:-translate-y-2 hover:shadow-lg hover:rotate-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-2xl font-bold text-foreground flex-1">{wish.title}</h3>
              {wish.status === 'completed' && (
                <Star className="w-6 h-6 text-primary fill-primary flex-shrink-0" />
              )}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-4 line-clamp-2">
              {wish.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(wish.status)}`}>
                {getStatusText(wish.status)}
              </span>
              <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm">
                {wish.category}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredWishes.length === 0 && (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground">
            {wishes.length === 0 ? '暂无心愿' : '没有找到匹配的心愿'}
          </p>
        </div>
      )}
    </div>
  );
}
