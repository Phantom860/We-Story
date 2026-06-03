import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { BookOpen, Plus, Search, Heart, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface IDiary {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  tags: string[];
  images: string[];
  isSpecial: boolean;
  createdAt: string;
}

const moods = ['开心', '感动', '温馨', '难过', '兴奋', '平静', '惊喜', '怀念'];

export default function DiaryPage() {
  const [diaries, setDiaries] = useState<IDiary[]>(() => {
    const saved = localStorage.getItem('__global_friendship_diaries');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: '游乐园的快乐时光',
        content: '今天和最好的朋友一起去了游乐园,玩了好多刺激的项目!过山车超级好玩,虽然我一开始有点害怕,但是有ta在身边就很安心。',
        date: '2026-06-01',
        mood: '开心',
        tags: ['游玩', '快乐'],
        images: [],
        isSpecial: true,
        createdAt: '2026-06-01'
      },
      {
        id: '2',
        title: '一起看日出',
        content: '凌晨4点起床,一起去海边看日出。虽然很困,但是看到太阳从海平面升起的那一刻,觉得一切都值得了。',
        date: '2026-05-28',
        mood: '感动',
        tags: ['日出', '海边', '浪漫'],
        images: [],
        isSpecial: true,
        createdAt: '2026-05-28'
      },
      {
        id: '3',
        title: '雨天的咖啡馆',
        content: '下雨天躲进咖啡馆,点了两杯热可可,聊了一下午。窗外的雨声和咖啡的香气,让时光变得格外温柔。',
        date: '2026-05-25',
        mood: '温馨',
        tags: ['咖啡', '聊天'],
        images: [],
        isSpecial: false,
        createdAt: '2026-05-25'
      }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('全部');
  const [selectedTag, setSelectedTag] = useState('全部');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDiary, setNewDiary] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    mood: '开心',
    tags: '',
    isSpecial: false
  });

  useEffect(() => {
    localStorage.setItem('__global_friendship_diaries', JSON.stringify(diaries));
  }, [diaries]);

  const handleAddDiary = () => {
    if (!newDiary.title.trim() || !newDiary.content.trim()) return;
    
    const diary: IDiary = {
      id: Date.now().toString(),
      title: newDiary.title,
      content: newDiary.content,
      date: newDiary.date,
      mood: newDiary.mood,
      tags: newDiary.tags.split(' ').map(t => t.trim()).filter(t => t),
      images: [],
      isSpecial: newDiary.isSpecial,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setDiaries([diary, ...diaries]);
    setNewDiary({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      mood: '开心',
      tags: '',
      isSpecial: false
    });
    setShowAddForm(false);
  };

  // 获取所有唯一标签
  const allTags = [...new Set(diaries.flatMap(diary => diary.tags))];
  
  const filteredDiaries = diaries.filter(diary => {
    const matchesSearch = diary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         diary.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === '全部' || diary.mood === selectedMood;
    const matchesTag = selectedTag === '全部' || diary.tags.includes(selectedTag);
    return matchesSearch && matchesMood && matchesTag;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground tracking-wide">日常记录</h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
        >
          <Plus className="w-5 h-5" />
          新增日记
        </button>
      </div>

      {/* 新增日记表单 */}
      {showAddForm && (
        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">写一篇新日记</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 hover:bg-accent rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">标题</label>
              <input
                type="text"
                value={newDiary.title}
                onChange={(e) => setNewDiary({ ...newDiary, title: e.target.value })}
                placeholder="给日记起个名字..."
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">日期</label>
              <input
                type="date"
                value={newDiary.date}
                onChange={(e) => setNewDiary({ ...newDiary, date: e.target.value })}
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">心情</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setNewDiary({ ...newDiary, mood })}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      newDiary.mood === mood
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">内容</label>
              <textarea
                value={newDiary.content}
                onChange={(e) => setNewDiary({ ...newDiary, content: e.target.value })}
                placeholder="记录今天的故事..."
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all min-h-[200px] resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">标签 (用空格分隔)</label>
              <input
                type="text"
                value={newDiary.tags}
                onChange={(e) => setNewDiary({ ...newDiary, tags: e.target.value })}
                placeholder="例如: 游玩 快乐"
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newDiary.isSpecial}
                onChange={(e) => setNewDiary({ ...newDiary, isSpecial: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-foreground">标记为特别回忆</span>
            </div>
            <button
              onClick={handleAddDiary}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
            >
              <Heart className="w-5 h-5" />
              保存日记
            </button>
          </div>
        </div>
      )}

      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索日记、标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl pl-12 pr-4 py-3 text-lg transition-all"
          />
        </div>
        {/* 心情筛选 */}
        <Select value={selectedMood} onValueChange={setSelectedMood}>
          <SelectTrigger className="w-[140px] h-12 border-[3px] border-border shadow-sm font-normal text-lg pt-3 pb-3 mt-1 hover:ring-2 hover:ring-[rgba(236,72,153,0.4)] transition-all duration-100">
            <SelectValue placeholder="全部心情" />
          </SelectTrigger>
          <SelectContent className="bg-card border-2 border-border rounded-xl shadow-md">
            <SelectItem value="全部" className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">全部心情</SelectItem>
            {moods.map((mood) => (
              <SelectItem key={mood} value={mood} className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">{mood}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* 标签筛选 */}
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-[120px] h-12 border-[3px] border-border shadow-sm font-normal text-lg pt-3 pb-3 mt-1 hover:ring-2 hover:ring-[rgba(236,72,153,0.4)] transition-all duration-100">
            <SelectValue placeholder="全部标签" />
          </SelectTrigger>
          <SelectContent className="bg-card border-2 border-border rounded-xl shadow-md">
            <SelectItem value="全部" className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">全部标签</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag} className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 日记列表 */}
      <div className="space-y-6">
        {filteredDiaries.map((diary) => (
          <Link
            key={diary.id}
            to={`/diary/${diary.id}`}
            className="block bg-card border-2 border-border rounded-3xl p-6 shadow hover:-translate-y-2 hover:shadow-lg hover:rotate-1 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-foreground">{diary.title}</h3>
                {diary.isSpecial && <Heart className="w-6 h-6 text-primary fill-primary" />}
              </div>
              <div className="text-sm text-muted-foreground">{diary.date}</div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4 line-clamp-2">
              {diary.content}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-bold">
                {diary.mood}
              </span>
              {diary.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {filteredDiaries.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground">暂无日记记录</p>
        </div>
      )}
    </div>
  );
}
