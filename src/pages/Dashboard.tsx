import { useStore } from '../store';
import { Wallet, Send, ArrowDownLeft, Plus, QrCode, TrendingUp, TrendingDown, Clock, ArrowUpRight, ArrowDownRight, Github } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { currentUser, getWallet, transactions, users, paymentRequests } = useStore();
  const wallet = getWallet();

  const myTransactions = transactions
    .filter((t) => t.senderId === currentUser?.id || t.receiverId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const pendingRequests = paymentRequests.filter(
    (r) => r.payerId === currentUser?.id && r.status === 'pending'
  );

  const totalSent = transactions
    .filter((t) => t.senderId === currentUser?.id && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceived = transactions
    .filter((t) => t.receiverId === currentUser?.id && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const getUserName = (userId: string) => {
    if (userId === 'SYSTEM') return 'Payflow';
    return users.find((u) => u.id === userId)?.fullName || 'Unknown';
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
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Hello, {currentUser?.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's your financial overview</p>
      </div>

      {/* Wallet Card */}
      <div className="gradient-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-5 h-5 text-white/70" />
            <span className="text-white/70 text-sm font-medium">Total Balance</span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold mt-1">
            ${wallet?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
          <p className="text-white/50 text-xs mt-1">USD • Virtual Wallet</p>

          <div className="flex gap-3 mt-6">
            <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-green-300" />
              <span className="text-xs">+${totalReceived.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-red-300" />
              <span className="text-xs">-${totalSent.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { id: 'send', icon: Send, label: 'Send', color: 'bg-blue-500' },
          { id: 'request', icon: ArrowDownLeft, label: 'Request', color: 'bg-green-500' },
          { id: 'add-money', icon: Plus, label: 'Add', color: 'bg-purple-500' },
          { id: 'qr', icon: QrCode, label: 'QR', color: 'bg-orange-500' },
        ].map((action) => (
          <button
            key={action.id}
            onClick={() => onNavigate(action.id)}
            className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <div className={`${action.color} w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center`}>
              <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-amber-800 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending Requests ({pendingRequests.length})
            </h3>
            <button
              onClick={() => onNavigate('payment-requests')}
              className="text-xs text-amber-700 font-medium hover:underline"
            >
              View All
            </button>
          </div>
          {pendingRequests.slice(0, 2).map((req) => (
            <div key={req.id} className="flex items-center justify-between py-2 border-t border-amber-200">
              <div>
                <p className="text-sm font-medium text-gray-900">{getUserName(req.requesterId)}</p>
                <p className="text-xs text-gray-500">{req.note}</p>
              </div>
              <span className="font-semibold text-amber-700">${req.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
          <button
            onClick={() => onNavigate('history')}
            className="text-sm text-primary-600 font-medium hover:underline"
          >
            See All
          </button>
        </div>

        {myTransactions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No transactions yet</p>
            <p className="text-gray-400 text-sm">Start by adding money to your wallet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myTransactions.map((txn) => {
              const isSender = txn.senderId === currentUser?.id;
              const isAddMoney = txn.type === 'add_money';
              return (
                <div
                  key={txn.id}
                  className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl hover:shadow-sm transition-all"
                >
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isAddMoney ? 'bg-green-100' : isSender ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {isAddMoney ? (
                      <Plus className="w-5 h-5 text-green-600" />
                    ) : isSender ? (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {isAddMoney
                        ? 'Added Money'
                        : isSender
                        ? `To ${getUserName(txn.receiverId)}`
                        : `From ${getUserName(txn.senderId)}`}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{txn.note}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${
                      isSender && !isAddMoney ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {isSender && !isAddMoney ? '-' : '+'}${txn.amount.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-gray-400">{formatDate(txn.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deploy Guide Banner */}
      <div
        onClick={() => onNavigate('deploy-guide')}
        className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl cursor-pointer hover:from-gray-800 hover:to-gray-700 transition-all active:scale-95 shadow-lg"
      >
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Github className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">Deploy to GitHub Pages</p>
          <p className="text-gray-400 text-xs mt-0.5">Step-by-step Android guide →</p>
        </div>
        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold flex-shrink-0">Free</span>
      </div>

      <p className="text-center text-xs text-gray-400 pb-4">
        ⚠️ Simulation only – No real money involved
      </p>
    </div>
  );
}
