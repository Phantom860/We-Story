import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Calendar, Tag, Edit, Trash2, X, Save, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';

interface IWish {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  completedAt?: string;
  achievementNote?: string;
}

const priorities = [
  { value: 'low', label: '低', color: 'bg-muted text-muted-foreground' },
  { value: 'medium', label: '中', color: 'bg-accent text-accent-foreground' },
  { value: 'high', label: '高', color: 'bg-primary/20 text-primary' }
];

const categories = ['浪漫', '旅行', '美食', '艺术', '运动', '学习', '生活', '其他'];

export default function WishDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState<IWish | null>(null);
  const [achievementNote, setAchievementNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: '浪漫'
  });

  useEffect(() => {
    const saved = localStorage.getItem('__global_friendship_wishes');
    if (saved) {
      const wishes: IWish[] = JSON.parse(saved);
      const found = wishes.find(w => w.id === id);
      setWish(found || null);
      if (found) {
        setAchievementNote(found.achievementNote || '');
        setEditData({
          title: found.title,
          description: found.description,
          priority: found.priority,
          category: found.category
        });
      }
    }
  }, [id]);

  const handleSaveEdit = () => {
    if (!editData.title.trim()) return;

    const saved = localStorage.getItem('__global_friendship_wishes');
    if (saved) {
      const wishes: IWish[] = JSON.parse(saved);
      const updatedWishes = wishes.map(w => {
        if (w.id === id) {
          return {
            ...w,
            title: editData.title,
            description: editData.description,
            priority: editData.priority,
            category: editData.category
          };
        }
        return w;
      });
      localStorage.setItem('__global_friendship_wishes', JSON.stringify(updatedWishes));
      const updatedWish = updatedWishes.find(w => w.id === id);
      setWish(updatedWish || null);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    const saved = localStorage.getItem('__global_friendship_wishes');
    if (saved) {
      const wishes: IWish[] = JSON.parse(saved);
      const filteredWishes = wishes.filter(w => w.id !== id);
      localStorage.setItem('__global_friendship_wishes', JSON.stringify(filteredWishes));
      navigate('/wishes');
    }
  };

  const saveAchievementNote = () => {
    const saved = localStorage.getItem('__global_friendship_wishes');
    if (saved && wish) {
      const wishes: IWish[] = JSON.parse(saved);
      const updatedWishes = wishes.map(w => {
        if (w.id === wish.id) {
          return {
            ...w,
            achievementNote: achievementNote
          };
        }
        return w;
      });
      localStorage.setItem('__global_friendship_wishes', JSON.stringify(updatedWishes));
      setWish({
        ...wish,
        achievementNote: achievementNote
      });
    }
  };

  const updateWishStatus = (newStatus: 'pending' | 'in-progress' | 'completed') => {
    const saved = localStorage.getItem('__global_friendship_wishes');
    if (saved && wish) {
      const wishes: IWish[] = JSON.parse(saved);
      const updatedWishes = wishes.map(w => {
        if (w.id === wish.id) {
          return {
            ...w,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : w.completedAt
          };
        }
        return w;
      });
      localStorage.setItem('__global_friendship_wishes', JSON.stringify(updatedWishes));
      setWish({
        ...wish,
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : wish.completedAt
      });
    }
  };

  if (!wish) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">心愿不存在</p>
          <Link
            to="/wishes"
            className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-2xl hover:shadow-lg transition-all"
          >
            返回心愿清单
          </Link>
        </div>
      </div>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '许愿中';
      case 'in-progress': return '进行中';
      case 'completed': return '已实现';
      default: return '';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return '低';
      case 'medium': return '中';
      case 'high': return '高';
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* 返回按钮 */}
      <Link
        to="/wishes"
        className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">返回心愿清单</span>
      </Link>

      {/* 心愿内容 */}
      <div className="bg-card border-2 border-border rounded-3xl p-8 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="text-4xl font-bold text-foreground bg-transparent border-2 border-border rounded-xl px-4 py-2 focus:border-primary focus:outline-none"
              />
            ) : (
              <h1 className="text-4xl font-bold text-foreground">{wish.title}</h1>
            )}
            {wish.status === 'completed' && <Star className="w-8 h-8 text-primary fill-primary" />}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="p-2 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-accent rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-accent rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="p-2 bg-accent rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除</AlertDialogTitle>
                      <AlertDialogDescription>
                        确定要删除这个心愿吗？此操作无法撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3">
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        删除
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">心愿描述</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
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
                    onClick={() => setEditData({ ...editData, priority: priority.value as 'low' | 'medium' | 'high' })}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      editData.priority === priority.value
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
                    onClick={() => setEditData({ ...editData, category })}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      editData.category === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-accent/50 rounded-xl p-4">
                <div className="text-sm text-muted-foreground mb-1">状态</div>
                <div className="font-bold text-foreground">{getStatusText(wish.status)}</div>
              </div>
              <div className="bg-accent/50 rounded-xl p-4">
                <div className="text-sm text-muted-foreground mb-1">优先级</div>
                <div className="font-bold text-foreground">{getPriorityText(wish.priority)}</div>
              </div>
              <div className="bg-accent/50 rounded-xl p-4">
                <div className="text-sm text-muted-foreground mb-1">分类</div>
                <div className="font-bold text-foreground">{wish.category}</div>
              </div>
              <div className="bg-accent/50 rounded-xl p-4">
                <div className="text-sm text-muted-foreground mb-1">创建日期</div>
                <div className="font-bold text-foreground">{wish.createdAt}</div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground mb-3">心愿描述</h2>
              <p className="text-lg text-foreground leading-relaxed">
                {wish.description}
              </p>
            </div>
          </>
        )}

        {wish.status !== 'completed' && (
          <div className="pt-6 border-t-2 border-dashed border-muted">
            <h2 className="text-xl font-bold text-foreground mb-3">状态操作</h2>
            <div className="flex gap-3">
              {wish.status === 'pending' && (
                <button
                  onClick={() => updateWishStatus('in-progress')}
                  className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground border-2 border-border shadow hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
                >
                  开始进行
                </button>
              )}
              {wish.status === 'in-progress' && (
                <button
                  onClick={() => updateWishStatus('pending')}
                  className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground border-2 border-border shadow hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
                >
                  暂停进行
                </button>
              )}
              <button
                onClick={() => updateWishStatus('completed')}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
              >
                <CheckCircle className="w-5 h-5" />
                标记完成
              </button>
            </div>
          </div>
        )}

        {wish.completedAt && (
          <div className="pt-6 border-t-2 border-dashed border-muted">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="w-6 h-6 fill-primary" />
              <span className="font-bold">已于 {wish.completedAt} 实现</span>
            </div>
          </div>
        )}
      </div>

      {/* 实现记录 */}
      {wish.status === 'completed' && (
        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow">
          <h2 className="text-2xl font-bold text-foreground mb-4">实现记录</h2>
          <textarea
            value={achievementNote}
            onChange={(e) => setAchievementNote(e.target.value)}
            placeholder="记录实现这个心愿的过程和感受..."
            className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all min-h-[120px] resize-y"
          />
          <button
            onClick={saveAchievementNote}
            className="mt-3 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
          >
            保存记录
          </button>
        </div>
      )}
    </div>
  );
}
