import { useState, useEffect } from 'react';
import { Clock, Heart, Calendar, BookOpen, Star, Image, Flag } from 'lucide-react';

interface ITimelineEvent {
  id: string;
  type: 'meeting' | 'anniversary' | 'diary' | 'photo' | 'wish' | 'milestone' | 'custom';
  title: string;
  description?: string;
  date: string;
  icon?: string;
  relatedId?: string;
  isHighlight?: boolean;
}

interface IAnniversary {
  id: string;
  name: string;
  date: string;
  cycle: 'yearly' | 'monthly' | 'once';
  description: string;
}

// 计算从某个日期到今天的天数
function calculateDaysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export default function TimelinePage() {
  const [anniversaries, setAnniversaries] = useState<IAnniversary[]>(() => {
    const saved = localStorage.getItem('__global_friendship_anniversaries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [events, setEvents] = useState<ITimelineEvent[]>(() => {
    const saved = localStorage.getItem('__global_friendship_timeline');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        type: 'meeting',
        title: '第一次见面',
        description: '我们在咖啡馆第一次相遇,从此开启了美好的友谊',
        date: '2025-06-02',
        isHighlight: true
      },
      {
        id: '2',
        type: 'milestone',
        title: '成为最好的朋友',
        description: '正式确认彼此是最好的朋友',
        date: '2025-07-15',
        isHighlight: true
      },
      {
        id: '3',
        type: 'anniversary',
        title: '第一次旅行',
        description: '一起去了海边旅行,留下了美好的回忆',
        date: '2025-08-20',
        isHighlight: false
      },
      {
        id: '4',
        type: 'wish',
        title: '实现第一个心愿',
        description: '一起看了日出',
        date: '2026-05-28',
        isHighlight: false
      },
      {
        id: '5',
        type: 'diary',
        title: '游乐园的快乐时光',
        description: '在游乐园玩了一整天',
        date: '2026-06-01',
        isHighlight: false
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('__global_friendship_timeline', JSON.stringify(events));
  }, [events]);

  // 按日期排序
  const sortedEvents = [...events].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 获取相识纪念日并计算相识天数
  const meetingAnniversary = anniversaries.find(a => a.name === '相识纪念日');
  const daysSinceMet = meetingAnniversary ? calculateDaysSince(meetingAnniversary.date) : 0;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Heart className="w-6 h-6" />;
      case 'anniversary':
        return <Calendar className="w-6 h-6" />;
      case 'diary':
        return <BookOpen className="w-6 h-6" />;
      case 'photo':
        return <Image className="w-6 h-6" />;
      case 'wish':
        return <Star className="w-6 h-6" />;
      case 'milestone':
        return <Flag className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  // 按年份分组
  const eventsByYear: { [year: string]: ITimelineEvent[] } = {};
  sortedEvents.forEach(event => {
    const year = new Date(event.date).getFullYear().toString();
    if (!eventsByYear[year]) {
      eventsByYear[year] = [];
    }
    eventsByYear[year].push(event);
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* 页面标题 */}
      <div className="flex items-center gap-3">
        <Clock className="w-10 h-10 text-primary" />
        <h1 className="text-4xl font-bold text-foreground tracking-wide">时间轴</h1>
      </div>

      {/* 统计信息 */}
      <div className="bg-card border-2 border-border rounded-3xl p-6 shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">相识天数</div>
            <div className="text-3xl font-bold text-primary">{daysSinceMet}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">重要事件</div>
            <div className="text-3xl font-bold text-primary">{events.length}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">里程碑</div>
            <div className="text-3xl font-bold text-primary">
              {events.filter(e => e.isHighlight).length}
            </div>
          </div>
        </div>
      </div>

      {/* 时间轴 */}
      {Object.keys(eventsByYear).sort((a, b) => parseInt(a) - parseInt(b)).map(year => (
        <div key={year}>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-primary">{year}</h2>
            <div className="flex-1 h-1 bg-border rounded-full" />
          </div>

          <div className="relative pl-8 space-y-8">
            {/* 时间线 */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />

            {eventsByYear[year].map((event, index) => (
              <div key={event.id} className="relative">
                {/* 节点 */}
                <div
                  className={`absolute -left-8 top-2 w-6 h-6 rounded-full border-4 ${
                    event.isHighlight
                      ? 'bg-primary border-primary shadow-lg'
                      : 'bg-card border-border'
                  } flex items-center justify-center`}
                >
                  {event.isHighlight && (
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  )}
                </div>

                {/* 事件卡片 */}
                <div
                  className={`bg-card border-2 ${
                    event.isHighlight ? 'border-primary' : 'border-border'
                  } rounded-3xl p-6 shadow hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl ${
                        event.isHighlight
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-accent-foreground'
                      } flex items-center justify-center`}
                    >
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-2xl font-bold text-foreground">{event.title}</h3>
                        {event.isHighlight && (
                          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-bold">
                            里程碑
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">{event.date}</div>
                      {event.description && (
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground">暂无时间线事件</p>
        </div>
      )}
    </div>
  );
}
