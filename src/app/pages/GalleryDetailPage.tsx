import { useParams, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Tag, Download, ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function GalleryDetailPage() {
  const { id } = useParams();
  const [photo, setPhoto] = useState<IPhoto | null>(null);
  const [allPhotos, setAllPhotos] = useState<IPhoto[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('__global_friendship_photos');
    if (saved) {
      const photos: IPhoto[] = JSON.parse(saved);
      setAllPhotos(photos);
      const found = photos.find(p => p.id === id);
      setPhoto(found || null);
    }
  }, [id]);

  if (!photo) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">照片不存在</p>
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

  const currentIndex = allPhotos.findIndex(p => p.id === id);
  const prevPhoto = currentIndex > 0 ? allPhotos[currentIndex - 1] : null;
  const nextPhoto = currentIndex < allPhotos.length - 1 ? allPhotos[currentIndex + 1] : null;

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

      {/* 大图预览 */}
      <div className="bg-card border-2 border-border rounded-3xl overflow-hidden shadow-lg">
        <div className="relative aspect-[16/10] bg-muted">
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-full object-contain"
          />

          {/* 导航按钮 */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4">
            {prevPhoto ? (
              <Link
                to={`/gallery/${prevPhoto.id}`}
                className="p-3 bg-card/90 backdrop-blur-sm border-2 border-border rounded-full shadow hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </Link>
            ) : (
              <div className="w-12" />
            )}
            {nextPhoto ? (
              <Link
                to={`/gallery/${nextPhoto.id}`}
                className="p-3 bg-card/90 backdrop-blur-sm border-2 border-border rounded-full shadow hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </Link>
            ) : (
              <div className="w-12" />
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{photo.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {photo.description}
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground border-2 border-border rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
              <Download className="w-5 h-5" />
              <span className="font-bold">下载</span>
            </button>
          </div>

          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{photo.date}</span>
            </div>
            {photo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{photo.location}</span>
              </div>
            )}
          </div>

          {photo.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-4 border-t-2 border-dashed border-muted">
              <Tag className="w-5 h-5 text-muted-foreground" />
              {photo.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 评论区 */}
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow">
        <h2 className="text-2xl font-bold text-foreground mb-4">留言</h2>
        <textarea
          placeholder="添加你对这张照片的想法..."
          className="w-full bg-card border-2 border-border shadow-sm focus:ring-4 focus:ring-primary/30 focus:border-primary rounded-xl px-4 py-3 text-lg transition-all min-h-[120px] resize-y"
        />
        <button className="mt-3 px-6 py-3 bg-primary text-primary-foreground border-2 border-primary/30 shadow hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold">
          添加留言
        </button>
      </div>
    </div>
  );
}
