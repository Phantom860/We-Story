import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Heart, BookOpen, Calendar, Star, Image, CheckSquare, TrendingUp } from 'lucide-react';

interface IAnniversary {
  id: string;
  name: string;
  date: string;
  cycle: 'yearly' | 'monthly' | 'once';
  description: string;
}

interface IStats {
  diaryCount: number;
  wishCompletionRate: number;
  checklistCompletionRate: number;
  nextAnniversaryDays: number;
}

// 计算从某个日期到今天的天数
function calculateDaysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export default function HomePage() {
  const [anniversaries, setAnniversaries] = useState<IAnniversary[]>(() => {
    const saved = localStorage.getItem('__global_friendship_anniversaries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [stats, setStats] = useState<IStats>(() => {
    const saved = localStorage.getItem('__global_friendship_stats');
    return saved ? JSON.parse(saved) : {
      diaryCount: 12,
      wishCompletionRate: 60,
      checklistCompletionRate: 75,
      nextAnniversaryDays: 15
    };
  });

  // 获取相识纪念日
  const meetingAnniversary = anniversaries.find(a => a.name === '相识纪念日');
  // 计算相识天数
  const daysSinceMet = meetingAnniversary ? calculateDaysSince(meetingAnniversary.date) : 0;

  useEffect(() => {
    localStorage.setItem('__global_friendship_stats', JSON.stringify(stats));
  }, [stats]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* 页面标题 */}
      <div className="flex items-center gap-3">
        <Heart className="w-10 h-10 text-primary fill-primary" />
        <h1 className="text-4xl font-bold text-foreground tracking-wide">友谊概览</h1>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow hover:-translate-y-2 hover:shadow-lg hover:rotate-1 transition-all duration-300">
          <div className="text-sm text-muted-foreground mb-2">相识天数</div>
          <div className="text-5xl font-bold text-primary">{daysSinceMet}</div>
          <div className="text-sm text-muted-foreground mt-2">天</div>
        </div>

        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow hover:-translate-y-2 hover:shadow-lg hover:rotate-1 transition-all duration-300">
          <div className="text-sm text-muted-foreground mb-2">日记数量</div>
          <div className="text-5xl font-bold text-primary">{stats.diaryCount}</div>
          <div className="text-sm text-muted-foreground mt-2">篇</div>
        </div>

        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow hover:-translate-y-2 hover:shadow-lg hover:rotate-1 transition-all duration-300">
          <div className="text-sm text-muted-foreground mb-2">心愿完成率</div>
          <div className="text-5xl font-bold text-primary">{stats.wishCompletionRate}%</div>
        </div>

        <div className="bg-primary/20 border-2 border-border rounded-3xl p-6 shadow hover:-translate-y-2 hover:shadow-lg hover:rotate-1 transition-all duration-300">
          <div className="text-sm text-foreground mb-2">下个纪念日</div>
          <div className="text-5xl font-bold text-primary">{stats.nextAnniversaryDays}</div>
          <div className="text-sm text-foreground mt-2">天后</div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow">
        <h2 className="text-2xl font-bold text-foreground mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/diary"
            className="flex flex-col items-center gap-2 p-4 bg-accent rounded-2xl hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 hover:shadow transition-all"
          >
            <BookOpen className="w-8 h-8" />
            <span className="font-bold">新增日记</span>
          </Link>
          <Link
            to="/anniversaries"
            className="flex flex-col items-center gap-2 p-4 bg-accent rounded-2xl hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 hover:shadow transition-all"
          >
            <Calendar className="w-8 h-8" />
            <span className="font-bold">添加纪念日</span>
          </Link>
          <Link
            to="/wishes"
            className="flex flex-col items-center gap-2 p-4 bg-accent rounded-2xl hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 hover:shadow transition-all"
          >
            <Star className="w-8 h-8" />
            <span className="font-bold">许个心愿</span>
          </Link>
          <Link
            to="/gallery"
            className="flex flex-col items-center gap-2 p-4 bg-accent rounded-2xl hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 hover:shadow transition-all"
          >
            <Image className="w-8 h-8" />
            <span className="font-bold">上传照片</span>
          </Link>
        </div>
      </div>

      {/* 最新动态 */}
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">最新动态</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-xl">
            <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <div className="font-bold text-foreground">新增日记</div>
              <div className="text-sm text-muted-foreground">今天一起去了游乐园,超级开心!</div>
              <div className="text-xs text-muted-foreground mt-1">2 小时前</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-xl">
            <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <div className="font-bold text-foreground">完成心愿</div>
              <div className="text-sm text-muted-foreground">一起看日出 ✓</div>
              <div className="text-xs text-muted-foreground mt-1">1 天前</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-xl">
            <Image className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <div className="font-bold text-foreground">新增照片</div>
              <div className="text-sm text-muted-foreground">上传了 5 张新照片</div>
              <div className="text-xs text-muted-foreground mt-1">3 天前</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
