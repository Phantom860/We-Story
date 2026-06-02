import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Calendar, Tag, Edit, Trash2, X, Save, MessageCircle, Send, User } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';

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

interface IComment {
  id: string;
  diaryId: string;
  content: string;
  author: string;
  createdAt: string;
}

const moods = ['开心', '感动', '温馨', '难过', '兴奋', '平静', '惊喜', '怀念'];

export default function DiaryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<IDiary | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editData, setEditData] = useState({
    title: '',
    content: '',
    date: '',
    mood: '',
    tags: '',
    isSpecial: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('__global_friendship_diaries');
    if (saved) {
      const diaries: IDiary[] = JSON.parse(saved);
      const found = diaries.find(d => d.id === id);
      setDiary(found || null);
      if (found) {
        setEditData({
          title: found.title,
          content: found.content,
          date: found.date,
          mood: found.mood,
          tags: found.tags.join(' '),
          isSpecial: found.isSpecial
        });
      }
    }
  }, [id]);

  useEffect(() => {
    const savedComments = localStorage.getItem(`__global_diary_comments_${id}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [id]);

  const handleSaveEdit = () => {
    if (!editData.title.trim() || !editData.content.trim()) return;

    const saved = localStorage.getItem('__global_friendship_diaries');
    if (saved) {
      const diaries: IDiary[] = JSON.parse(saved);
      const updatedDiaries = diaries.map(d => {
        if (d.id === id) {
          return {
            ...d,
            title: editData.title,
            content: editData.content,
            date: editData.date,
            mood: editData.mood,
            tags: editData.tags.split(' ').map(t => t.trim()).filter(t => t),
            isSpecial: editData.isSpecial
          };
        }
        return d;
      });
      localStorage.setItem('__global_friendship_diaries', JSON.stringify(updatedDiaries));
      const updatedDiary = updatedDiaries.find(d => d.id === id);
      setDiary(updatedDiary || null);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    const saved = localStorage.getItem('__global_friendship_diaries');
    if (saved) {
      const diaries: IDiary[] = JSON.parse(saved);
      const filteredDiaries = diaries.filter(d => d.id !== id);
      localStorage.setItem('__global_friendship_diaries', JSON.stringify(filteredDiaries));
      localStorage.removeItem(`__global_diary_comments_${id}`);
      navigate('/diary');
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: IComment = {
      id: Date.now().toString(),
      diaryId: id || '',
      content: newComment.trim(),
      author: '我',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`__global_diary_comments_${id}`, JSON.stringify(updatedComments));
    setNewComment('');
  };

  const handleDeleteComment = (commentId: string) => {
    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(`__global_diary_comments_${id}`, JSON.stringify(updatedComments));
  };

  if (!diary) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">日记不存在</p>
          <Link
            to="/diary"
            className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-2xl hover:shadow-lg transition-all"
          >
            返回日记列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <Link
        to="/diary"
        className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">返回日记列表</span>
      </Link>

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
              <h1 className="text-4xl font-bold text-foreground">{diary.title}</h1>
            )}
            {diary.isSpecial && <Heart className="w-8 h-8 text-primary fill-primary" />}
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
                        确定要删除这篇日记吗？此操作无法撤销。
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
              <label className="block text-sm font-bold text-foreground mb-2">日期</label>
              <input
                type="date"
                value={editData.date}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">心情</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setEditData({ ...editData, mood })}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      editData.mood === mood
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
                value={editData.content}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all min-h-[200px] resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">标签 (用空格分隔)</label>
              <input
                type="text"
                value={editData.tags}
                onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                placeholder="例如: 游玩 快乐"
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editData.isSpecial}
                onChange={(e) => setEditData({ ...editData, isSpecial: e.target.checked })}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-foreground">标记为特别回忆</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{diary.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-bold">
                  {diary.mood}
                </span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">
                {diary.content}
              </p>
            </div>

            {diary.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-6 border-t-2 border-dashed border-muted">
                <Tag className="w-5 h-5 text-muted-foreground" />
                {diary.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          评论和回忆
          {comments.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">({comments.length})</span>
          )}
        </h2>

        <div className="flex gap-3 mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
            placeholder="添加你的想法... (按 Enter 发送)"
            className="flex-1 bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all min-h-[80px] resize-none"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="px-4 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>还没有评论，来添加第一条评论吧</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-accent/50 border-2 border-border rounded-2xl p-4 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-foreground">{comment.author}</span>
                        <span className="text-sm text-muted-foreground">{comment.createdAt}</span>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                          确定要删除这条评论吗？此操作无法撤销。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="flex gap-3">
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteComment(comment.id)} className="bg-destructive hover:bg-destructive/90">
                          删除
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}