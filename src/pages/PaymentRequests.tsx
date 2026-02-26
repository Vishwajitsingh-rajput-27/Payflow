import { useState } from 'react';
import { useStore } from '../store';
import { ArrowLeft, Check, X, Clock, CheckCircle, XCircle } from 'lucide-react';

interface PaymentRequestsProps {
  onNavigate: (page: string) => void;
}

export default function PaymentRequests({ onNavigate }: PaymentRequestsProps) {
  const { currentUser, paymentRequests, users, acceptRequest, rejectRequest } = useStore();
  const [pinModal, setPinModal] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'received' | 'sent'>('received');

  const received = paymentRequests
    .filter((r) => r.payerId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const sent = paymentRequests
    .filter((r) => r.requesterId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getUserName = (userId: string) => users.find((u) => u.id === userId)?.fullName || 'Unknown';

  const handleAccept = (requestId: string) => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const res = acceptRequest(requestId, pin);
      setLoading(false);
      if (res.success) {
        setPinModal(null);
        setPin('');
      } else {
        setError(res.message);
      }
    }, 600);
  };

  const handleReject = (requestId: string) => {
    rejectRequest(requestId);
  };

  const statusIcon = (status: string) => {
    if (status === 'accepted') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'rejected') return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const items = tab === 'received' ? received : sent;

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-xl hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Payment Requests</h1>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('received')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'received' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'
          }`}
        >
          Received ({received.length})
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'sent' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'
          }`}
        >
          Sent ({sent.length})
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((req) => (
            <div key={req.id} className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                    {getUserName(tab === 'received' ? req.requesterId : req.payerId).charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {tab === 'received' ? getUserName(req.requesterId) : getUserName(req.payerId)}
                    </p>
                    <p className="text-xs text-gray-500">{req.note}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${req.amount.toFixed(2)}</p>
                  <div className="flex items-center gap-1 justify-end">
                    {statusIcon(req.status)}
                    <span className="text-xs text-gray-500 capitalize">{req.status}</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mb-2">{formatDate(req.createdAt)}</p>
              
              {tab === 'received' && req.status === 'pending' && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => { setPinModal(req.id); setPin(''); setError(''); }}
                    className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1 active:scale-[0.98]"
                  >
                    <Check className="w-4 h-4" /> Accept
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1 active:scale-[0.98]"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PIN Modal */}
      {pinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 text-center mb-4">Enter PIN to Pay</h3>
            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              inputMode="numeric"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl tracking-[1em] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setPinModal(null); setPin(''); }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAccept(pinModal)}
                disabled={pin.length !== 4 || loading}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
