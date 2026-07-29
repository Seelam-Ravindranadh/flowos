import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  Briefcase,
  Building2,
  CreditCard,
  FileBarChart,
  FileStack,
  FileText,
  GitBranch,
  Home,
  Landmark,
  Layers,
  ListChecks,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Warehouse,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavKey =
  | 'dashboard'
  | 'assistant'
  | 'forecast'
  | 'receivables'
  | 'payables'
  | 'invoices'
  | 'purchase_orders'
  | 'vendors'
  | 'customers'
  | 'credit_score'
  | 'funding_marketplace'
  | 'analytics'
  | 'expenses'
  | 'inventory'
  | 'tax'
  | 'integrations'
  | 'banking'
  | 'payments'
  | 'documents'
  | 'notifications'
  | 'workflows'
  | 'fraud'
  | 'reports';

  export interface NavItem {
  key: NavKey;
  label: string;
  icon: LucideIcon;
  group: string;
  badge?: string;
}

export const NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, group: 'Overview' },
  { key: 'assistant', label: 'AI Assistant', icon: Bot, group: 'Overview', badge: 'AI' },
  { key: 'forecast', label: 'Cash Flow Forecast', icon: Activity, group: 'Overview' },

  { key: 'receivables', label: 'Receivables', icon: Wallet, group: 'Money Flow' },
  { key: 'payables', label: 'Payables', icon: Receipt, group: 'Money Flow' },
  { key: 'invoices', label: 'Invoice Financing', icon: FileText, group: 'Money Flow', badge: '5' },

  { key: 'purchase_orders', label: 'Purchase Orders', icon: ListChecks, group: 'Money Flow' },

  { key: 'vendors', label: 'Vendors', icon: Building2, group: 'Network' },
  { key: 'customers', label: 'Customers', icon: Users, group: 'Network' },
  { key: 'credit_score', label: 'Credit Score', icon: ShieldCheck, group: 'Network', badge: 'AI' },

  { key: 'funding_marketplace', label: 'Funding Marketplace', icon: Briefcase, group: 'Capital' },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, group: 'Capital' },
  { key: 'inventory', label: 'Inventory Finance', icon: Warehouse, group: 'Capital' },

  { key: 'expenses', label: 'Expenses', icon: CreditCard, group: 'Operations' },
  { key: 'tax', label: 'Tax Center', icon: FileBarChart, group: 'Operations' },
  { key: 'banking', label: 'Banking', icon: Landmark, group: 'Operations' },
  { key: 'payments', label: 'Payment Gateway', icon: Wallet, group: 'Operations' },

  { key: 'documents', label: 'Documents', icon: FileStack, group: 'System' },
  { key: 'notifications', label: 'Notifications', icon: Sparkles, group: 'System', badge: '4' },
  { key: 'workflows', label: 'Workflow Automation', icon: GitBranch, group: 'System' },
  { key: 'fraud', label: 'Fraud Detection', icon: AlertTriangle, group: 'System', badge: 'AI' },
  { key: 'reports', label: 'Reports', icon: FileBarChart, group: 'System' },
  { key: 'integrations', label: 'Integrations', icon: Layers, group: 'System' },
];

export const NAV_GROUPS = ['Overview', 'Money Flow', 'Network', 'Capital', 'Operations', 'System'] as const;

export const NAV_LABELS: Record<NavKey, string> = NAV.reduce((acc, n) => {
  acc[n.key] = n.label;
  return acc;
}, {} as Record<NavKey, string>);
