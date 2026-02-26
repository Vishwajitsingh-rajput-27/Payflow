import { useStore } from '../store';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Copy, Share2 } from 'lucide-react';
import { useState } from 'react';

interface QRCodePageProps {
  onNavigate: (page: string) => void;
}

export default function QRCodePage({ onNavigate }: QRCodePageProps) {
  const { currentUser } = useStore();
  const [copied, setCopied] = useState(false);

  const qrData = JSON.stringify({
    app: 'payflow',
    userId: currentUser?.id,
    username: currentUser?.username,
    fullName: currentUser?.fullName,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(`payflow://pay/${currentUser?.username}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-xl hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">My QR Code</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 text-center shadow-sm">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-3xl mx-auto mb-4">
          {currentUser?.fullName?.charAt(0)}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{currentUser?.fullName}</h2>
        <p className="text-gray-500 text-sm">@{currentUser?.username}</p>

        <div className="mt-6 p-6 bg-white border-2 border-gray-100 rounded-2xl inline-block">
          <QRCodeSVG
            value={qrData}
            size={200}
            level="H"
            includeMargin
            bgColor="#ffffff"
            fgColor="#4f46e5"
          />
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Show this QR code to receive payments
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            className="flex-1 py-3 gradient-primary text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Pay me on Payflow',
                  text: `Send money to @${currentUser?.username} on Payflow`,
                  url: `payflow://pay/${currentUser?.username}`,
                }).catch(() => {});
              }
            }}
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        ⚠️ Simulation only – QR scanning is for demonstration
      </p>
    </div>
  );
}
