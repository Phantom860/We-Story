import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Image as ImageIcon, Plus, Search, Grid3x3, X, Upload, FolderOpen, Camera, MapPin, Tag as TagIcon, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

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

export default function GalleryPage() {
  const [albums, setAlbums] = useState<IAlbum[]>(() => {
    const saved = localStorage.getItem('__global_friendship_albums');
    if (saved) {
      return JSON.parse(saved);
    }
    // 创建默认相册
    return [
      {
        id: '1',
        title: '美好时光',
        coverPhoto: {
          id: '1',
          url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=600&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=300&fit=crop',
          title: '游乐园',
          description: '在游乐园度过的快乐时光',
          date: '2026-06-01'
        },
        photos: [
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=600&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=300&fit=crop',
            title: '游乐园',
            description: '在游乐园度过的快乐时光',
            date: '2026-06-01'
          },
          {
            id: '2',
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            title: '海边日出',
            description: '一起看日出的美好时刻',
            date: '2026-05-28'
          },
          {
            id: '3',
            url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
            title: '咖啡时光',
            description: '咖啡馆的温馨时光',
            date: '2026-05-25'
          }
        ],
        tags: ['游玩', '日常'],
        location: '欢乐谷',
        createdAt: '2026-06-01',
        updatedAt: '2026-06-01'
      },
      {
        id: '2',
        title: '旅途记忆',
        coverPhoto: {
          id: '4',
          url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=600&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop',
          title: '樱花树下',
          description: '春天的樱花树下合影',
          date: '2026-04-10'
        },
        photos: [
          {
            id: '4',
            url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&h=600&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop',
            title: '樱花树下',
            description: '春天的樱花树下合影',
            date: '2026-04-10'
          },
          {
            id: '5',
            url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
            title: '山顶风景',
            description: '登山后的美景',
            date: '2026-03-15'
          }
        ],
        tags: ['旅行', '运动'],
        location: '香山',
        createdAt: '2026-04-10',
        updatedAt: '2026-04-10'
      },
      {
        id: '3',
        title: '美食记录',
        coverPhoto: {
          id: '6',
          url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop',
          title: '美食时刻',
          description: '一起享用美食',
          date: '2026-02-20'
        },
        photos: [
          {
            id: '6',
            url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=300&fit=crop',
            title: '美食时刻',
            description: '一起享用美食',
            date: '2026-02-20'
          }
        ],
        tags: ['聚餐', '美食'],
        location: '市中心',
        createdAt: '2026-02-20',
        updatedAt: '2026-02-20'
      }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [newAlbumTags, setNewAlbumTags] = useState<string[]>([]);
  const [newAlbumLocation, setNewAlbumLocation] = useState('');

  useEffect(() => {
    localStorage.setItem('__global_friendship_albums', JSON.stringify(albums));
  }, [albums]);

  const handleCreateAlbum = () => {
    if (!newAlbumTitle.trim()) return;

    const album: IAlbum = {
      id: Date.now().toString(),
      title: newAlbumTitle.trim(),
      photos: [],
      tags: newAlbumTags,
      location: newAlbumLocation || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setAlbums([album, ...albums]);
    setNewAlbumTitle('');
    setNewAlbumTags([]);
    setNewAlbumLocation('');
    setShowCreateAlbum(false);
  };

  // 获取所有唯一标签
  const allTags = [...new Set(albums.flatMap(album => album.tags || []))];
  
  // 获取所有唯一地点
  const allLocations = [...new Set(albums.filter(album => album.location).map(album => album.location!))];

  const filteredAlbums = albums.filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (album.photos?.some(photo => photo.title.toLowerCase().includes(searchTerm.toLowerCase())) || false);
    const matchesTag = tagFilter === 'all' || (album.tags?.includes(tagFilter) || false);
    const matchesLocation = locationFilter === 'all' || album.location === locationFilter;
    return matchesSearch && matchesTag && matchesLocation;
  });

  const totalPhotos = albums.reduce((sum, album) => sum + (album.photos?.length || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground tracking-wide">相册</h1>
        </div>
        <Dialog open={showCreateAlbum} onOpenChange={setShowCreateAlbum}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold">
              <Plus className="w-5 h-5" />
              新建相册
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">创建新相册</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">相册名称</label>
                <input
                  type="text"
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  placeholder="给相册起个名字..."
                  className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateAlbum();
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    地点
                  </span>
                </label>
                <input
                  type="text"
                  value={newAlbumLocation}
                  onChange={(e) => setNewAlbumLocation(e.target.value)}
                  placeholder="例如: 北京、上海、家里..."
                  className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
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
                        if (newAlbumTags.includes(tag)) {
                          setNewAlbumTags(newAlbumTags.filter(t => t !== tag));
                        } else {
                          setNewAlbumTags([...newAlbumTags, tag]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                        newAlbumTags.includes(tag)
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
                  className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = e.currentTarget.value.trim();
                      if (value) {
                        const customTags = value.split(',').map(t => t.trim()).filter(t => t && !newAlbumTags.includes(t));
                        setNewAlbumTags([...newAlbumTags, ...customTags]);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>
              <button
                onClick={handleCreateAlbum}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold"
              >
                <FolderOpen className="w-5 h-5" />
                创建相册
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 相册统计 */}
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-primary" />
            <span className="text-lg text-muted-foreground">共</span>
            <span className="text-3xl font-bold text-primary">{albums.length}</span>
            <span className="text-lg text-muted-foreground">本相册</span>
          </div>
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            <span className="text-lg text-muted-foreground">共</span>
            <span className="text-3xl font-bold text-primary">{totalPhotos}</span>
            <span className="text-lg text-muted-foreground">张照片</span>
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索相册名称或照片标题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl pl-12 pr-4 py-3 text-lg transition-all"
            />
          </div>
        </div>
        {/* 标签和地点筛选 */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-bold text-muted-foreground">筛选:</span>
          </div>
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-[140px] h-10 border-2 border-border shadow-sm hover:ring-2 hover:ring-primary/30 transition-all">
              <SelectValue placeholder="全部标签" />
            </SelectTrigger>
            <SelectContent className="bg-card border-2 border-border rounded-xl shadow-md">
              <SelectItem value="all" className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">全部标签</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag} className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[140px] h-10 border-2 border-border shadow-sm hover:ring-2 hover:ring-primary/30 transition-all">
              <SelectValue placeholder="全部地点" />
            </SelectTrigger>
            <SelectContent className="bg-card border-2 border-border rounded-xl shadow-md">
              <SelectItem value="all" className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">全部地点</SelectItem>
              {allLocations.map((location) => (
                <SelectItem key={location} value={location} className="text-lg px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors">{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(tagFilter !== 'all' || locationFilter !== 'all') && (
            <button
              onClick={() => {
                setTagFilter('all');
                setLocationFilter('all');
              }}
              className="px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-full transition-colors"
            >
              清除筛选
            </button>
          )}
        </div>
      </div>

      {/* 相册网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.map((album) => (
          <Link
            key={album.id}
            to={`/gallery/${album.id}`}
            className="block bg-card border-2 border-border rounded-3xl overflow-hidden shadow hover:-translate-y-2 hover:shadow-lg hover:rotate-1 transition-all duration-300"
          >
            {/* 封面 */}
            <div className="aspect-[4/3] overflow-hidden bg-muted relative">
              {album.coverPhoto ? (
                <img
                  src={album.coverPhoto.thumbnailUrl}
                  alt={album.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FolderOpen className="w-16 h-16 text-muted-foreground opacity-50" />
                </div>
              )}
              {/* 照片数量标签 */}
              <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full text-sm font-bold flex items-center gap-1">
                <Camera className="w-4 h-4" />
                {album?.photos?.length || 0}
              </div>
              {/* 地点标签 */}
              {album?.location && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {album.location}
                </div>
              )}
            </div>
            {/* 相册信息 */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-foreground mb-2">{album.title}</h3>
              {/* 标签 */}
              {album?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {album.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                  {album.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs">
                      +{album.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{album?.photos?.length || 0} 张照片</span>
                <span>•</span>
                <span>更新于 {album.updatedAt}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredAlbums.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground mb-4">
            {albums.length === 0 ? '暂无相册' : '没有找到匹配的相册'}
          </p>
          {albums.length === 0 && (
            <button
              onClick={() => setShowCreateAlbum(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold mx-auto"
            >
              <Plus className="w-5 h-5" />
              创建第一本相册
            </button>
          )}
        </div>
      )}
    </div>
  );
}
