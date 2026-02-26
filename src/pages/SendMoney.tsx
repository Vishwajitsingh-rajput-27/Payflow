import { useState } from 'react';
import { useStore } from '../store';
import { Search, Send, ArrowLeft, CheckCircle, AlertCircle, User } from 'lucide-react';
import type { User as UserType } from '../types';

interface SendMoneyProps {
  onNavigate: (page: string) => void;
}

export default function SendMoney({ onNavigate }: SendMoneyProps) {
  const { searchUsers, sendMoney, getWallet } = useStore();
  const [step, setStep] = useState<'search' | 'amount' | 'pin' | 'result'>('search');
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [pin, setPin] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const wallet = getWallet();
  const searchResults = query.trim() ? searchUsers(query) : [];

  const handleSelectUser = (user: UserType) => {
    setSelectedUser(user);
    setStep('amount');
  };

  const handleAmountNext = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    if (wallet && amt > wallet.balance) return;
    setStep('pin');
  };

  const handleSend = () => {
    if (pin.length !== 4 || !selectedUser) return;
    setLoading(true);
    setTimeout(() => {
      const res = sendMoney(selectedUser.id, parseFloat(amount), note, pin);
      setResult(res);
      setStep('result');
      setLoading(false);
    }, 800);
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            if (step === 'search') onNavigate('dashboard');
            else if (step === 'amount') setStep('search');
            else if (step === 'pin') setStep('amount');
            else onNavigate('dashboard');
          }}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Send Money</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6">
        {['Recipient', 'Amount', 'Confirm'].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= ['search', 'amount', 'pin', 'result'].indexOf(step) ? 'bg-primary-500' : 'bg-gray-200'
            }`} />
          </div>
        ))}
      </div>

      {/* Step: Search */}
      {step === 'search' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, username, email or phone"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-base"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            {searchResults.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className="w-full flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all text-left active:scale-[0.98]"
              >
                <div className="w-11 h-11 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold shrink-0">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>
                  <p className="text-sm text-gray-500 truncate">@{user.username} • {user.phone}</p>
                </div>
                <Send className="w-4 h-4 text-gray-400" />
              </button>
            ))}
            {query.trim() && searchResults.length === 0 && (
              <div className="text-center py-8">
                <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No users found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step: Amount */}
      {step === 'amount' && selectedUser && (
        <div className="space-y-6">
          <div className="text-center bg-white rounded-2xl p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-2xl mx-auto">
              {selectedUser.fullName.charAt(0)}
            </div>
            <p className="font-semibold text-gray-900 mt-3">{selectedUser.fullName}</p>
            <p className="text-sm text-gray-500">@{selectedUser.username}</p>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-500 mb-2 text-center">Enter Amount</label>
            <div className="flex items-center justify-center gap-1">
              <span className="text-3xl font-bold text-gray-400">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="text-4xl font-bold text-gray-900 text-center bg-transparent w-40 focus:outline-none"
                inputMode="decimal"
                autoFocus
              />
            </div>
            <p className="text-center text-sm text-gray-400 mt-2">
              Balance: ${wallet?.balance?.toFixed(2) || '0.00'}
            </p>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="py-2.5 bg-gray-50 hover:bg-primary-50 rounded-xl text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-base"
            />
          </div>

          <button
            onClick={handleAmountNext}
            disabled={!amount || parseFloat(amount) <= 0 || (wallet && parseFloat(amount) > wallet.balance)}
            className="w-full py-4 gradient-primary text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none transition-all text-base active:scale-[0.98]"
          >
            Continue
          </button>

          {wallet && parseFloat(amount) > wallet.balance && (
            <p className="text-center text-sm text-red-500 flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4" /> Insufficient balance
            </p>
          )}
        </div>
      )}

      {/* Step: PIN */}
      {step === 'pin' && (
        <div className="space-y-6">
          <div className="text-center bg-white rounded-2xl p-6">
            <p className="text-sm text-gray-500">Sending to</p>
            <p className="font-semibold text-gray-900">{selectedUser?.fullName}</p>
            <p className="text-3xl font-bold text-primary-600 mt-2">${parseFloat(amount).toFixed(2)}</p>
            {note && <p className="text-sm text-gray-500 mt-1">"{note}"</p>}
          </div>

          <div className="bg-white rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter Transaction PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              inputMode="numeric"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl tracking-[1em] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              autoFocus
            />
          </div>

          <button
            onClick={handleSend}
            disabled={pin.length !== 4 || loading}
            className="w-full py-4 gradient-primary text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-base active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Confirm & Send
              </>
            )}
          </button>
        </div>
      )}

      {/* Step: Result */}
      {step === 'result' && result && (
        <div className="text-center space-y-6 py-8">
          {result.success ? (
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          ) : (
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {result.success ? 'Payment Sent!' : 'Payment Failed'}
            </h2>
            <p className="text-gray-500 mt-2">{result.message}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-3.5 gradient-primary text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
            >
              Back to Home
            </button>
            {result.success && (
              <button
                onClick={() => {
                  setStep('search');
                  setQuery('');
                  setSelectedUser(null);
                  setAmount('');
                  setNote('');
                  setPin('');
                  setResult(null);
                }}
                className="w-full py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                Send More
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
