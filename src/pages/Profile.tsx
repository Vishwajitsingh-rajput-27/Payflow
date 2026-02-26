import { useState } from 'react';
import { useStore } from '../store';
import {
  ArrowLeft, User, Mail, Phone, Shield, Edit3, Save, Key, CheckCircle,
  AlertTriangle, LogOut
} from 'lucide-react';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const { currentUser, updateProfile, updateKyc, setPin, logout } = useStore();
  const [editing, setEditing] = useState(false);
  const [kycEditing, setKycEditing] = useState(false);
  const [pinEditing, setPinEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });
  const [kycForm, setKycForm] = useState({
    idType: currentUser?.kycDetails?.idType || '',
    idNumber: currentUser?.kycDetails?.idNumber || '',
    address: currentUser?.kycDetails?.address || '',
  });
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  const handleSaveProfile = () => {
    updateProfile(form);
    setEditing(false);
  };

  const handleSaveKyc = () => {
    updateKyc(kycForm);
    setKycEditing(false);
  };

  const handleSavePin = () => {
    if (newPin.length !== 4) return;
    setPin(newPin);
    setPinEditing(false);
    setPinSuccess(true);
    setTimeout(() => setPinSuccess(false), 3000);
    setNewPin('');
  };

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-xl hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
      </div>

      {/* Avatar & Info */}
      <div className="bg-white rounded-2xl p-6 text-center mb-4">
        <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto">
          {currentUser?.fullName?.charAt(0)}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mt-3">{currentUser?.fullName}</h2>
        <p className="text-gray-500 text-sm">@{currentUser?.username}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            currentUser?.kycStatus === 'verified' ? 'bg-green-100 text-green-700' :
            currentUser?.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            KYC: {currentUser?.kycStatus}
          </span>
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-primary-100 text-primary-700 capitalize">
            {currentUser?.role}
          </span>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Personal Information</h3>
          <button
            onClick={() => editing ? handleSaveProfile() : setEditing(true)}
            className="text-sm text-primary-600 font-medium flex items-center gap-1"
          >
            {editing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit</>}
          </button>
        </div>

        <div className="space-y-3">
          {[
            { icon: User, label: 'Full Name', field: 'fullName' as const, value: form.fullName },
            { icon: Mail, label: 'Email', field: 'email' as const, value: form.email },
            { icon: Phone, label: 'Phone', field: 'phone' as const, value: form.phone },
          ].map((item) => (
            <div key={item.field} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">{item.label}</p>
                {editing ? (
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => setForm((prev) => ({ ...prev, [item.field]: e.target.value }))}
                    className="w-full py-1 text-sm font-medium text-gray-900 border-b border-gray-200 focus:border-primary-500 bg-transparent"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KYC */}
      <div className="bg-white rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-4 h-4" /> KYC Details
          </h3>
          <button
            onClick={() => kycEditing ? handleSaveKyc() : setKycEditing(true)}
            className="text-sm text-primary-600 font-medium flex items-center gap-1"
          >
            {kycEditing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit</>}
          </button>
        </div>

        {currentUser?.kycStatus !== 'verified' && !kycEditing && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
            <p className="text-xs text-yellow-700">Complete KYC to unlock all features</p>
          </div>
        )}

        <div className="space-y-3">
          {[
            { label: 'ID Type', field: 'idType' as const, placeholder: 'e.g., Aadhar, PAN, Passport' },
            { label: 'ID Number', field: 'idNumber' as const, placeholder: 'Enter ID number' },
            { label: 'Address', field: 'address' as const, placeholder: 'Enter address' },
          ].map((item) => (
            <div key={item.field}>
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              {kycEditing ? (
                <input
                  type="text"
                  value={kycForm[item.field]}
                  onChange={(e) => setKycForm((prev) => ({ ...prev, [item.field]: e.target.value }))}
                  placeholder={item.placeholder}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary-500"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900">
                  {kycForm[item.field] || <span className="text-gray-400 italic">Not provided</span>}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Change PIN */}
      <div className="bg-white rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Key className="w-4 h-4" /> Transaction PIN
          </h3>
        </div>
        {pinSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl mb-3">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-700">PIN updated successfully</p>
          </div>
        )}
        {pinEditing ? (
          <div className="space-y-3">
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Enter new 4-digit PIN"
              maxLength={4}
              inputMode="numeric"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center tracking-[0.5em] focus:border-primary-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setPinEditing(false); setNewPin(''); }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePin}
                disabled={newPin.length !== 4}
                className="flex-1 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                Save PIN
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setPinEditing(true)}
            className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Change Transaction PIN
          </button>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-3.5 bg-red-50 text-red-600 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mb-6"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>

      <p className="text-center text-xs text-gray-400 pb-4">
        Member since {new Date(currentUser?.createdAt || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>
    </div>
  );
}
