import { useState } from 'react';
import { useStore } from '../store';
import { ArrowUpRight, ArrowDownRight, Plus, Clock, Search, Filter } from 'lucide-react';

interface TransactionHistoryProps {
  onNavigate: (page: string) => void;
}

export default function TransactionHistory({ onNavigate: _onNavigate }: TransactionHistoryProps) {
  const { currentUser, transactions, users } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'added'>('all');

  const myTransactions = transactions
    .filter((t) => t.senderId === currentUser?.id || t.receiverId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredTxns = myTransactions.filter((t) => {
    if (filter === 'sent') return t.senderId === currentUser?.id && t.type !== 'add_money';
    if (filter === 'received') return t.receiverId === currentUser?.id && t.type !== 'add_money';
    if (filter === 'added') return t.type === 'add_money';
    return true;
  }).filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const otherUser = t.senderId === currentUser?.id
      ? users.find((u) => u.id === t.receiverId)
      : users.find((u) => u.id === t.senderId);
    return (
      otherUser?.fullName.toLowerCase().includes(q) ||
      otherUser?.username.toLowerCase().includes(q) ||
      t.note.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  });

  const getUserName = (userId: string) => {
    if (userId === 'SYSTEM') return 'Payflow';
    return users.find((u) => u.id === userId)?.fullName || 'Unknown';
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  void _onNavigate;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h1>

      {/* Search */}
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

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All' },
          { id: 'sent', label: 'Sent' },
          { id: 'received', label: 'Received' },
          { id: 'added', label: 'Added' },
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
          <Filter className="w-4 h-4" />
          {filteredTxns.length}
        </div>
      </div>

      {/* Transactions */}
      {filteredTxns.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTxns.map((txn) => {
            const isSender = txn.senderId === currentUser?.id;
            const isAddMoney = txn.type === 'add_money';
            return (
              <div
                key={txn.id}
                className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl"
              >
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  isAddMoney ? 'bg-purple-100' : isSender ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {isAddMoney ? (
                    <Plus className="w-5 h-5 text-purple-600" />
                  ) : isSender ? (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {isAddMoney ? 'Added Money' : isSender ? `To ${getUserName(txn.receiverId)}` : `From ${getUserName(txn.senderId)}`}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{txn.note}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(txn.createdAt)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${
                    isSender && !isAddMoney ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {isSender && !isAddMoney ? '-' : '+'}${txn.amount.toFixed(2)}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    txn.status === 'success' ? 'bg-green-100 text-green-700' :
                    txn.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
