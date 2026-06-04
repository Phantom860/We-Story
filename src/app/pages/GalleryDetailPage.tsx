import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Upload, X, Trash2, Edit, Check, Camera, FolderOpen, Download, ChevronLeft, ChevronRight, ZoomIn, MapPin, Tag as TagIcon } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

interface IPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  description?: string;
  date: string;
}

interface IAlbum {
  id: string;
  title: string;
  coverPhoto?: IPhoto;
  photos: IPhoto[];
  tags: string[];
  location?: string;
  createdAt: string;
  updatedAt: string;
}

const commonTags = ['聚餐', '看电影', 'KTV', '旅行', '运动', '游玩', '美食', '生日', '纪念日', '日常'];

const randomImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop'
];

export default function GalleryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<IAlbum | null>(null);
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [viewingPhoto, setViewingPhoto] = useState<IPhoto | null>(null);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editLocation, setEditLocation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('__global_friendship_albums');
    if (saved) {
      const data: IAlbum[] = JSON.parse(saved);
      setAlbums(data);
      const found = data.find(a => a.id === id);
      setAlbum(found || null);
      if (found) {
        setEditTitle(found.title);
      }
    }
  }, [id]);

  useEffect(() => {
    if (albums.length > 0) {
      localStorage.setItem('__global_friendship_albums', JSON.stringify(albums));
    }
  }, [albums]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhoto = () => {
    if (!newPhoto.title.trim() || !album) return;

    const randomUrl = randomImages[Math.floor(Math.random() * randomImages.length)];
    const photo: IPhoto = {
      id: Date.now().toString(),
      url: previewImage || randomUrl,
      thumbnailUrl: previewImage || randomUrl.replace('w=800&h=600', 'w=400&h=300'),
      title: newPhoto.title,
      description: newPhoto.description,
      date: newPhoto.date
    };

    const updatedAlbums = albums.map(a => {
      if (a.id === album.id) {
        const updatedPhotos = [photo, ...a.photos];
        return {
          ...a,
          photos: updatedPhotos,
          coverPhoto: a.coverPhoto || photo,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    });

    setAlbums(updatedAlbums);
    setAlbum(updatedAlbums.find(a => a.id === album.id) || null);
    setNewPhoto({ title: '', description: '', date: new Date().toISOString().split('T')[0] });
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowAddPhoto(false);
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!album) return;

    const updatedAlbums = albums.map(a => {
      if (a.id === album.id) {
        const updatedPhotos = a.photos.filter(p => p.id !== photoId);
        return {
          ...a,
          photos: updatedPhotos,
          coverPhoto: a.coverPhoto?.id === photoId ? updatedPhotos[0] : a.coverPhoto,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    });

    setAlbums(updatedAlbums);
    setAlbum(updatedAlbums.find(a => a.id === album.id) || null);
  };

  const handleSaveTitle = () => {
    if (!editTitle.trim() || !album) return;

    const updatedAlbums = albums.map(a => {
      if (a.id === album.id) {
        return {
          ...a,
          title: editTitle.trim(),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    });

    setAlbums(updatedAlbums);
    setAlbum(updatedAlbums.find(a => a.id === album.id) || null);
    setIsEditingTitle(false);
  };

  const handleEditTagsAndLocation = () => {
    if (!album) return;

    const updatedAlbums = albums.map(a => {
      if (a.id === album.id) {
        return {
          ...a,
          tags: editTags,
          location: editLocation || undefined,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    });

    setAlbums(updatedAlbums);
    setAlbum(updatedAlbums.find(a => a.id === album.id) || null);
    setIsEditingTags(false);
  };

  const startEditingTags = () => {
    if (!album) return;
    setEditTags([...(album.tags || [])]);
    setEditLocation(album.location || '');
    setIsEditingTags(true);
  };

  const handleDeleteAlbum = () => {
    const updatedAlbums = albums.filter(a => a.id !== id);
    setAlbums(updatedAlbums);
    navigate('/gallery');
  };

  if (!album) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">相册不存在</p>
          <Link
            to="/gallery"
            className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-2xl hover:shadow-lg transition-all"
          >
            返回相册
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* 返回按钮 */}
      <Link
        to="/gallery"
        className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-bold">返回相册</span>
      </Link>

      {/* 相册信息 */}
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 flex-1">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-3xl font-bold text-foreground bg-transparent border-2 border-border rounded-xl px-4 py-2 focus:border-primary focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveTitle();
                    }
                  }}
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-2 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setIsEditingTitle(false);
                    setEditTitle(album?.title || '');
                  }}
                  className="p-2 bg-accent rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <FolderOpen className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">{album?.title || '相册'}</h1>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {!isEditingTitle && (
              <>
                <button
                  onClick={() => setIsEditingTitle(true)}
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
                        确定要删除这个相册吗？相册内的所有照片都将被删除。此操作无法撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3">
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAlbum} className="bg-destructive hover:bg-destructive/90">
                        删除
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            <span className="font-bold text-foreground">{album?.photos?.length || 0}</span>
            <span>张照片</span>
          </div>
          <div>
            创建于 {album?.createdAt || '-'}
          </div>
          {album?.updatedAt !== album?.createdAt && (
            <div>
              更新于 {album?.updatedAt || '-'}
            </div>
          )}
        </div>

        {/* 标签和地点 */}
        {isEditingTags ? (
          <div className="mt-4 space-y-4 p-4 bg-muted/50 rounded-2xl">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  地点
                </span>
              </label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="例如: 北京、上海、家里..."
                className="w-full bg-card border-2 border-border rounded-xl px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                <span className="flex items-center gap-1">
                  <TagIcon className="w-4 h-4" />
                  标签
                </span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {commonTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (editTags.includes(tag)) {
                        setEditTags(editTags.filter(t => t !== tag));
                      } else {
                        setEditTags([...editTags, tag]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                      editTags.includes(tag)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="添加自定义标签（用逗号分隔）"
                className="w-full bg-card border-2 border-border rounded-xl px-4 py-2 focus:border-primary focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = e.currentTarget.value.trim();
                    if (value) {
                      const customTags = value.split(',').map(t => t.trim()).filter(t => t && !editTags.includes(t));
                      setEditTags([...editTags, ...customTags]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEditTagsAndLocation}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-bold"
              >
                <Check className="w-5 h-5" />
                保存
              </button>
              <button
                onClick={() => setIsEditingTags(false)}
                className="flex items-center gap-2 px-4 py-2 bg-accent rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-colors font-bold"
              >
                <X className="w-5 h-5" />
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {album?.location && (
              <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                <MapPin className="w-4 h-4" />
                {album.location}
              </div>
            )}
            {album?.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold"
              >
                {tag}
              </span>
            ))}
            {(!album?.location && album?.tags?.length === 0) && (
              <span className="text-muted-foreground text-sm">暂无标签和地点</span>
            )}
            <button
              onClick={startEditingTags}
              className="p-1 bg-accent rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 添加照片按钮 */}
      <Dialog open={showAddPhoto} onOpenChange={setShowAddPhoto}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold">
            <Upload className="w-5 h-5" />
            添加照片
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">添加新照片</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* 图片预览 */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">选择照片</label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="预览"
                      className="max-h-48 mx-auto rounded-lg object-contain"
                    />
                    <button
                      onClick={() => {
                        setPreviewImage(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-12 h-12 text-muted-foreground" />
                    <span className="text-muted-foreground">点击或拖拽上传照片</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      选择文件
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">照片标题</label>
              <input
                type="text"
                value={newPhoto.title}
                onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                placeholder="给照片起个名字..."
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">描述</label>
              <textarea
                value={newPhoto.description}
                onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                placeholder="记录这张照片的故事..."
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all min-h-[100px] resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">日期</label>
              <input
                type="date"
                value={newPhoto.date}
                onChange={(e) => setNewPhoto({ ...newPhoto, date: e.target.value })}
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
              />
            </div>
            <button
              onClick={handleAddPhoto}
              disabled={!newPhoto.title.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Upload className="w-5 h-5" />
              添加照片
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 照片网格 */}
      {album?.photos?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {album.photos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setViewingPhoto(photo)}
              style={{ cursor: 'pointer' }}
              className="relative group bg-card border-2 border-border rounded-2xl overflow-hidden shadow hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  style={{ cursor: 'pointer' }}
                />
              </div>
              {/* 悬停显示的信息 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <h3 className="text-white font-bold text-sm truncate">{photo.title}</h3>
                <p className="text-white/80 text-xs">{photo.date}</p>
              </div>
              {/* 删除按钮 - 阻止事件冒泡 */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认删除</AlertDialogTitle>
                    <AlertDialogDescription>
                      确定要删除这张照片吗？此操作无法撤销。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-3">
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeletePhoto(photo.id)} className="bg-destructive hover:bg-destructive/90">
                      删除
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border-2 border-border rounded-3xl">
          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground mb-4">这个相册还没有照片</p>
          <button
            onClick={() => setShowAddPhoto(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold mx-auto"
          >
            <Upload className="w-5 h-5" />
            添加第一张照片
          </button>
        </div>
      )}

      {/* 照片查看器 */}
      {viewingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center cursor-pointer"
          onClick={() => setViewingPhoto(null)}
        >
          {/* 关闭按钮 */}
          <button
            onClick={() => setViewingPhoto(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* 上一张 */}
          {album.photos.findIndex(p => p.id === viewingPhoto.id) > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = album.photos.findIndex(p => p.id === viewingPhoto.id);
                setViewingPhoto(album.photos[currentIndex - 1]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10 cursor-pointer"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* 下一张 */}
          {album.photos.findIndex(p => p.id === viewingPhoto.id) < album.photos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = album.photos.findIndex(p => p.id === viewingPhoto.id);
                setViewingPhoto(album.photos[currentIndex + 1]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10 cursor-pointer"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* 大图 */}
          <div
            className="max-w-[95vw] max-h-[95vh] flex items-center justify-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={viewingPhoto.url}
              alt={viewingPhoto.title}
              className="max-w-full max-h-full object-contain"
            />

            {/* 照片信息 */}
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-bold">{viewingPhoto.title}</h3>
              <p className="text-white/70 text-sm">{viewingPhoto.date}</p>
            </div>

            {/* 下载按钮 - 右下角 */}
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = viewingPhoto.url;
                link.download = viewingPhoto.title + '.jpg';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-5 h-5" />
              下载
            </button>

            {/* 照片计数 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
              {album?.photos?.findIndex(p => p.id === viewingPhoto.id) + 1} / {album?.photos?.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
