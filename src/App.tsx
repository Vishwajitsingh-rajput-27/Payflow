import { useState, useEffect } from 'react';
import { useStore } from './store';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import RequestMoney from './pages/RequestMoney';
import AddMoney from './pages/AddMoney';
import TransactionHistory from './pages/TransactionHistory';
import PaymentRequests from './pages/PaymentRequests';
import QRCodePage from './pages/QRCode';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminTransactions from './pages/AdminTransactions';
import AdminLogs from './pages/AdminLogs';
import DeployGuide from './pages/DeployGuide';

export function App() {
  const { currentUser, initStore } = useStore();
  const [page, setPage] = useState(() => {
    if (!currentUser) return 'login';
    return currentUser.role === 'admin' ? 'admin-dashboard' : 'dashboard';
  });

  useEffect(() => {
    initStore();
  }, [initStore]);

  useEffect(() => {
    if (!currentUser && page !== 'login' && page !== 'register') {
      setPage('login');
    }
  }, [currentUser, page]);

  // Auth pages
  if (page === 'login' || (!currentUser && page !== 'register')) {
    return <Login onNavigate={setPage} />;
  }

  if (page === 'register') {
    return <Register onNavigate={setPage} />;
  }

  if (!currentUser) {
    return <Login onNavigate={setPage} />;
  }

  // Protected pages
  const renderPage = () => {
    // Admin pages
    if (currentUser.role === 'admin') {
      switch (page) {
        case 'admin-dashboard':
          return <AdminDashboard onNavigate={setPage} />;
        case 'admin-users':
          return <AdminUsers onNavigate={setPage} />;
        case 'admin-transactions':
          return <AdminTransactions onNavigate={setPage} />;
        case 'admin-logs':
          return <AdminLogs onNavigate={setPage} />;
        case 'profile':
          return <Profile onNavigate={setPage} />;
        case 'deploy-guide':
          return <DeployGuide onNavigate={setPage} />;
        default:
          return <AdminDashboard onNavigate={setPage} />;
      }
    }

    // User pages
    switch (page) {
      case 'dashboard':
        return <Dashboard onNavigate={setPage} />;
      case 'send':
        return <SendMoney onNavigate={setPage} />;
      case 'request':
        return <RequestMoney onNavigate={setPage} />;
      case 'add-money':
        return <AddMoney onNavigate={setPage} />;
      case 'history':
        return <TransactionHistory onNavigate={setPage} />;
      case 'payment-requests':
        return <PaymentRequests onNavigate={setPage} />;
      case 'qr':
        return <QRCodePage onNavigate={setPage} />;
      case 'notifications':
        return <Notifications onNavigate={setPage} />;
      case 'profile':
        return <Profile onNavigate={setPage} />;
      case 'settings':
        return <Profile onNavigate={setPage} />;
      case 'deploy-guide':
        return <DeployGuide onNavigate={setPage} />;
      default:
        return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {renderPage()}
    </Layout>
  );
}
