import { Link } from 'react-router';
import { Home, Heart } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Heart className="w-16 h-16 text-primary fill-primary opacity-50" />
          <div className="text-9xl font-bold text-primary">404</div>
          <Heart className="w-16 h-16 text-primary fill-primary opacity-50" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">迷路啦~</h1>
        <p className="text-lg text-muted-foreground mb-8">
          这个页面好像不存在呢,让我们一起回到首页吧!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground border-2 border-primary/30 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all rounded-2xl font-bold text-lg"
        >
          <Home className="w-6 h-6" />
          回到首页
        </Link>
      </div>
    </div>
  );
}
