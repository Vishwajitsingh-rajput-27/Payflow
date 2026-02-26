import { useStore } from '../store';
import {
  Users, Activity, DollarSign, TrendingUp, ShieldCheck, AlertTriangle,
  ArrowUpRight, ArrowDownRight, BarChart3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { users, transactions, wallets, paymentRequests, activityLogs } = useStore();

  const totalUsers = users.filter((u) => u.role === 'user').length;
  void users.filter((u) => u.role === 'user' && !u.isBlocked).length;
  const blockedUsers = users.filter((u) => u.isBlocked).length;
  const verifiedUsers = users.filter((u) => u.kycStatus === 'verified' && u.role === 'user').length;
  const totalTransactions = transactions.length;
  const successfulTxns = transactions.filter((t) => t.status === 'success').length;
  const failedTxns = transactions.filter((t) => t.status === 'failed').length;
  const totalVolume = transactions.filter((t) => t.status === 'success').reduce((s, t) => s + t.amount, 0);
  const totalWalletBalance = wallets.reduce((s, w) => s + w.balance, 0);
  const pendingRequests = paymentRequests.filter((r) => r.status === 'pending').length;

  // Monthly transaction data
  const monthlyData = (() => {
    const months: Record<string, { name: string; sent: number; received: number; total: number }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monthNames.forEach((m) => {
      months[m] = { name: m, sent: 0, received: 0, total: 0 };
    });
    transactions.forEach((t) => {
      const m = monthNames[new Date(t.createdAt).getMonth()];
      if (t.status === 'success') {
        months[m].total += t.amount;
        if (t.type === 'send') {
          months[m].sent += t.amount;
          months[m].received += t.amount;
        } else if (t.type === 'add_money') {
          months[m].received += t.amount;
        }
      }
    });
    return Object.values(months).filter((m) => m.total > 0);
  })();

  const txnTypeData = [
    { name: 'Sent', value: transactions.filter((t) => t.type === 'send').length, color: '#6366f1' },
    { name: 'Add Money', value: transactions.filter((t) => t.type === 'add_money').length, color: '#10b981' },
    { name: 'Request', value: transactions.filter((t) => t.type === 'request_fulfilled').length, color: '#f59e0b' },
  ].filter((d) => d.value > 0);

  void [
    { name: 'Success', value: successfulTxns, color: '#10b981' },
    { name: 'Failed', value: failedTxns, color: '#ef4444' },
    { name: 'Pending', value: transactions.filter((t) => t.status === 'pending').length, color: '#f59e0b' },
  ].filter((d) => d.value > 0);

  const recentTxns = transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getUserName = (id: string) => {
    if (id === 'SYSTEM') return 'System';
    return users.find((u) => u.id === id)?.fullName || 'Unknown';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">System overview & analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Users', value: totalUsers, icon: Users, color: 'bg-blue-500', sub: `${blockedUsers} blocked` },
          { label: 'Transactions', value: totalTransactions, icon: Activity, color: 'bg-green-500', sub: `${successfulTxns} success` },
          { label: 'Total Volume', value: `$${totalVolume.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500', sub: 'All time' },
          { label: 'Wallet Balance', value: `$${totalWalletBalance.toLocaleString()}`, icon: TrendingUp, color: 'bg-orange-500', sub: 'System total' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Verified KYC', value: verifiedUsers, icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending Requests', value: pendingRequests, icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Activity Logs', value: activityLogs.length, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-3 sm:p-4 text-center`}>
            <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Transaction Volume Chart */}
        <div className="bg-white rounded-2xl p-4 sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Transaction Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                  formatter={(value: unknown) => [`$${Number(value).toLocaleString()}`, '']}
                />
                <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Types */}
        <div className="bg-white rounded-2xl p-4 sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Transaction Types</h3>
          <div className="h-64 flex items-center justify-center">
            {txnTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={txnTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={false}
                  >
                    {txnTypeData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm">No data</p>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Status Chart */}
      <div className="bg-white rounded-2xl p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Transaction Flow Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                formatter={(value: unknown) => [`$${Number(value).toLocaleString()}`, '']}
              />
              <Legend />
              <Line type="monotone" dataKey="sent" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="received" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
          <button
            onClick={() => onNavigate('admin-transactions')}
            className="text-sm text-primary-600 font-medium hover:underline"
          >
            View All
          </button>
        </div>
        <div className="space-y-2">
          {recentTxns.map((txn) => (
            <div key={txn.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                txn.type === 'add_money' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {txn.type === 'add_money' ? (
                  <ArrowDownRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getUserName(txn.senderId)} → {getUserName(txn.receiverId)}
                </p>
                <p className="text-xs text-gray-500">{txn.note}</p>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 pb-4">
        ⚠️ Payflow Admin Panel – P2P Payment Simulation System
      </p>
    </div>
  );
}
