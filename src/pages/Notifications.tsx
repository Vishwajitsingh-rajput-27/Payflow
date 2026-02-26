import { useStore } from '../store';
import { ArrowLeft, Bell, CheckCheck, DollarSign, Shield, ArrowDownLeft } from 'lucide-react';

interface NotificationsProps {
  onNavigate: (page: string) => void;
}

export default function Notifications({ onNavigate }: NotificationsProps) {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useStore();

  const myNotifs = notifications
    .filter((n) => n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unread = myNotifs.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction': return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'request': return <ArrowDownLeft className="w-5 h-5 text-blue-600" />;
      case 'security': return <Shield className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5 text-primary-600" />;
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-xl hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          {unread > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-medium">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-sm text-primary-600 font-medium flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {myNotifs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myNotifs.map((notif) => (
            <button
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left ${
                notif.read ? 'bg-white' : 'bg-primary-50 border border-primary-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                notif.read ? 'bg-gray-100' : 'bg-white'
              }`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                  {notif.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">{formatDate(notif.createdAt)}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-2" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
