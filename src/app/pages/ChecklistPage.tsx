import { useState, useEffect } from 'react';
import { CheckSquare, Plus, TrendingUp, X } from 'lucide-react';

interface IChecklistItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: string;
  assignee?: string;
  completedAt?: string;
}

export default function ChecklistPage() {
  const [items, setItems] = useState<IChecklistItem[]>(() => {
    const saved = localStorage.getItem('__global_friendship_checklists');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: '一起学做蛋糕',
        description: '学习制作草莓蛋糕',
        isCompleted: true,
        dueDate: '2026-05-30',
        assignee: '我们俩',
        completedAt: '2026-05-28'
      },
      {
        id: '2',
        title: '看完《你的名字》',
        description: '一起看完这部电影',
        isCompleted: true,
        dueDate: '2026-06-05',
        assignee: '我们俩',
        completedAt: '2026-06-01'
      },
      {
        id: '3',
        title: '准备生日派对',
        description: '为Ta准备一个惊喜生日派对',
        isCompleted: false,
        dueDate: '2026-07-10',
        assignee: '我'
      },
      {
        id: '4',
        title: '整理旅行照片',
        description: '把上次旅行的照片整理成册',
        isCompleted: false,
        dueDate: '2026-06-15',
        assignee: '我们俩'
      }
    ];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignee: ''
  });

  useEffect(() => {
    localStorage.setItem('__global_friendship_checklists', JSON.stringify(items));
  }, [items]);

  const toggleComplete = (id: string) => {
    setItems(items.map(item =>
      item.id === id
        ? {
            ...item,
            isCompleted: !item.isCompleted,
            completedAt: !item.isCompleted ? new Date().toISOString().split('T')[0] : undefined
          }
        : item
    ));
  };

  const handleAddItem = () => {
    if (!newItem.title.trim()) return;
    
    const item: IChecklistItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      isCompleted: false,
      dueDate: newItem.dueDate || undefined,
      assignee: newItem.assignee || undefined
    };
    
    setItems([item, ...items]);
    setNewItem({
      title: '',
      description: '',
      dueDate: '',
      assignee: ''
    });
    setShowAddForm(false);
  };

  const completedCount = items.filter(item => item.isCompleted).length;
  const completionRate = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const activeItems = items.filter(item => !item.isCompleted);
  const completedItems = items.filter(item => item.isCompleted);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground tracking-wide">打卡清单</h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
        >
          <Plus className="w-5 h-5" />
          新增事项
        </button>
      </div>

      {/* 新增事项表单 */}
      {showAddForm && (
        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">添加新事项</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 hover:bg-accent rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">事项标题</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="例如: 一起学做蛋糕"
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">详细描述</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="描述一下这个事项..."
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all min-h-[120px] resize-y"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">截止日期</label>
                <input
                  type="date"
                  value={newItem.dueDate}
                  onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                  className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">负责人</label>
                <input
                  type="text"
                  value={newItem.assignee}
                  onChange={(e) => setNewItem({ ...newItem, assignee: e.target.value })}
                  placeholder="例如: 我们俩"
                  className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
                />
              </div>
            </div>
            <button
              onClick={handleAddItem}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
            >
              <CheckSquare className="w-5 h-5" />
              添加事项
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
            <div className="text-sm text-muted-foreground">已完成</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{items.length}</div>
            <div className="text-sm text-muted-foreground">总计</div>
          </div>
        </div>
      </div>

      {/* 进行中的事项 */}
      {activeItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">进行中</h2>
          <div className="space-y-4">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className="bg-card border-2 border-border rounded-3xl p-6 shadow hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(item.id)}
                    className="flex-shrink-0 w-8 h-8 border-2 border-border bg-card rounded-lg hover:bg-primary hover:border-primary transition-all flex items-center justify-center group"
                  >
                    <div className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {item.dueDate && (
                        <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full">
                          截止: {item.dueDate}
                        </span>
                      )}
                      {item.assignee && (
                        <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full">
                          负责人: {item.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 已完成的事项 */}
      {completedItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">已完成</h2>
          <div className="space-y-4">
            {completedItems.map((item) => (
              <div
                key={item.id}
                className="bg-muted/50 border-2 border-border rounded-3xl p-6 shadow opacity-75 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(item.id)}
                    className="flex-shrink-0 w-8 h-8 border-2 border-primary bg-primary rounded-lg hover:bg-card hover:border-border transition-all flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2 line-through opacity-60">
                      {item.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-3 line-through opacity-60">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {item.completedAt && (
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full font-bold">
                          完成于: {item.completedAt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground">暂无打卡事项</p>
        </div>
      )}
    </div>
  );
}
