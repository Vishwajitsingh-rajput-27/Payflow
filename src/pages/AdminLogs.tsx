import { useState } from 'react';
import { useStore } from '../store';
import { Search, Shield, Filter, Activity } from 'lucide-react';

interface AdminLogsProps {
  onNavigate: (page: string) => void;
}

export default function AdminLogs({ onNavigate: _onNavigate }: AdminLogsProps) {
  const { activityLogs, users } = useStore();
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  void _onNavigate;

  const sorted = [...activityLogs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const actions = ['all', ...new Set(activityLogs.map((l) => l.action))];

  const filtered = sorted
    .filter((l) => actionFilter === 'all' || l.action === actionFilter)
    .filter((l) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const user = users.find((u) => u.id === l.userId);
      return (
        user?.fullName.toLowerCase().includes(q) ||
        user?.username.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    });

  const getUserName = (id: string) => users.find((u) => u.id === id)?.fullName || 'Unknown';

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });

  const actionColor = (action: string) => {
    if (action === 'LOGIN') return 'bg-blue-100 text-blue-700';
    if (action === 'SEND_MONEY') return 'bg-green-100 text-green-700';
    if (action === 'BLOCK_USER') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Shield className="w-6 h-6 text-primary-500" />
        Activity Logs
      </h1>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search logs..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {actions.map((a) => (
          <button
            key={a}
            onClick={() => setActionFilter(a)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              actionFilter === a
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {a === 'all' ? 'All' : a.replace('_', ' ')}
          </button>
        ))}
        <div className="flex items-center gap-1 px-3 text-sm text-gray-400">
          <Filter className="w-4 h-4" /> {filtered.length}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No logs found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log) => (
            <div key={log.id} className="bg-white rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{getUserName(log.userId)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${actionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
                    <span>{formatDate(log.createdAt)}</span>
                    <span>IP: {log.ip}</span>
                    <span className="font-mono">{log.id.slice(0, 8)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
