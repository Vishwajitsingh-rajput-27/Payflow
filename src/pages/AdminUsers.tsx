import { useState } from 'react';
import { useStore } from '../store';
import { Search, ShieldOff, ShieldCheck, User, Mail, Phone, Ban, CheckCircle } from 'lucide-react';

interface AdminUsersProps {
  onNavigate: (page: string) => void;
}

export default function AdminUsers({ onNavigate: _onNavigate }: AdminUsersProps) {
  const { users, wallets, blockUser, unblockUser } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'blocked' | 'verified'>('all');

  void _onNavigate;

  const allUsers = users.filter((u) => u.role === 'user');

  const filtered = allUsers
    .filter((u) => {
      if (filter === 'active') return !u.isBlocked;
      if (filter === 'blocked') return u.isBlocked;
      if (filter === 'verified') return u.kycStatus === 'verified';
      return true;
    })
    .filter((u) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    });

  const getBalance = (userId: string) => {
    return wallets.find((w) => w.userId === userId)?.balance ?? 0;
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All (${allUsers.length})` },
          { id: 'active', label: `Active (${allUsers.filter((u) => !u.isBlocked).length})` },
          { id: 'blocked', label: `Blocked (${allUsers.filter((u) => u.isBlocked).length})` },
          { id: 'verified', label: `Verified (${allUsers.filter((u) => u.kycStatus === 'verified').length})` },
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
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => (
            <div key={user.id} className="bg-white rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                  user.isBlocked ? 'bg-red-400' : 'bg-primary-500'
                }`}>
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{user.fullName}</p>
                    {user.isBlocked && (
                      <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                        BLOCKED
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      user.kycStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      KYC: {user.kycStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {user.phone}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">Wallet Balance</p>
                      <p className="text-sm font-bold text-gray-900">${getBalance(user.id).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Joined</p>
                      <p className="text-sm text-gray-700">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    {user.isBlocked ? (
                      <button
                        onClick={() => unblockUser(user.id)}
                        className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg flex items-center gap-1 active:scale-95 transition-transform"
                      >
                        <CheckCircle className="w-4 h-4" /> Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => blockUser(user.id)}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg flex items-center gap-1 active:scale-95 transition-transform"
                      >
                        <Ban className="w-4 h-4" /> Block
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-xs text-gray-400 mt-6 pb-4">
        {void ShieldOff}{void ShieldCheck}
        Total {allUsers.length} registered users
      </div>
    </div>
  );
}
