import { useState } from 'react';
import { useStore } from '../store';
import { ArrowLeft, Plus, CheckCircle, CreditCard, Building2, Smartphone } from 'lucide-react';

interface AddMoneyProps {
  onNavigate: (page: string) => void;
}

export default function AddMoney({ onNavigate }: AddMoneyProps) {
  const { addMoney, getWallet } = useStore();
  const wallet = getWallet();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const quickAmounts = [50, 100, 250, 500, 1000, 5000];

  const handleAdd = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    setTimeout(() => {
      const res = addMoney(parseFloat(amount));
      setResult(res);
      setLoading(false);
    }, 800);
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-12 animate-fade-in">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Money Added!</h2>
          <p className="text-gray-500 mt-2">{result.message}</p>
          <p className="text-sm text-gray-400 mt-1">New balance: ${getWallet()?.balance.toFixed(2)}</p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full py-3.5 gradient-primary text-white font-semibold rounded-xl transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-xl hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Add Money</h1>
      </div>

      <div className="bg-primary-50 rounded-2xl p-4 mb-6">
        <p className="text-sm text-primary-600 font-medium">Current Balance</p>
        <p className="text-2xl font-bold text-primary-700">${wallet?.balance.toFixed(2) || '0.00'}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-4">
        <label className="block text-sm font-medium text-gray-500 mb-2 text-center">Enter Amount</label>
        <div className="flex items-center justify-center gap-1">
          <span className="text-3xl font-bold text-gray-400">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="text-4xl font-bold text-gray-900 text-center bg-transparent w-48 focus:outline-none"
            inputMode="decimal"
            autoFocus
          />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt.toString())}
              className="py-2.5 bg-gray-50 hover:bg-primary-50 rounded-xl text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              ${amt.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Payment Method (Simulated)</p>
        <div className="space-y-2">
          {[
            { id: 'card', label: 'Credit / Debit Card', sub: '•••• 4242', icon: CreditCard },
            { id: 'bank', label: 'Bank Transfer', sub: 'Instant transfer', icon: Building2 },
            { id: 'upi', label: 'UPI / Mobile Pay', sub: 'Quick add', icon: Smartphone },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                method === m.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'
              }`}
            >
              <m.icon className={`w-5 h-5 ${method === m.id ? 'text-primary-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium text-gray-900 text-sm">{m.label}</p>
                <p className="text-xs text-gray-500">{m.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={!amount || parseFloat(amount) <= 0 || loading}
        className="w-full py-4 gradient-primary text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-base active:scale-[0.98]"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Add ${amount || '0.00'}
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 mt-4">
        ⚠️ This is simulated – No real money will be charged
      </p>
    </div>
  );
}
