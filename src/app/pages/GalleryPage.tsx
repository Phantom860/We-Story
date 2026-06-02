import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Image as ImageIcon, Plus, Search, Grid3x3, X, Upload } from 'lucide-react';

interface IPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  tags: string[];
  albumId?: string;
}

// 随机图片占位符
const randomImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop'
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState<IPhoto[]>(() => {
    const saved = localStorage.getItem('__global_friendship_photos');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=300&fit=crop',
        title: '游乐园',
        description: '在游乐园度过的快乐时光',
        date: '2026-06-01',
        location: '欢乐谷',
        tags: ['游玩', '快乐']
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        title: '海边日出',
        description: '一起看日出的美好时刻',
        date: '2026-05-28',
        location: '海滩',
        tags: ['日出', '浪漫']
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
        title: '咖啡时光',
        description: '咖啡馆的温馨时光',
        date: '2026-05-25',
        location: '星巴克',
        tags: ['咖啡', '温馨']
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop',
        title: '樱花树下',
        description: '春天的樱花树下合影',
        date: '2026-04-10',
        location: '公园',
        tags: ['春天', '樱花']
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
        title: '山顶风景',
        description: '登山后的美景',
        date: '2026-03-15',
        location: '香山',
        tags: ['登山', '自然']
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop',
        title: '美食时刻',
        description: '一起享用美食',
        date: '2026-02-20',
        location: '餐厅',
        tags: ['美食', '聚餐']
      }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    tags: ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('__global_friendship_photos', JSON.stringify(photos));
  }, [photos]);

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

  const handleUploadPhoto = () => {
    if (!newPhoto.title.trim()) return;
    
    // 使用随机图片作为模拟上传
    const randomUrl = randomImages[Math.floor(Math.random() * randomImages.length)];
    
    const photo: IPhoto = {
      id: Date.now().toString(),
      url: previewImage || randomUrl,
      thumbnailUrl: previewImage || randomUrl.replace('w=800&h=600', 'w=400&h=300'),
      title: newPhoto.title,
      description: newPhoto.description,
      date: newPhoto.date,
      location: newPhoto.location || undefined,
      tags: newPhoto.tags.split(',').map(t => t.trim()).filter(t => t)
    };
    
    setPhotos([photo, ...photos]);
    setNewPhoto({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      tags: ''
    });
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowUploadForm(false);
  };

  const filteredPhotos = photos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground tracking-wide">相册</h1>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
        >
          <Plus className="w-5 h-5" />
          上传照片
        </button>
      </div>

      {/* 上传照片表单 */}
      {showUploadForm && (
        <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">上传新照片</h2>
            <button
              onClick={() => {
                setShowUploadForm(false);
                setPreviewImage(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="p-2 hover:bg-accent rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
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
                placeholder="给这张照片起个名字..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">日期</label>
                <input
                  type="date"
                  value={newPhoto.date}
                  onChange={(e) => setNewPhoto({ ...newPhoto, date: e.target.value })}
                  className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">地点</label>
                <input
                  type="text"
                  value={newPhoto.location}
                  onChange={(e) => setNewPhoto({ ...newPhoto, location: e.target.value })}
                  placeholder="拍照的地点"
                  className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">标签 (用逗号分隔)</label>
              <input
                type="text"
                value={newPhoto.tags}
                onChange={(e) => setNewPhoto({ ...newPhoto, tags: e.target.value })}
                placeholder="例如: 游玩, 快乐"
                className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
              />
            </div>
            <button
              onClick={handleUploadPhoto}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
            >
              <Upload className="w-5 h-5" />
              上传照片
            </button>
          </div>
        </div>
      )}

      {/* 搜索 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索照片标题、描述或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl pl-12 pr-4 py-3 text-lg transition-all"
          />
        </div>
      </div>

      {/* 照片统计 */}
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Grid3x3 className="w-6 h-6 text-primary" />
            <span className="text-lg text-muted-foreground">共</span>
            <span className="text-3xl font-bold text-primary">{photos.length}</span>
            <span className="text-lg text-muted-foreground">张照片</span>
          </div>
        </div>
      </div>

      {/* 照片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <Link
            key={photo.id}
            to={`/gallery/${photo.id}`}
            className="block bg-card border-2 border-border rounded-3xl overflow-hidden shadow hover:-translate-y-2 hover:shadow-lg hover:rotate-1 transition-all duration-300"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={photo.thumbnailUrl}
                alt={photo.title}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-foreground mb-2">{photo.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {photo.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{photo.date}</span>
                {photo.location && (
                  <span className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs">
                    {photo.location}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground">暂无照片</p>
        </div>
      )}
    </div>
  );
}
