/**
 * AppContext — Central application state for PERIMO Admin.
 * Manages: identity, active workspace, active role, language, notifications, theme, toast queue.
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

// ── Identity ──────────────────────────────────────────────────────────────────
export interface AppUser {
  uid: string;
  name: string;
  displayName: string;
  initials: string;
  email: string;
  role: string;
  organization: string;
  phone: string;
  timezone: string;
  language: string;
  bio: string;
  avatarUrl?: string;
}

export const VANSH_IDENTITY: AppUser = {
  uid: 'vansh-001',
  name: 'Vansh',
  displayName: 'Vansh',
  initials: 'VG',
  email: 'vansh@perimo.ai',
  role: 'Administrator',
  organization: 'PERIMO AI',
  phone: '+91 98765 43210',
  timezone: 'Asia/Kolkata',
  language: 'en',
  bio: 'AI Stadium OS administrator. Managing smart stadium operations for the FIFA World Cup 2026.',
};

// ── Workspace ─────────────────────────────────────────────────────────────────
export interface Workspace {
  id: string;
  name: string;
  stadium: string;
  env: 'Production' | 'Staging' | 'Setup';
  region: string;
  storageUsed: number;
  storageTotal: number;
}

export const WORKSPACES: Workspace[] = [
  { id: 'w1', name: 'Santiago Bernabéu Ops', stadium: 'Santiago Bernabéu', env: 'Production', region: 'EU-West', storageUsed: 68, storageTotal: 100 },
  { id: 'w2', name: 'Camp Nou Ops', stadium: 'Camp Nou', env: 'Staging', region: 'EU-West', storageUsed: 24, storageTotal: 100 },
  { id: 'w3', name: 'Wembley Stadium Ops', stadium: 'Wembley Stadium', env: 'Setup', region: 'EU-North', storageUsed: 5, storageTotal: 100 },
];

// ── Roles ─────────────────────────────────────────────────────────────────────
export interface AppRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export const ROLES: AppRole[] = [
  { id: 'administrator', name: 'Administrator', description: 'Full system access', permissions: ['*'] },
  { id: 'security-operator', name: 'Security Operator', description: 'Security & incidents only', permissions: ['security', 'incidents', 'crowd'] },
  { id: 'medical-operator', name: 'Medical Operator', description: 'Medical & emergency', permissions: ['medical', 'incidents'] },
  { id: 'volunteer', name: 'Volunteer', description: 'Read-only operational view', permissions: ['view'] },
  { id: 'transport-manager', name: 'Transport Manager', description: 'Transport & logistics', permissions: ['transport', 'facilities'] },
  { id: 'guest', name: 'Guest', description: 'Limited dashboard view', permissions: ['dashboard'] },
];

// ── Notifications ─────────────────────────────────────────────────────────────
export type NotifSeverity = 'critical' | 'warning' | 'info' | 'resolved';

export interface AppNotification {
  id: string;
  type: NotifSeverity;
  title: string;
  desc: string;
  time: string;
  timestamp: number;
  read: boolean;
  pinned: boolean;
  archived: boolean;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', type: 'critical', title: 'Medical Emergency', desc: 'Sector B Row 18. Medical team dispatched.', time: '2m ago', timestamp: Date.now() - 120000, read: false, pinned: false, archived: false },
  { id: 'n2', type: 'warning', title: 'High Density — Gate C', desc: 'Gate C throughput below nominal. Consider rerouting.', time: '15m ago', timestamp: Date.now() - 900000, read: false, pinned: false, archived: false },
  { id: 'n3', type: 'info', title: 'Shift Change', desc: 'Security Team Alpha shift ending in 30 mins.', time: '1h ago', timestamp: Date.now() - 3600000, read: true, pinned: false, archived: false },
  { id: 'n4', type: 'resolved', title: 'Network Latency Resolved', desc: 'Broadcast feed latency normalized.', time: '2h ago', timestamp: Date.now() - 7200000, read: true, pinned: false, archived: false },
];

// ── Toast ─────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// ── Theme ─────────────────────────────────────────────────────────────────────
export type Theme = 'light' | 'dark' | 'system';

// ── Context Type ──────────────────────────────────────────────────────────────
interface AppContextType {
  // Identity
  user: AppUser;
  updateUser: (patch: Partial<AppUser>) => void;

  // Workspace
  activeWorkspace: Workspace;
  switchWorkspace: (id: string) => void;

  // Role
  activeRole: AppRole;
  switchRole: (id: string) => void;

  // Language
  language: string;
  setLanguage: (code: string) => void;

  // Theme
  theme: Theme;
  setTheme: (t: Theme) => void;

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read' | 'pinned' | 'archived'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  togglePin: (id: string) => void;
  archiveNotification: (id: string) => void;
  deleteNotification: (id: string) => void;

  // Toast
  toasts: Toast[];
  toast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

let toastCounter = 0;
let notifCounter = 100;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser>(VANSH_IDENTITY);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('w1');
  const [activeRoleId, setActiveRoleId] = useState('administrator');
  const [language, setLanguageState] = useState('en');
  const [theme, setThemeState] = useState<Theme>('light');
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const activeWorkspace = WORKSPACES.find(w => w.id === activeWorkspaceId) || WORKSPACES[0];
  const activeRole = ROLES.find(r => r.id === activeRoleId) || ROLES[0];
  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

  const updateUser = useCallback((patch: Partial<AppUser>) => {
    setUser(prev => ({ ...prev, ...patch }));
  }, []);

  const switchWorkspace = useCallback((id: string) => {
    setActiveWorkspaceId(id);
  }, []);

  const switchRole = useCallback((id: string) => {
    setActiveRoleId(id);
  }, []);

  const setLanguage = useCallback((code: string) => {
    setLanguageState(code);
    document.documentElement.lang = code;
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'timestamp' | 'read' | 'pinned' | 'archived'>) => {
    const newNotif: AppNotification = {
      ...n,
      id: `notif-${++notifCounter}`,
      timestamp: Date.now(),
      read: false,
      pinned: false,
      archived: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  }, []);

  const archiveNotification = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: true } : n));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCounter}`;
    const duration = t.duration ?? 4000;
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(x => x.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(x => x.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      user, updateUser,
      activeWorkspace, switchWorkspace,
      activeRole, switchRole,
      language, setLanguage,
      theme, setTheme,
      notifications, unreadCount,
      addNotification, markRead, markAllRead,
      togglePin, archiveNotification, deleteNotification,
      toasts, toast, dismissToast,
    }}>
      {children}
    </AppContext.Provider>
  );
};
