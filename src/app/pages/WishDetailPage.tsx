import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Calendar, Tag, Edit, CheckCircle } from 'lucide-react';

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

export default function WishDetailPage() {
  const { id } = useParams();
  const [wish, setWish] = useState<IWish | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('__global_friendship_wishes');
    if (saved) {
      const wishes: IWish[] = JSON.parse(saved);
      const found = wishes.find(w => w.id === id);
      setWish(found || null);
    }
  }, [id]);

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
            <h1 className="text-4xl font-bold text-foreground">{wish.title}</h1>
            {wish.status === 'completed' && <Star className="w-8 h-8 text-primary fill-primary" />}
          </div>
          <button className="p-2 bg-accent rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
            <Edit className="w-5 h-5" />
          </button>
        </div>

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

        {wish.status !== 'completed' && (
          <div className="pt-6 border-t-2 border-dashed border-muted">
            <h2 className="text-xl font-bold text-foreground mb-3">状态操作</h2>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground border-2 border-border shadow hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold">
                开始进行
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold">
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
            placeholder="记录实现这个心愿的过程和感受..."
            className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all min-h-[120px] resize-y"
          />
          <button className="mt-3 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold">
            保存记录
          </button>
        </div>
      )}
    </div>
  );
}
