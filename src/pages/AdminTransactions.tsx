import { useState } from 'react';
import { useStore } from '../store';
import { Search, ArrowUpRight, ArrowDownRight, Plus, Filter, Activity } from 'lucide-react';

interface AdminTransactionsProps {
  onNavigate: (page: string) => void;
}

export default function AdminTransactions({ onNavigate: _onNavigate }: AdminTransactionsProps) {
  const { transactions, users } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'send' | 'add_money'>('all');

  void _onNavigate;

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filtered = sorted
    .filter((t) => {
      if (filter === 'success') return t.status === 'success';
      if (filter === 'failed') return t.status === 'failed';
      if (filter === 'send') return t.type === 'send';
      if (filter === 'add_money') return t.type === 'add_money';
      return true;
    })
    .filter((t) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const sender = users.find((u) => u.id === t.senderId);
      const receiver = users.find((u) => u.id === t.receiverId);
      return (
        sender?.fullName.toLowerCase().includes(q) ||
        sender?.username.toLowerCase().includes(q) ||
        receiver?.fullName.toLowerCase().includes(q) ||
        receiver?.username.toLowerCase().includes(q) ||
        t.note.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    });

  const getUserName = (id: string) => {
    if (id === 'SYSTEM') return 'System';
    return users.find((u) => u.id === id)?.fullName || 'Unknown';
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Transactions</h1>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All' },
          { id: 'success', label: 'Success' },
          { id: 'failed', label: 'Failed' },
          { id: 'send', label: 'Transfers' },
          { id: 'add_money', label: 'Add Money' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.id
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="flex items-center gap-1 px-3 text-sm text-gray-400">
          <Filter className="w-4 h-4" /> {filtered.length}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((txn) => (
            <div key={txn.id} className="bg-white rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  txn.type === 'add_money' ? 'bg-purple-100' :
                  txn.status === 'failed' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {txn.type === 'add_money' ? (
                    <Plus className="w-5 h-5 text-purple-600" />
                  ) : txn.status === 'failed' ? (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {getUserName(txn.senderId)} → {getUserName(txn.receiverId)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{txn.note}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(txn.createdAt)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">${txn.amount.toFixed(2)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    txn.status === 'success' ? 'bg-green-100 text-green-700' :
                    txn.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {txn.status}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">{txn.type.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-mono">ID: {txn.id.slice(0, 12)}...</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
