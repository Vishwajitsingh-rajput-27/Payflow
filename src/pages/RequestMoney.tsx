import { useState } from 'react';
import { useStore } from '../store';
import { Search, ArrowDownLeft, ArrowLeft, CheckCircle, AlertCircle, User } from 'lucide-react';
import type { User as UserType } from '../types';

interface RequestMoneyProps {
  onNavigate: (page: string) => void;
}

export default function RequestMoney({ onNavigate }: RequestMoneyProps) {
  const { searchUsers, requestMoney } = useStore();
  const [step, setStep] = useState<'search' | 'amount' | 'result'>('search');
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const searchResults = query.trim() ? searchUsers(query) : [];

  const handleRequest = () => {
    if (!selectedUser || !amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    setTimeout(() => {
      const res = requestMoney(selectedUser.id, parseFloat(amount), note);
      setResult(res);
      setStep('result');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => {
            if (step === 'search') onNavigate('dashboard');
            else if (step === 'amount') setStep('search');
            else onNavigate('dashboard');
          }}
          className="p-2 rounded-xl hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Request Money</h1>
      </div>

      {step === 'search' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search user to request from"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-base"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            {searchResults.map((user) => (
              <button
                key={user.id}
                onClick={() => { setSelectedUser(user); setStep('amount'); }}
                className="w-full flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all text-left active:scale-[0.98]"
              >
                <div className="w-11 h-11 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold shrink-0">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>
                  <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                </div>
                <ArrowDownLeft className="w-4 h-4 text-gray-400" />
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

      {step === 'amount' && selectedUser && (
        <div className="space-y-6">
          <div className="text-center bg-white rounded-2xl p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-2xl mx-auto">
              {selectedUser.fullName.charAt(0)}
            </div>
            <p className="font-semibold text-gray-900 mt-3">{selectedUser.fullName}</p>
            <p className="text-sm text-gray-500">@{selectedUser.username}</p>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-500 mb-2 text-center">Request Amount</label>
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
          </div>

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's this for? (optional)"
            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-base"
          />

          <button
            onClick={handleRequest}
            disabled={!amount || parseFloat(amount) <= 0 || loading}
            className="w-full py-4 gradient-success text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-base active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ArrowDownLeft className="w-5 h-5" />
                Send Request
              </>
            )}
          </button>
        </div>
      )}

      {step === 'result' && result && (
        <div className="text-center space-y-6 py-8">
          {result.success ? (
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          ) : (
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {result.success ? 'Request Sent!' : 'Request Failed'}
            </h2>
            <p className="text-gray-500 mt-2">{result.message}</p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full py-3.5 gradient-primary text-white font-semibold rounded-xl transition-all"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
