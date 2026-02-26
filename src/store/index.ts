import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { User, Wallet, Transaction, PaymentRequest, Notification, ActivityLog } from '../types';

// Seed data
const seedUsers: User[] = [
  {
    id: 'admin-001',
    username: 'admin',
    email: 'admin@payflow.com',
    phone: '+1234567890',
    fullName: 'System Admin',
    avatar: '',
    role: 'admin',
    password: 'admin123',
    pin: '0000',
    kycStatus: 'verified',
    kycDetails: { idType: 'Passport', idNumber: 'ADM000001', address: '100 Admin Street' },
    isBlocked: false,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'user-001',
    username: 'john_doe',
    email: 'john@example.com',
    phone: '+1987654321',
    fullName: 'John Doe',
    avatar: '',
    role: 'user',
    password: 'password123',
    pin: '1234',
    kycStatus: 'verified',
    kycDetails: { idType: 'Aadhar', idNumber: '1234-5678-9012', address: '42 Elm Street' },
    isBlocked: false,
    createdAt: new Date('2024-02-15').toISOString(),
  },
  {
    id: 'user-002',
    username: 'jane_smith',
    email: 'jane@example.com',
    phone: '+1122334455',
    fullName: 'Jane Smith',
    avatar: '',
    role: 'user',
    password: 'password123',
    pin: '5678',
    kycStatus: 'verified',
    kycDetails: { idType: 'PAN', idNumber: 'ABCDE1234F', address: '7 Oak Avenue' },
    isBlocked: false,
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: 'user-003',
    username: 'alice_w',
    email: 'alice@example.com',
    phone: '+1555666777',
    fullName: 'Alice Williams',
    avatar: '',
    role: 'user',
    password: 'password123',
    pin: '9999',
    kycStatus: 'pending',
    kycDetails: { idType: '', idNumber: '', address: '' },
    isBlocked: false,
    createdAt: new Date('2024-04-01').toISOString(),
  },
  {
    id: 'user-004',
    username: 'bob_m',
    email: 'bob@example.com',
    phone: '+1888999000',
    fullName: 'Bob Martinez',
    avatar: '',
    role: 'user',
    password: 'password123',
    pin: '4321',
    kycStatus: 'verified',
    kycDetails: { idType: 'Driver License', idNumber: 'DL-98765', address: '23 Pine Road' },
    isBlocked: false,
    createdAt: new Date('2024-04-20').toISOString(),
  },
];

const seedWallets: Wallet[] = [
  { userId: 'admin-001', balance: 100000, currency: 'USD', lastUpdated: new Date().toISOString() },
  { userId: 'user-001', balance: 5000, currency: 'USD', lastUpdated: new Date().toISOString() },
  { userId: 'user-002', balance: 3200, currency: 'USD', lastUpdated: new Date().toISOString() },
  { userId: 'user-003', balance: 750, currency: 'USD', lastUpdated: new Date().toISOString() },
  { userId: 'user-004', balance: 12500, currency: 'USD', lastUpdated: new Date().toISOString() },
];

const seedTransactions: Transaction[] = [
  { id: 'txn-001', senderId: 'user-001', receiverId: 'user-002', amount: 250, type: 'send', status: 'success', note: 'Dinner split', createdAt: new Date('2024-06-01T10:30:00').toISOString() },
  { id: 'txn-002', senderId: 'user-002', receiverId: 'user-001', amount: 100, type: 'send', status: 'success', note: 'Movie tickets', createdAt: new Date('2024-06-05T14:00:00').toISOString() },
  { id: 'txn-003', senderId: 'user-004', receiverId: 'user-001', amount: 500, type: 'send', status: 'success', note: 'Birthday gift', createdAt: new Date('2024-06-10T09:15:00').toISOString() },
  { id: 'txn-004', senderId: 'user-001', receiverId: 'user-003', amount: 75, type: 'send', status: 'success', note: 'Lunch', createdAt: new Date('2024-06-15T12:45:00').toISOString() },
  { id: 'txn-005', senderId: 'SYSTEM', receiverId: 'user-001', amount: 1000, type: 'add_money', status: 'success', note: 'Added money to wallet', createdAt: new Date('2024-06-20T08:00:00').toISOString() },
  { id: 'txn-006', senderId: 'user-003', receiverId: 'user-004', amount: 200, type: 'send', status: 'failed', note: 'Insufficient funds', createdAt: new Date('2024-06-22T16:30:00').toISOString() },
  { id: 'txn-007', senderId: 'SYSTEM', receiverId: 'user-002', amount: 2000, type: 'add_money', status: 'success', note: 'Added money to wallet', createdAt: new Date('2024-06-25T11:00:00').toISOString() },
  { id: 'txn-008', senderId: 'user-002', receiverId: 'user-003', amount: 150, type: 'send', status: 'success', note: 'Rent share', createdAt: new Date('2024-07-01T10:00:00').toISOString() },
];

const seedNotifications: Notification[] = [
  { id: 'notif-001', userId: 'user-001', title: 'Money Received', message: 'You received $100 from Jane Smith', type: 'transaction', read: false, createdAt: new Date('2024-06-05T14:00:00').toISOString() },
  { id: 'notif-002', userId: 'user-001', title: 'Welcome!', message: 'Welcome to Payflow! Start by adding money to your wallet.', type: 'system', read: true, createdAt: new Date('2024-02-15').toISOString() },
];

const seedPaymentRequests: PaymentRequest[] = [
  { id: 'req-001', requesterId: 'user-002', payerId: 'user-001', amount: 50, note: 'Coffee money', status: 'pending', createdAt: new Date('2024-07-10T09:00:00').toISOString() },
];

const seedActivityLogs: ActivityLog[] = [
  { id: 'log-001', userId: 'user-001', action: 'LOGIN', details: 'User logged in', ip: '192.168.1.1', createdAt: new Date('2024-07-10T08:00:00').toISOString() },
  { id: 'log-002', userId: 'user-002', action: 'SEND_MONEY', details: 'Sent $100 to John Doe', ip: '192.168.1.2', createdAt: new Date('2024-06-05T14:00:00').toISOString() },
  { id: 'log-003', userId: 'admin-001', action: 'LOGIN', details: 'Admin logged in', ip: '10.0.0.1', createdAt: new Date('2024-07-10T07:00:00').toISOString() },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`payflow_${key}`);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

function saveToStorage(key: string, data: unknown) {
  localStorage.setItem(`payflow_${key}`, JSON.stringify(data));
}

interface AppState {
  currentUser: User | null;
  users: User[];
  wallets: Wallet[];
  transactions: Transaction[];
  paymentRequests: PaymentRequest[];
  notifications: Notification[];
  activityLogs: ActivityLog[];

  // Auth
  login: (identifier: string, password: string) => { success: boolean; message: string };
  register: (data: { username: string; email: string; phone: string; fullName: string; password: string; pin: string }) => { success: boolean; message: string };
  logout: () => void;
  setPin: (pin: string) => void;
  verifyPin: (pin: string) => boolean;
  updateProfile: (data: Partial<User>) => void;
  updateKyc: (data: { idType: string; idNumber: string; address: string }) => void;

  // Wallet
  getWallet: (userId?: string) => Wallet | undefined;
  addMoney: (amount: number) => { success: boolean; message: string };
  sendMoney: (receiverId: string, amount: number, note: string, pin: string) => { success: boolean; message: string };

  // Payment Requests
  requestMoney: (payerId: string, amount: number, note: string) => { success: boolean; message: string };
  acceptRequest: (requestId: string, pin: string) => { success: boolean; message: string };
  rejectRequest: (requestId: string) => void;

  // Search
  searchUsers: (query: string) => User[];

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getUnreadCount: () => number;

  // Admin
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;

  // Init
  initStore: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: loadFromStorage<User | null>('currentUser', null),
  users: loadFromStorage<User[]>('users', seedUsers),
  wallets: loadFromStorage<Wallet[]>('wallets', seedWallets),
  transactions: loadFromStorage<Transaction[]>('transactions', seedTransactions),
  paymentRequests: loadFromStorage<PaymentRequest[]>('paymentRequests', seedPaymentRequests),
  notifications: loadFromStorage<Notification[]>('notifications', seedNotifications),
  activityLogs: loadFromStorage<ActivityLog[]>('activityLogs', seedActivityLogs),

  initStore: () => {
    const state = get();
    if (state.users.length === 0) {
      set({
        users: seedUsers,
        wallets: seedWallets,
        transactions: seedTransactions,
        paymentRequests: seedPaymentRequests,
        notifications: seedNotifications,
        activityLogs: seedActivityLogs,
      });
      saveToStorage('users', seedUsers);
      saveToStorage('wallets', seedWallets);
      saveToStorage('transactions', seedTransactions);
      saveToStorage('paymentRequests', seedPaymentRequests);
      saveToStorage('notifications', seedNotifications);
      saveToStorage('activityLogs', seedActivityLogs);
    }
  },

  login: (identifier, password) => {
    const { users } = get();
    const user = users.find(
      (u) => (u.username === identifier || u.email === identifier || u.phone === identifier) && u.password === password
    );
    if (!user) return { success: false, message: 'Invalid credentials' };
    if (user.isBlocked) return { success: false, message: 'Your account has been blocked. Contact support.' };
    
    set({ currentUser: user });
    saveToStorage('currentUser', user);

    const log: ActivityLog = {
      id: uuidv4(),
      userId: user.id,
      action: 'LOGIN',
      details: `${user.fullName} logged in`,
      ip: '127.0.0.1',
      createdAt: new Date().toISOString(),
    };
    const logs = [...get().activityLogs, log];
    set({ activityLogs: logs });
    saveToStorage('activityLogs', logs);

    return { success: true, message: 'Login successful' };
  },

  register: (data) => {
    const { users, wallets } = get();
    if (users.find((u) => u.username === data.username))
      return { success: false, message: 'Username already taken' };
    if (users.find((u) => u.email === data.email))
      return { success: false, message: 'Email already registered' };
    if (users.find((u) => u.phone === data.phone))
      return { success: false, message: 'Phone number already registered' };

    const newUser: User = {
      id: uuidv4(),
      username: data.username,
      email: data.email,
      phone: data.phone,
      fullName: data.fullName,
      avatar: '',
      role: 'user',
      password: data.password,
      pin: data.pin,
      kycStatus: 'pending',
      kycDetails: { idType: '', idNumber: '', address: '' },
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };
    const newWallet: Wallet = {
      userId: newUser.id,
      balance: 0,
      currency: 'USD',
      lastUpdated: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    const updatedWallets = [...wallets, newWallet];
    set({ users: updatedUsers, wallets: updatedWallets, currentUser: newUser });
    saveToStorage('users', updatedUsers);
    saveToStorage('wallets', updatedWallets);
    saveToStorage('currentUser', newUser);

    // Welcome notification
    const notif: Notification = {
      id: uuidv4(),
      userId: newUser.id,
      title: 'Welcome to Payflow! 🎉',
      message: 'Your account is ready. Start by adding money to your wallet.',
      type: 'system',
      read: false,
      createdAt: new Date().toISOString(),
    };
    const notifs = [...get().notifications, notif];
    set({ notifications: notifs });
    saveToStorage('notifications', notifs);

    return { success: true, message: 'Registration successful' };
  },

  logout: () => {
    set({ currentUser: null });
    localStorage.removeItem('payflow_currentUser');
  },

  setPin: (pin) => {
    const { currentUser, users } = get();
    if (!currentUser) return;
    const updated = users.map((u) => (u.id === currentUser.id ? { ...u, pin } : u));
    const updatedUser = { ...currentUser, pin };
    set({ users: updated, currentUser: updatedUser });
    saveToStorage('users', updated);
    saveToStorage('currentUser', updatedUser);
  },

  verifyPin: (pin) => {
    const { currentUser } = get();
    return currentUser?.pin === pin;
  },

  updateProfile: (data) => {
    const { currentUser, users } = get();
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    const updated = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    set({ users: updated, currentUser: updatedUser });
    saveToStorage('users', updated);
    saveToStorage('currentUser', updatedUser);
  },

  updateKyc: (data) => {
    const { currentUser, users } = get();
    if (!currentUser) return;
    const updatedUser = { ...currentUser, kycDetails: data, kycStatus: 'verified' as const };
    const updated = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    set({ users: updated, currentUser: updatedUser });
    saveToStorage('users', updated);
    saveToStorage('currentUser', updatedUser);
  },

  getWallet: (userId) => {
    const { currentUser, wallets } = get();
    const id = userId || currentUser?.id;
    return wallets.find((w) => w.userId === id);
  },

  addMoney: (amount) => {
    const { currentUser, wallets, transactions, notifications } = get();
    if (!currentUser) return { success: false, message: 'Not authenticated' };
    if (amount <= 0) return { success: false, message: 'Amount must be positive' };
    if (amount > 50000) return { success: false, message: 'Maximum add limit is $50,000' };

    const txn: Transaction = {
      id: uuidv4(),
      senderId: 'SYSTEM',
      receiverId: currentUser.id,
      amount,
      type: 'add_money',
      status: 'success',
      note: 'Added money to wallet',
      createdAt: new Date().toISOString(),
    };

    const updatedWallets = wallets.map((w) =>
      w.userId === currentUser.id
        ? { ...w, balance: w.balance + amount, lastUpdated: new Date().toISOString() }
        : w
    );
    const updatedTxns = [...transactions, txn];
    const notif: Notification = {
      id: uuidv4(),
      userId: currentUser.id,
      title: 'Money Added 💰',
      message: `$${amount.toFixed(2)} has been added to your wallet`,
      type: 'transaction',
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updatedNotifs = [...notifications, notif];

    set({ wallets: updatedWallets, transactions: updatedTxns, notifications: updatedNotifs });
    saveToStorage('wallets', updatedWallets);
    saveToStorage('transactions', updatedTxns);
    saveToStorage('notifications', updatedNotifs);

    return { success: true, message: `$${amount.toFixed(2)} added to wallet` };
  },

  sendMoney: (receiverId, amount, note, pin) => {
    const { currentUser, wallets, transactions, notifications, users, activityLogs } = get();
    if (!currentUser) return { success: false, message: 'Not authenticated' };
    if (!get().verifyPin(pin)) return { success: false, message: 'Incorrect PIN' };
    if (amount <= 0) return { success: false, message: 'Amount must be positive' };
    if (receiverId === currentUser.id) return { success: false, message: 'Cannot send money to yourself' };

    const senderWallet = wallets.find((w) => w.userId === currentUser.id);
    if (!senderWallet || senderWallet.balance < amount)
      return { success: false, message: 'Insufficient balance' };

    const receiver = users.find((u) => u.id === receiverId);
    if (!receiver) return { success: false, message: 'Recipient not found' };
    if (receiver.isBlocked) return { success: false, message: 'Recipient account is blocked' };

    const txn: Transaction = {
      id: uuidv4(),
      senderId: currentUser.id,
      receiverId,
      amount,
      type: 'send',
      status: 'success',
      note: note || 'Payment',
      createdAt: new Date().toISOString(),
    };

    const updatedWallets = wallets.map((w) => {
      if (w.userId === currentUser.id)
        return { ...w, balance: w.balance - amount, lastUpdated: new Date().toISOString() };
      if (w.userId === receiverId)
        return { ...w, balance: w.balance + amount, lastUpdated: new Date().toISOString() };
      return w;
    });

    const senderNotif: Notification = {
      id: uuidv4(),
      userId: currentUser.id,
      title: 'Money Sent 💸',
      message: `$${amount.toFixed(2)} sent to ${receiver.fullName}`,
      type: 'transaction',
      read: false,
      createdAt: new Date().toISOString(),
    };
    const receiverNotif: Notification = {
      id: uuidv4(),
      userId: receiverId,
      title: 'Money Received 💰',
      message: `$${amount.toFixed(2)} received from ${currentUser.fullName}`,
      type: 'transaction',
      read: false,
      createdAt: new Date().toISOString(),
    };

    const log: ActivityLog = {
      id: uuidv4(),
      userId: currentUser.id,
      action: 'SEND_MONEY',
      details: `Sent $${amount.toFixed(2)} to ${receiver.fullName}`,
      ip: '127.0.0.1',
      createdAt: new Date().toISOString(),
    };

    const updatedTxns = [...transactions, txn];
    const updatedNotifs = [...notifications, senderNotif, receiverNotif];
    const updatedLogs = [...activityLogs, log];

    set({
      wallets: updatedWallets,
      transactions: updatedTxns,
      notifications: updatedNotifs,
      activityLogs: updatedLogs,
    });
    saveToStorage('wallets', updatedWallets);
    saveToStorage('transactions', updatedTxns);
    saveToStorage('notifications', updatedNotifs);
    saveToStorage('activityLogs', updatedLogs);

    return { success: true, message: `$${amount.toFixed(2)} sent to ${receiver.fullName}` };
  },

  requestMoney: (payerId, amount, note) => {
    const { currentUser, paymentRequests, notifications, users } = get();
    if (!currentUser) return { success: false, message: 'Not authenticated' };
    if (amount <= 0) return { success: false, message: 'Amount must be positive' };
    if (payerId === currentUser.id) return { success: false, message: 'Cannot request money from yourself' };

    const payer = users.find((u) => u.id === payerId);
    if (!payer) return { success: false, message: 'User not found' };

    // prevent duplicate pending requests
    const existing = paymentRequests.find(
      (r) => r.requesterId === currentUser.id && r.payerId === payerId && r.status === 'pending' && r.amount === amount
    );
    if (existing) return { success: false, message: 'A similar request is already pending' };

    const req: PaymentRequest = {
      id: uuidv4(),
      requesterId: currentUser.id,
      payerId,
      amount,
      note: note || 'Payment request',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const notif: Notification = {
      id: uuidv4(),
      userId: payerId,
      title: 'Payment Request 📩',
      message: `${currentUser.fullName} is requesting $${amount.toFixed(2)}`,
      type: 'request',
      read: false,
      createdAt: new Date().toISOString(),
    };

    const updatedReqs = [...paymentRequests, req];
    const updatedNotifs = [...notifications, notif];
    set({ paymentRequests: updatedReqs, notifications: updatedNotifs });
    saveToStorage('paymentRequests', updatedReqs);
    saveToStorage('notifications', updatedNotifs);

    return { success: true, message: `Payment request sent to ${payer.fullName}` };
  },

  acceptRequest: (requestId, pin) => {
    const state = get();
    if (!state.currentUser) return { success: false, message: 'Not authenticated' };
    if (!state.verifyPin(pin)) return { success: false, message: 'Incorrect PIN' };

    const req = state.paymentRequests.find((r) => r.id === requestId);
    if (!req) return { success: false, message: 'Request not found' };
    if (req.status !== 'pending') return { success: false, message: 'Request is no longer pending' };

    const payerWallet = state.wallets.find((w) => w.userId === req.payerId);
    if (!payerWallet || payerWallet.balance < req.amount)
      return { success: false, message: 'Insufficient balance' };

    const requester = state.users.find((u) => u.id === req.requesterId);

    const txn: Transaction = {
      id: uuidv4(),
      senderId: req.payerId,
      receiverId: req.requesterId,
      amount: req.amount,
      type: 'request_fulfilled',
      status: 'success',
      note: req.note,
      createdAt: new Date().toISOString(),
    };

    const updatedWallets = state.wallets.map((w) => {
      if (w.userId === req.payerId)
        return { ...w, balance: w.balance - req.amount, lastUpdated: new Date().toISOString() };
      if (w.userId === req.requesterId)
        return { ...w, balance: w.balance + req.amount, lastUpdated: new Date().toISOString() };
      return w;
    });

    const updatedReqs = state.paymentRequests.map((r) =>
      r.id === requestId ? { ...r, status: 'accepted' as const } : r
    );

    const notif: Notification = {
      id: uuidv4(),
      userId: req.requesterId,
      title: 'Request Accepted ✅',
      message: `${state.currentUser.fullName} accepted your request for $${req.amount.toFixed(2)}`,
      type: 'request',
      read: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTxns = [...state.transactions, txn];
    const updatedNotifs = [...state.notifications, notif];

    set({
      wallets: updatedWallets,
      paymentRequests: updatedReqs,
      transactions: updatedTxns,
      notifications: updatedNotifs,
    });
    saveToStorage('wallets', updatedWallets);
    saveToStorage('paymentRequests', updatedReqs);
    saveToStorage('transactions', updatedTxns);
    saveToStorage('notifications', updatedNotifs);

    return { success: true, message: `$${req.amount.toFixed(2)} sent to ${requester?.fullName || 'user'}` };
  },

  rejectRequest: (requestId) => {
    const state = get();
    const req = state.paymentRequests.find((r) => r.id === requestId);
    if (!req) return;

    const updatedReqs = state.paymentRequests.map((r) =>
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    );

    const notif: Notification = {
      id: uuidv4(),
      userId: req.requesterId,
      title: 'Request Rejected ❌',
      message: `Your request for $${req.amount.toFixed(2)} was rejected`,
      type: 'request',
      read: false,
      createdAt: new Date().toISOString(),
    };

    const updatedNotifs = [...state.notifications, notif];
    set({ paymentRequests: updatedReqs, notifications: updatedNotifs });
    saveToStorage('paymentRequests', updatedReqs);
    saveToStorage('notifications', updatedNotifs);
  },

  searchUsers: (query) => {
    const { users, currentUser } = get();
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return users.filter(
      (u) =>
        u.id !== currentUser?.id &&
        u.role !== 'admin' &&
        !u.isBlocked &&
        (u.username.toLowerCase().includes(q) ||
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q))
    );
  },

  markNotificationRead: (id) => {
    const { notifications } = get();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    set({ notifications: updated });
    saveToStorage('notifications', updated);
  },

  markAllNotificationsRead: () => {
    const { notifications, currentUser } = get();
    if (!currentUser) return;
    const updated = notifications.map((n) =>
      n.userId === currentUser.id ? { ...n, read: true } : n
    );
    set({ notifications: updated });
    saveToStorage('notifications', updated);
  },

  getUnreadCount: () => {
    const { notifications, currentUser } = get();
    if (!currentUser) return 0;
    return notifications.filter((n) => n.userId === currentUser.id && !n.read).length;
  },

  blockUser: (userId) => {
    const { users } = get();
    const updated = users.map((u) => (u.id === userId ? { ...u, isBlocked: true } : u));
    set({ users: updated });
    saveToStorage('users', updated);
  },

  unblockUser: (userId) => {
    const { users } = get();
    const updated = users.map((u) => (u.id === userId ? { ...u, isBlocked: false } : u));
    set({ users: updated });
    saveToStorage('users', updated);
  },
}));
