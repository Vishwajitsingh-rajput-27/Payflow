import { useState } from 'react';
import { useStore } from '../store';
import {
  Home, Send, ArrowDownLeft, Clock, User, Bell, LogOut, Menu, X,
  Shield, Users, Activity, BarChart3, ChevronRight, Wallet, QrCode, Settings, Github
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { currentUser, logout, getUnreadCount } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = getUnreadCount();
  const isAdmin = currentUser?.role === 'admin';

  const userNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'send', label: 'Send', icon: Send },
    { id: 'request', label: 'Request', icon: ArrowDownLeft },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'admin-users', label: 'Users', icon: Users },
    { id: 'admin-transactions', label: 'Transactions', icon: Activity },
    { id: 'admin-logs', label: 'Logs', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const sidebarItems = isAdmin
    ? [
        { id: 'admin-dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'admin-users', label: 'Manage Users', icon: Users },
        { id: 'admin-transactions', label: 'All Transactions', icon: Activity },
        { id: 'admin-logs', label: 'Activity Logs', icon: Shield },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'deploy-guide', label: '🚀 Deploy to GitHub', icon: Github },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'send', label: 'Send Money', icon: Send },
        { id: 'request', label: 'Request Money', icon: ArrowDownLeft },
        { id: 'add-money', label: 'Add Money', icon: Wallet },
        { id: 'qr', label: 'QR Code', icon: QrCode },
        { id: 'history', label: 'Transaction History', icon: Clock },
        { id: 'payment-requests', label: 'Payment Requests', icon: ArrowDownLeft },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'deploy-guide', label: '🚀 Deploy to GitHub', icon: Github },
      ];

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-30">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Payflow</h1>
              <p className="text-xs text-gray-500">P2P Payment Simulation</p>
            </div>
          </div>
        </div>

        <div className="p-4 mx-4 mt-4 bg-primary-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {currentUser?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{currentUser?.fullName}</p>
              <p className="text-xs text-gray-500">@{currentUser?.username}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentPage === item.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
              {item.id === 'notifications' && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              {item.id === 'payment-requests' && (
                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 h-full bg-white flex flex-col animate-slide-up" style={{ animation: 'slideUp 0.2s ease-out' }}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-bold text-gray-900">Payflow</h1>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-6">
        {/* Top Bar */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 z-20">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">Payflow</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('notifications')}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <div
                onClick={() => onNavigate('profile')}
                className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:bg-primary-600 transition-colors"
              >
                {currentUser?.fullName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-30 safe-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl min-w-[60px] transition-all ${
                currentPage === item.id ? 'text-primary-500' : 'text-gray-400'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentPage === item.id ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
