export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  fullName: string;
  avatar: string;
  role: 'user' | 'admin';
  password: string;
  pin: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  kycDetails: {
    idType: string;
    idNumber: string;
    address: string;
  };
  isBlocked: boolean;
  createdAt: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  type: 'send' | 'receive' | 'add_money' | 'request_fulfilled';
  status: 'success' | 'pending' | 'failed';
  note: string;
  createdAt: string;
}

export interface PaymentRequest {
  id: string;
  requesterId: string;
  payerId: string;
  amount: number;
  note: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'transaction' | 'request' | 'system' | 'security';
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ip: string;
  createdAt: string;
}
