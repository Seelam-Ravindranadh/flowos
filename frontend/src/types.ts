// FlowOS — domain types

export type ID = string;

export type Currency = 'INR' | 'USD';

export type RiskBand = 'low' | 'moderate' | 'elevated' | 'high';

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'paid'
  | 'overdue'
  | 'partial'
  | 'financed'
  | 'disputed';

export type FundingStatus =
  | 'listed'
  | 'under_review'
  | 'offers_received'
  | 'accepted'
  | 'funded'
  | 'repaid'
  | 'rejected';

export type POStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'received' | 'closed';

export type TxnType = 'inflow' | 'outflow';

export type UserRole =
  | 'sme_owner'
  | 'finance_manager'
  | 'accountant'
  | 'bank'
  | 'nbfc'
  | 'buyer'
  | 'supplier'
  | 'admin'
  | 'super_admin';

export interface KPISummary {
  cashAvailable: number;
  pendingReceivables: number;
  outstandingPayables: number;
  workingCapital: number;
  creditScore: number;
  expectedInflow: number;
  expectedOutflow: number;
  netCashPosition: number;
  businessHealth: number;
  revenueMTD: number;
  profitMTD: number;
  outstandingInvoices: number;
  fundingRequests: number;
}

export interface AIInsight {
  id: ID;
  severity: 'info' | 'success' | 'warning' | 'critical';
  title: string;
  detail: string;
  action?: string;
  impact?: string;
  category: 'cash' | 'receivables' | 'payables' | 'funding' | 'risk' | 'growth';
}

export interface Invoice {
  id: ID;
  number: string;
  customerId: ID;
  customerName: string;
  issuedOn: string;
  dueOn: string;
  amount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  paidAmount: number;
  daysOutstanding: number;
  agingBucket: 'current' | '1-30' | '31-60' | '61-90' | '90+';
  paymentProbability: number;
  financingEligible: boolean;
}

export interface Payable {
  id: ID;
  number: string;
  vendorId: ID;
  vendorName: string;
  receivedOn: string;
  dueOn: string;
  amount: number;
  status: 'unpaid' | 'scheduled' | 'paid' | 'overdue';
  priority: 'critical' | 'high' | 'medium' | 'low';
  earlyDiscount: number;
  daysToDue: number;
}

export interface Customer {
  id: ID;
  name: string;
  industry: string;
  gstin: string;
  creditLimit: number;
  outstanding: number;
  totalInvoiced: number;
  avgPaymentDays: number;
  riskScore: number;
  riskBand: RiskBand;
  lastInvoiceOn: string;
  relationshipSince: string;
}

export interface Vendor {
  id: ID;
  name: string;
  category: string;
  gstin: string;
  creditLimit: number;
  outstanding: number;
  totalSpent: number;
  avgDelayDays: number;
  riskScore: number;
  riskBand: RiskBand;
  performance: number;
  onTimeRate: number;
}

export interface PurchaseOrder {
  id: ID;
  number: string;
  vendorId: ID;
  vendorName: string;
  createdOn: string;
  deliveryBy: string;
  amount: number;
  status: POStatus;
  approver: string;
  items: number;
}

export interface FundingOffer {
  lenderId: ID;
  lenderName: string;
  lenderType: 'Bank' | 'NBFC' | 'Private Lender';
  amount: number;
  rate: number;
  tenureDays: number;
  fee: number;
  netAdvance: number;
  processingTime: string;
  rating: number;
}

export interface FundingRequest {
  id: ID;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  advanceRatio: number;
  status: FundingStatus;
  bestRate: number;
  offers: number;
  createdOn: string;
  timeline: { label: string; date: string; done: boolean }[];
}

export interface BankAccount {
  id: ID;
  bank: string;
  account: string;
  type: 'Current' | 'Savings' | 'OD' | 'ESC';
  balance: number;
  currency: Currency;
  lastSync: string;
  status: 'synced' | 'syncing' | 'failed';
}

export interface Transaction {
  id: ID;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TxnType;
  bank: string;
  reconciled: boolean;
}

export interface Expense {
  id: ID;
  date: string;
  category: string;
  vendor: string;
  amount: number;
  status: 'submitted' | 'approved' | 'reimbursed' | 'flagged';
  submittedBy: string;
  receipt: boolean;
  recurring: boolean;
}

export interface Notification {
  id: ID;
  type: 'invoice' | 'funding' | 'cash' | 'payment' | 'supplier' | 'gst' | 'ai' | 'fraud';
  title: string;
  detail: string;
  time: string;
  read: boolean;
  severity: 'info' | 'success' | 'warning' | 'critical';
}

export interface WorkflowRule {
  id: ID;
  name: string;
  trigger: string;
  action: string;
  channel: 'email' | 'whatsapp' | 'app' | 'system';
  active: boolean;
  runs: number;
  lastRun: string;
}

export interface FraudAlert {
  id: ID;
  type: 'duplicate_invoice' | 'fake_invoice' | 'unusual_payment' | 'round_trip' | 'vendor_anomaly';
  severity: 'low' | 'medium' | 'high';
  entity: string;
  amount: number;
  description: string;
  detectedOn: string;
  status: 'open' | 'reviewing' | 'confirmed' | 'dismissed';
}

export interface ChatMessage {
  id: ID;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  chips?: string[];
}

export interface Integration {
  id: ID;
  name: string;
  category: 'ERP' | 'Banking' | 'Payments' | 'Tax' | 'CRM';
  status: 'connected' | 'available' | 'beta';
  logo: string;
  lastSync?: string;
  description: string;
}

export interface TaxFiling {
  id: ID;
  type: 'GSTR-1' | 'GSTR-3B' | 'TDS' | 'GSTR-9' | 'PT' | 'ITR';
  period: string;
  dueOn: string;
  status: 'upcoming' | 'filed' | 'overdue' | 'draft';
  liability: number;
  paid: number;
}

export interface InventoryItem {
  id: ID;
  sku: string;
  name: string;
  warehouse: string;
  qty: number;
  reorderLevel: number;
  unitCost: number;
  value: number;
  turnover: number;
  daysOfStock: number;
  financeable: boolean;
}

export interface ReportItem {
  id: ID;
  name: string;
  type: 'P&L' | 'Balance Sheet' | 'Cash Flow' | 'Receivable' | 'Payable' | 'Funding' | 'GST';
  period: string;
  generatedOn: string;
  format: 'PDF' | 'Excel';
}
