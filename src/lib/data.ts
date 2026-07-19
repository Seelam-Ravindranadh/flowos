import type {
  AIInsight,
  BankAccount,
  ChatMessage,
  Customer,
  Expense,
  FraudAlert,
  FundingOffer,
  FundingRequest,
  Integration,
  InventoryItem,
  Invoice,
  KPISummary,
  Notification,
  Payable,
  PurchaseOrder,
  ReportItem,
  TaxFiling,
  Transaction,
  Vendor,
  WorkflowRule,
} from '../types';

export const company = {
  name: 'Aurora Textiles Pvt Ltd',
  industry: 'Textiles & Apparel',
  gstin: '27ABCDE1234F1Z5',
  pan: 'ABCDE1234F',
  cin: 'U17120MH2018PTC312456',
  fiscalYear: 'FY 2025-26',
  reportingCurrency: 'INR',
  founded: '2018',
  employees: 84,
  revenueLY: 42_60_00_000,
};

export const kpi: KPISummary = {
  cashAvailable: 1_84_50_000,
  pendingReceivables: 3_92_40_000,
  outstandingPayables: 1_58_70_000,
  workingCapital: 4_18_20_000,
  creditScore: 742,
  expectedInflow: 1_12_30_000,
  expectedOutflow: 86_40_000,
  netCashPosition: 25_90_000,
  businessHealth: 78,
  revenueMTD: 3_24_50_000,
  profitMTD: 48_60_000,
  outstandingInvoices: 47,
  fundingRequests: 6,
};

export const insights: AIInsight[] = [
  {
    id: 'i1',
    severity: 'critical',
    title: 'Cash shortage expected in 18 days',
    detail:
      'Based on receivables aging and scheduled payables, your operating cash will drop below the safety threshold of ₹50L by Aug 6. Three invoices totalling ₹84L are overdue beyond 60 days.',
    action: 'Finance Invoice #FLW-1458 & #FLW-1472',
    impact: '+₹61L liquidity',
    category: 'cash',
  },
  {
    id: 'i2',
    severity: 'warning',
    title: 'Recommend financing Invoice #FLW-1458',
    detail:
      'Vertex Industries has a 94% payment probability but a 67-day average payment cycle. Financing ₹28L today at 11.2% unlocks ₹25.2L immediately at a cost of just ₹31,360.',
    action: 'List on financing marketplace',
    impact: '+₹25.2L cash now',
    category: 'funding',
  },
  {
    id: 'i3',
    severity: 'info',
    title: 'Delay supplier payment to Trident Supplies by 5 days',
    detail:
      'Trident invoice TR-9982 (₹14.2L) is due Aug 9. Their on-time rate is 96% and 5-day extension is within your agreed terms — no discount lost, frees ₹14.2L for the cash gap window.',
    action: 'Reschedule payment to Aug 14',
    impact: '+₹14.2L buffer',
    category: 'payables',
  },
  {
    id: 'i4',
    severity: 'success',
    title: 'Collect payment from Crestline Retail — ₹31.4L',
    detail:
      'Crestline has cleared 88% of past invoices within 45 days. This invoice is at day 52 — a WhatsApp reminder has a 71% response rate based on their history.',
    action: 'Send WhatsApp reminder',
    impact: '+₹31.4L inflow',
    category: 'receivables',
  },
  {
    id: 'i5',
    severity: 'warning',
    title: 'GST GSTR-3B due in 6 days',
    detail:
      'Liability of ₹6.42L for July. Auto-drafted returns are 92% prepared — confirm input tax credit reconciliation to lock filing.',
    action: 'Review & file GSTR-3B',
    impact: 'Avoid ₹12,840 late fee',
    category: 'risk',
  },
  {
    id: 'i6',
    severity: 'info',
    title: 'Working capital utilization at 68%',
    detail:
      'Healthy utilization with room to absorb a ₹1.2Cr facility if Q2 demand forecast holds. Industry benchmark for your segment is 55–75%.',
    action: 'Pre-qualify for WC line',
    impact: '+₹1.2Cr capacity',
    category: 'growth',
  },
];

// 30 days of cash flow history + forecast
export const cashFlowSeries = Array.from({ length: 60 }, (_, i) => {
  const day = i - 29;
  const base = 1_84_50_000;
  let inflow = 0;
  let outflow = 0;
  if (i >= 30) {
    // forecast
    inflow = Math.max(0, 4_00_000 + Math.sin(i / 4) * 2_50_000 + (i % 7 === 0 ? 9_50_000 : 0));
    outflow = 2_80_000 + Math.cos(i / 5) * 1_20_000 + (i % 14 === 0 ? 6_40_000 : 0);
  } else {
    inflow = Math.max(0, 3_20_000 + Math.sin(i / 3) * 1_80_000 + (i % 6 === 0 ? 7_80_000 : 0));
    outflow = 2_60_000 + Math.cos(i / 4) * 1_40_000 + (i % 12 === 0 ? 5_20_000 : 0);
  }
  const net = inflow - outflow;
  const running = Math.round(base + (i < 30 ? -2_50_000 * Math.cos(i / 8) : -6_40_000 + i * 1_10_000));
  return {
    day,
    label: day === 0 ? 'Today' : day > 0 ? `+${day}d` : `${day}d`,
    inflow: Math.round(inflow),
    outflow: Math.round(outflow),
    net: Math.round(net),
    balance: running,
    forecast: i >= 30,
  };
});

export const revenueSeries = [
  { m: 'Mar', revenue: 286, cost: 198, profit: 41 },
  { m: 'Apr', revenue: 312, cost: 214, profit: 47 },
  { m: 'May', revenue: 298, cost: 206, profit: 39 },
  { m: 'Jun', revenue: 348, cost: 232, profit: 54 },
  { m: 'Jul', revenue: 364, cost: 241, profit: 58 },
  { m: 'Aug', revenue: 324, cost: 226, profit: 49 },
];

export const receivableAging = [
  { bucket: 'Current', amount: 128, count: 18 },
  { bucket: '1–30', amount: 96, count: 12 },
  { bucket: '31–60', amount: 74, count: 9 },
  { bucket: '61–90', amount: 58, count: 6 },
  { bucket: '90+', amount: 36, count: 4 },
];

export const payableAging = [
  { bucket: 'Due ≤7d', amount: 42, count: 7 },
  { bucket: 'Due 8–15d', amount: 58, count: 9 },
  { bucket: 'Due 16–30d', amount: 39, count: 6 },
  { bucket: 'Due 31–60d', amount: 19, count: 3 },
];

export const expenseBreakdown = [
  { name: 'Raw Materials', value: 41, color: '#1E78FF' },
  { name: 'Payroll', value: 23, color: '#06B6D4' },
  { name: 'Logistics', value: 12, color: '#10B981' },
  { name: 'Rent & Utilities', value: 9, color: '#F59E0B' },
  { name: 'Marketing', value: 7, color: '#8B5CF6' },
  { name: 'Other', value: 8, color: '#64748B' },
];

export const customers: Customer[] = [
  { id: 'c1', name: 'Vertex Industries', industry: 'Manufacturing', gstin: '27AABCV1234R1ZP', creditLimit: 80_00_000, outstanding: 52_40_000, totalInvoiced: 2_34_00_000, avgPaymentDays: 67, riskScore: 682, riskBand: 'moderate', lastInvoiceOn: '2025-07-22', relationshipSince: '2021' },
  { id: 'c2', name: 'Crestline Retail', industry: 'Retail', gstin: '29AAACC4567Q1ZM', creditLimit: 1_20_00_000, outstanding: 31_40_000, totalInvoiced: 3_18_00_000, avgPaymentDays: 45, riskScore: 814, riskBand: 'low', lastInvoiceOn: '2025-07-26', relationshipSince: '2020' },
  { id: 'c3', name: 'Nimbus Electronics', industry: 'Electronics', gstin: '07AADCN9012S1ZK', creditLimit: 60_00_000, outstanding: 18_60_000, totalInvoiced: 1_42_00_000, avgPaymentDays: 38, riskScore: 856, riskBand: 'low', lastInvoiceOn: '2025-07-19', relationshipSince: '2022' },
  { id: 'c4', name: 'Orbit Logistics', industry: 'Logistics', gstin: '33AAFCO5678T1ZB', creditLimit: 40_00_000, outstanding: 22_80_000, totalInvoiced: 96_00_000, avgPaymentDays: 71, riskScore: 598, riskBand: 'elevated', lastInvoiceOn: '2025-07-11', relationshipSince: '2023' },
  { id: 'c5', name: 'Helix Pharma', industry: 'Pharma', gstin: '24AAGCH3456P1ZL', creditLimit: 90_00_000, outstanding: 14_20_000, totalInvoiced: 2_08_00_000, avgPaymentDays: 41, riskScore: 798, riskBand: 'low', lastInvoiceOn: '2025-07-28', relationshipSince: '2021' },
  { id: 'c6', name: 'Sundara Hotels', industry: 'Hospitality', gstin: '27AAJCS7890H1ZN', creditLimit: 35_00_000, outstanding: 9_80_000, totalInvoiced: 64_00_000, avgPaymentDays: 88, riskScore: 541, riskBand: 'high', lastInvoiceOn: '2025-06-30', relationshipSince: '2024' },
  { id: 'c7', name: 'Pinnacle Builders', industry: 'Construction', gstin: '19AAFCP2345B1ZQ', creditLimit: 50_00_000, outstanding: 28_60_000, totalInvoiced: 1_12_00_000, avgPaymentDays: 54, riskScore: 672, riskBand: 'moderate', lastInvoiceOn: '2025-07-15', relationshipSince: '2022' },
  { id: 'c8', name: 'Quanta Systems', industry: 'IT Services', gstin: '27AABCQ6789R1ZJ', creditLimit: 70_00_000, outstanding: 19_40_000, totalInvoiced: 1_86_00_000, avgPaymentDays: 36, riskScore: 836, riskBand: 'low', lastInvoiceOn: '2025-07-24', relationshipSince: '2020' },
];

export const vendors: Vendor[] = [
  { id: 'v1', name: 'Trident Supplies', category: 'Raw Materials', gstin: '27AAACT1111Z1Z5', creditLimit: 60_00_000, outstanding: 14_20_000, totalSpent: 1_84_00_000, avgDelayDays: 2, riskScore: 842, riskBand: 'low', performance: 94, onTimeRate: 96 },
  { id: 'v2', name: 'Marlin Yarns', category: 'Raw Materials', gstin: '33AADCM2222Z1Z9', creditLimit: 45_00_000, outstanding: 8_60_000, totalSpent: 1_24_00_000, avgDelayDays: 4, riskScore: 808, riskBand: 'low', performance: 90, onTimeRate: 92 },
  { id: 'v3', name: 'Lumen Packaging', category: 'Packaging', gstin: '29AAACL3333Z1Z4', creditLimit: 20_00_000, outstanding: 3_40_000, totalSpent: 48_00_000, avgDelayDays: 8, riskScore: 672, riskBand: 'moderate', performance: 81, onTimeRate: 78 },
  { id: 'v4', name: 'Bluefreight Logistics', category: 'Logistics', gstin: '07AADCL4444Z1Z7', creditLimit: 15_00_000, outstanding: 5_20_000, totalSpent: 62_00_000, avgDelayDays: 6, riskScore: 714, riskBand: 'moderate', performance: 85, onTimeRate: 84 },
  { id: 'v5', name: 'Apex Machinery', category: 'Equipment', gstin: '24AABCA5555Z1Z3', creditLimit: 30_00_000, outstanding: 12_80_000, totalSpent: 96_00_000, avgDelayDays: 12, riskScore: 588, riskBand: 'elevated', performance: 72, onTimeRate: 64 },
  { id: 'v6', name: 'Nimbus IT Services', category: 'IT & Software', gstin: '27AABCN6666Z1Z8', creditLimit: 10_00_000, outstanding: 2_10_000, totalSpent: 38_00_000, avgDelayDays: 1, riskScore: 886, riskBand: 'low', performance: 97, onTimeRate: 99 },
];

export const invoices: Invoice[] = [
  { id: 'iv1', number: 'FLW-1458', customerId: 'c1', customerName: 'Vertex Industries', issuedOn: '2025-06-04', dueOn: '2025-08-03', amount: 23_80_000, tax: 4_28_400, total: 28_08_400, status: 'overdue', paidAmount: 0, daysOutstanding: 52, agingBucket: '31-60', paymentProbability: 94, financingEligible: true },
  { id: 'iv2', number: 'FLW-1472', customerId: 'c1', customerName: 'Vertex Industries', issuedOn: '2025-06-18', dueOn: '2025-08-17', amount: 19_40_000, tax: 3_49_200, total: 22_89_200, status: 'overdue', paidAmount: 0, daysOutstanding: 38, agingBucket: '31-60', paymentProbability: 88, financingEligible: true },
  { id: 'iv3', number: 'FLW-1498', customerId: 'c2', customerName: 'Crestline Retail', issuedOn: '2025-07-03', dueOn: '2025-08-17', amount: 26_60_000, tax: 4_78_800, total: 31_38_800, status: 'sent', paidAmount: 0, daysOutstanding: 24, agingBucket: '1-30', paymentProbability: 86, financingEligible: true },
  { id: 'iv4', number: 'FLW-1503', customerId: 'c3', customerName: 'Nimbus Electronics', issuedOn: '2025-07-11', dueOn: '2025-08-10', amount: 15_80_000, tax: 2_84_400, total: 18_64_400, status: 'viewed', paidAmount: 0, daysOutstanding: 14, agingBucket: '1-30', paymentProbability: 92, financingEligible: true },
  { id: 'iv5', number: 'FLW-1511', customerId: 'c5', customerName: 'Helix Pharma', issuedOn: '2025-07-18', dueOn: '2025-08-17', amount: 12_00_000, tax: 2_16_000, total: 14_16_000, status: 'sent', paidAmount: 0, daysOutstanding: 9, agingBucket: 'current', paymentProbability: 90, financingEligible: true },
  { id: 'iv6', number: 'FLW-1519', customerId: 'c7', customerName: 'Pinnacle Builders', issuedOn: '2025-07-22', dueOn: '2025-09-05', amount: 24_20_000, tax: 4_35_600, total: 28_55_600, status: 'sent', paidAmount: 0, daysOutstanding: 6, agingBucket: 'current', paymentProbability: 74, financingEligible: false },
  { id: 'iv7', number: 'FLW-1524', customerId: 'c8', customerName: 'Quanta Systems', issuedOn: '2025-07-24', dueOn: '2025-08-23', amount: 16_40_000, tax: 2_95_200, total: 19_35_200, status: 'viewed', paidAmount: 0, daysOutstanding: 4, agingBucket: 'current', paymentProbability: 95, financingEligible: true },
  { id: 'iv8', number: 'FLW-1531', customerId: 'c4', customerName: 'Orbit Logistics', issuedOn: '2025-06-11', dueOn: '2025-08-10', amount: 18_20_000, tax: 3_27_600, total: 21_47_600, status: 'partial', paidAmount: 8_00_000, daysOutstanding: 45, agingBucket: '31-60', paymentProbability: 62, financingEligible: false },
  { id: 'iv9', number: 'FLW-1538', customerId: 'c6', customerName: 'Sundara Hotels', issuedOn: '2025-06-30', dueOn: '2025-08-29', amount: 8_20_000, tax: 1_47_600, total: 9_67_600, status: 'overdue', paidAmount: 0, daysOutstanding: 24, agingBucket: '1-30', paymentProbability: 48, financingEligible: false },
  { id: 'iv10', number: 'FLW-1540', customerId: 'c2', customerName: 'Crestline Retail', issuedOn: '2025-07-26', dueOn: '2025-09-09', amount: 22_40_000, tax: 4_03_200, total: 26_43_200, status: 'sent', paidAmount: 0, daysOutstanding: 2, agingBucket: 'current', paymentProbability: 89, financingEligible: true },
  { id: 'iv11', number: 'FLW-1431', customerId: 'c3', customerName: 'Nimbus Electronics', issuedOn: '2025-05-12', dueOn: '2025-07-11', amount: 14_20_000, tax: 2_55_600, total: 16_75_600, status: 'paid', paidAmount: 16_75_600, daysOutstanding: 0, agingBucket: 'current', paymentProbability: 100, financingEligible: false },
  { id: 'iv12', number: 'FLW-1408', customerId: 'c5', customerName: 'Helix Pharma', issuedOn: '2025-04-28', dueOn: '2025-06-12', amount: 11_80_000, tax: 2_12_400, total: 13_92_400, status: 'paid', paidAmount: 13_92_400, daysOutstanding: 0, agingBucket: 'current', paymentProbability: 100, financingEligible: false },
];

export const payables: Payable[] = [
  { id: 'p1', number: 'TR-9982', vendorId: 'v1', vendorName: 'Trident Supplies', receivedOn: '2025-07-10', dueOn: '2025-08-09', amount: 14_20_000, status: 'unpaid', priority: 'high', earlyDiscount: 0, daysToDue: 7 },
  { id: 'p2', number: 'MY-441', vendorId: 'v2', vendorName: 'Marlin Yarns', receivedOn: '2025-07-18', dueOn: '2025-08-12', amount: 8_60_000, status: 'unpaid', priority: 'medium', earlyDiscount: 1.5, daysToDue: 10 },
  { id: 'p3', number: 'AM-2207', vendorId: 'v5', vendorName: 'Apex Machinery', receivedOn: '2025-07-02', dueOn: '2025-08-01', amount: 12_80_000, status: 'overdue', priority: 'critical', earlyDiscount: 0, daysToDue: -8 },
  { id: 'p4', number: 'BF-118', vendorId: 'v4', vendorName: 'Bluefreight Logistics', receivedOn: '2025-07-20', dueOn: '2025-08-19', amount: 5_20_000, status: 'unpaid', priority: 'medium', earlyDiscount: 2, daysToDue: 17 },
  { id: 'p5', number: 'LP-091', vendorId: 'v3', vendorName: 'Lumen Packaging', receivedOn: '2025-07-22', dueOn: '2025-08-21', amount: 3_40_000, status: 'unpaid', priority: 'low', earlyDiscount: 1, daysToDue: 19 },
  { id: 'p6', number: 'NI-2024', vendorId: 'v6', vendorName: 'Nimbus IT Services', receivedOn: '2025-07-25', dueOn: '2025-08-24', amount: 2_10_000, status: 'scheduled', priority: 'low', earlyDiscount: 0, daysToDue: 22 },
  { id: 'p7', number: 'TR-9654', vendorId: 'v1', vendorName: 'Trident Supplies', receivedOn: '2025-06-15', dueOn: '2025-07-15', amount: 9_80_000, status: 'paid', priority: 'high', earlyDiscount: 0, daysToDue: -25 },
];

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'po1', number: 'PO-3301', vendorId: 'v1', vendorName: 'Trident Supplies', createdOn: '2025-07-26', deliveryBy: '2025-08-12', amount: 18_40_000, status: 'approved', approver: 'R. Mehta', items: 12 },
  { id: 'po2', number: 'PO-3302', vendorId: 'v2', vendorName: 'Marlin Yarns', createdOn: '2025-07-27', deliveryBy: '2025-08-15', amount: 9_20_000, status: 'pending_approval', approver: 'S. Iyer', items: 6 },
  { id: 'po3', number: 'PO-3303', vendorId: 'v4', vendorName: 'Bluefreight Logistics', createdOn: '2025-07-28', deliveryBy: '2025-08-05', amount: 2_60_000, status: 'sent', approver: 'R. Mehta', items: 2 },
  { id: 'po4', number: 'PO-3304', vendorId: 'v3', vendorName: 'Lumen Packaging', createdOn: '2025-07-28', deliveryBy: '2025-08-18', amount: 4_10_000, status: 'draft', approver: '—', items: 9 },
  { id: 'po5', number: 'PO-3298', vendorId: 'v5', vendorName: 'Apex Machinery', createdOn: '2025-07-20', deliveryBy: '2025-08-10', amount: 14_80_000, status: 'received', approver: 'S. Iyer', items: 3 },
];

export const fundingOffers: FundingOffer[] = [
  { lenderId: 'l1', lenderName: 'HDFC Bank', lenderType: 'Bank', amount: 25_20_000, rate: 10.4, tenureDays: 60, fee: 38_000, netAdvance: 24_82_000, processingTime: '24 hrs', rating: 4.8 },
  { lenderId: 'l2', lenderName: 'Axis Finance', lenderType: 'NBFC', amount: 25_20_000, rate: 11.2, tenureDays: 60, fee: 42_000, netAdvance: 24_78_000, processingTime: '8 hrs', rating: 4.5 },
  { lenderId: 'l3', lenderName: 'Kotak Mahindra', lenderType: 'Bank', amount: 22_00_000, rate: 9.8, tenureDays: 75, fee: 31_000, netAdvance: 21_69_000, processingTime: '48 hrs', rating: 4.7 },
  { lenderId: 'l4', lenderName: 'Lendingkart', lenderType: 'NBFC', amount: 25_20_000, rate: 12.6, tenureDays: 45, fee: 48_000, netAdvance: 24_72_000, processingTime: '6 hrs', rating: 4.2 },
  { lenderId: 'l5', lenderName: 'IndiFi Capital', lenderType: 'Private Lender', amount: 28_00_000, rate: 13.4, tenureDays: 60, fee: 56_000, netAdvance: 27_44_000, processingTime: '12 hrs', rating: 4.0 },
];

export const fundingRequests: FundingRequest[] = [
  {
    id: 'f1', invoiceNumber: 'FLW-1458', customerName: 'Vertex Industries', amount: 28_08_400, advanceRatio: 90, status: 'offers_received', bestRate: 10.4, offers: 5, createdOn: '2025-07-29',
    timeline: [
      { label: 'Invoice uploaded', date: 'Jul 29, 09:14', done: true },
      { label: 'Buyer verified', date: 'Jul 29, 11:02', done: true },
      { label: 'Offers received', date: 'Jul 29, 14:38', done: true },
      { label: 'Offer accepted', date: 'Pending', done: false },
      { label: 'Funds disbursed', date: 'Pending', done: false },
    ],
  },
  {
    id: 'f2', invoiceNumber: 'FLW-1472', customerName: 'Vertex Industries', amount: 22_89_200, advanceRatio: 88, status: 'listed', bestRate: 0, offers: 0, createdOn: '2025-07-30',
    timeline: [
      { label: 'Invoice uploaded', date: 'Jul 30, 10:21', done: true },
      { label: 'Buyer verification', date: 'In progress', done: false },
      { label: 'Offers received', date: 'Pending', done: false },
      { label: 'Offer accepted', date: 'Pending', done: false },
      { label: 'Funds disbursed', date: 'Pending', done: false },
    ],
  },
  {
    id: 'f3', invoiceNumber: 'FLW-1318', customerName: 'Quanta Systems', amount: 19_35_200, advanceRatio: 90, status: 'funded', bestRate: 9.6, offers: 4, createdOn: '2025-07-15',
    timeline: [
      { label: 'Invoice uploaded', date: 'Jul 15, 11:00', done: true },
      { label: 'Buyer verified', date: 'Jul 15, 13:20', done: true },
      { label: 'Offers received', date: 'Jul 15, 16:45', done: true },
      { label: 'Offer accepted', date: 'Jul 16, 09:30', done: true },
      { label: 'Funds disbursed', date: 'Jul 16, 14:10', done: true },
    ],
  },
  {
    id: 'f4', invoiceNumber: 'FLW-1240', customerName: 'Helix Pharma', amount: 13_92_400, advanceRatio: 88, status: 'repaid', bestRate: 10.1, offers: 3, createdOn: '2025-06-12',
    timeline: [
      { label: 'Invoice uploaded', date: 'Jun 12, 10:00', done: true },
      { label: 'Buyer verified', date: 'Jun 12, 12:00', done: true },
      { label: 'Offers received', date: 'Jun 12, 15:00', done: true },
      { label: 'Offer accepted', date: 'Jun 13, 09:00', done: true },
      { label: 'Funds disbursed', date: 'Jun 13, 13:00', done: true },
      { label: 'Repaid', date: 'Jul 18, 11:00', done: true },
    ],
  },
];

export const bankAccounts: BankAccount[] = [
  { id: 'b1', bank: 'HDFC Bank', account: '•••• 4421', type: 'Current', balance: 1_42_60_000, currency: 'INR', lastSync: '2 min ago', status: 'synced' },
  { id: 'b2', bank: 'ICICI Bank', account: '•••• 7782', type: 'Current', balance: 32_80_000, currency: 'INR', lastSync: '5 min ago', status: 'synced' },
  { id: 'b3', bank: 'HDFC Bank', account: '•••• 1109', type: 'OD', balance: 9_10_000, currency: 'INR', lastSync: '12 min ago', status: 'syncing' },
  { id: 'b4', bank: 'Axis Bank', account: '•••• 3340', type: 'ESC', balance: 0, currency: 'INR', lastSync: '1 hr ago', status: 'failed' },
];

export const transactions: Transaction[] = [
  { id: 't1', date: '2025-07-31', description: 'NEFT — Crestline Retail', category: 'Invoice Collection', amount: 16_75_600, type: 'inflow', bank: 'HDFC •••• 4421', reconciled: true },
  { id: 't2', date: '2025-07-31', description: 'UPI — Office Supplies', category: 'Operations', amount: 14_200, type: 'outflow', bank: 'HDFC •••• 4421', reconciled: true },
  { id: 't3', date: '2025-07-30', description: 'RTGS — Trident Supplies', category: 'Vendor Payment', amount: 9_80_000, type: 'outflow', bank: 'HDFC •••• 4421', reconciled: true },
  { id: 't4', date: '2025-07-30', description: 'Salary Disbursement — Jul', category: 'Payroll', amount: 38_60_000, type: 'outflow', bank: 'ICICI •••• 7782', reconciled: true },
  { id: 't5', date: '2025-07-29', description: 'NEFT — Nimbus Electronics', category: 'Invoice Collection', amount: 18_64_400, type: 'inflow', bank: 'HDFC •••• 4421', reconciled: true },
  { id: 't6', date: '2025-07-29', description: 'Stripe — Online Store', category: 'Sales', amount: 2_84_300, type: 'inflow', bank: 'ICICI •••• 7782', reconciled: false },
  { id: 't7', date: '2025-07-28', description: 'GSTR-3B Payment', category: 'Tax', amount: 6_42_000, type: 'outflow', bank: 'HDFC •••• 4421', reconciled: true },
  { id: 't8', date: '2025-07-28', description: 'NEFT — Helix Pharma', category: 'Invoice Collection', amount: 13_92_400, type: 'inflow', bank: 'HDFC •••• 4421', reconciled: true },
  { id: 't9', date: '2025-07-26', description: 'Card — AWS Cloud', category: 'IT & Software', amount: 84_200, type: 'outflow', bank: 'HDFC •••• 4421', reconciled: true },
  { id: 't10', date: '2025-07-25', description: 'Funding Disbursement — Kotak', category: 'Financing', amount: 21_69_000, type: 'inflow', bank: 'ICICI •••• 7782', reconciled: true },
];

export const expenses: Expense[] = [
  { id: 'e1', date: '2025-07-30', category: 'Travel', vendor: 'Indigo Airlines', amount: 38_400, status: 'approved', submittedBy: 'A. Nair', receipt: true, recurring: false },
  { id: 'e2', date: '2025-07-29', category: 'Software', vendor: 'Figma', amount: 12_800, status: 'reimbursed', submittedBy: 'R. Mehta', receipt: true, recurring: true },
  { id: 'e3', date: '2025-07-28', category: 'Client Meeting', vendor: 'The Leela', amount: 24_600, status: 'submitted', submittedBy: 'S. Iyer', receipt: true, recurring: false },
  { id: 'e4', date: '2025-07-26', category: 'Office Supplies', vendor: 'Staples', amount: 8_400, status: 'flagged', submittedBy: 'P. Das', receipt: false, recurring: false },
  { id: 'e5', date: '2025-07-24', category: 'Marketing', vendor: 'Meta Ads', amount: 1_24_000, status: 'approved', submittedBy: 'K. Rao', receipt: true, recurring: true },
  { id: 'e6', date: '2025-07-22', category: 'Travel', vendor: 'Ola Cabs', amount: 4_200, status: 'approved', submittedBy: 'A. Nair', receipt: false, recurring: false },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'cash', title: 'Cash shortage predicted in 18 days', detail: 'Operating cash projected to fall below ₹50L safety threshold.', time: '14m ago', read: false, severity: 'critical' },
  { id: 'n2', type: 'funding', title: '5 offers received on FLW-1458', detail: 'Best rate 10.4% from HDFC Bank — ₹24.82L net advance.', time: '38m ago', read: false, severity: 'success' },
  { id: 'n3', type: 'invoice', title: 'FLW-1531 partial payment received', detail: '₹8,00,000 of ₹21,47,600 collected from Orbit Logistics.', time: '2h ago', read: false, severity: 'info' },
  { id: 'n4', type: 'fraud', title: 'Possible duplicate invoice detected', detail: 'FLW-1472 and a draft match by line items & vendor.', time: '3h ago', read: false, severity: 'warning' },
  { id: 'n5', type: 'supplier', title: 'Apex Machinery payment overdue', detail: 'AM-2207 of ₹12,80,000 is 8 days past due.', time: '6h ago', read: true, severity: 'warning' },
  { id: 'n6', type: 'gst', title: 'GSTR-3B due in 6 days', detail: 'Liability ₹6.42L — filing 92% prepared.', time: '8h ago', read: true, severity: 'info' },
  { id: 'n7', type: 'ai', title: 'AI recommendation ready', detail: 'Reschedule Trident Supplies payment to Aug 14 (+₹14.2L buffer).', time: '12h ago', read: true, severity: 'info' },
  { id: 'n8', type: 'payment', title: 'Crestline payment cleared', detail: '₹16,75,600 received via NEFT.', time: '1d ago', read: true, severity: 'success' },
];

export const workflowRules: WorkflowRule[] = [
  { id: 'w1', name: 'Overdue invoice → WhatsApp reminder', trigger: 'Invoice overdue +3d', action: 'Send WhatsApp to customer', channel: 'whatsapp', active: true, runs: 142, lastRun: '2h ago' },
  { id: 'w2', name: 'PO > ₹10L → Finance Manager approval', trigger: 'PO created above ₹10L', action: 'Route to R. Mehta', channel: 'app', active: true, runs: 28, lastRun: '6h ago' },
  { id: 'w3', name: 'Cash < ₹50L → Slack + email alert', trigger: 'Cash balance below threshold', action: 'Notify owner & CFO', channel: 'system', active: true, runs: 4, lastRun: '1d ago' },
  { id: 'w4', name: 'Expense > ₹50K → Manager approval', trigger: 'Expense submitted above ₹50K', action: 'Route to manager', channel: 'app', active: true, runs: 64, lastRun: '3h ago' },
  { id: 'w5', name: 'GST due T-7 → reminder', trigger: '7 days before GST due date', action: 'Email accountant', channel: 'email', active: true, runs: 18, lastRun: '4d ago' },
  { id: 'w6', name: 'Duplicate invoice → fraud review', trigger: 'Similar invoice detected', action: 'Flag for review', channel: 'system', active: false, runs: 9, lastRun: '2w ago' },
];

export const fraudAlerts: FraudAlert[] = [
  { id: 'fa1', type: 'duplicate_invoice', severity: 'high', entity: 'FLW-1472 vs draft', amount: 22_89_200, description: 'Line items, vendor and total match a draft invoice created 4 hours prior.', detectedOn: '2025-07-29 14:22', status: 'reviewing' },
  { id: 'fa2', type: 'unusual_payment', severity: 'medium', entity: 'Card — AWS Cloud', amount: 84_200, description: 'Amount 3.2× higher than 6-month average for IT & Software category.', detectedOn: '2025-07-26 09:15', status: 'open' },
  { id: 'fa3', type: 'vendor_anomaly', severity: 'low', entity: 'Apex Machinery', amount: 12_80_000, description: 'Vendor on-time rate dropped from 81% to 64% over last 90 days.', detectedOn: '2025-07-22 18:40', status: 'open' },
  { id: 'fa4', type: 'fake_invoice', severity: 'high', entity: 'Vendor GSTIN mismatch', amount: 6_40_000, description: 'Submitted invoice references a GSTIN that is inactive on the GST portal.', detectedOn: '2025-07-18 11:05', status: 'confirmed' },
  { id: 'fa5', type: 'round_trip', severity: 'medium', entity: 'Orbit Logistics ↔ Sundara', amount: 9_80_000, description: 'Same beneficiary appears as payer within 48 hours — possible circular flow.', detectedOn: '2025-07-12 16:30', status: 'dismissed' },
];

export const chatSeed: ChatMessage[] = [
  {
    id: 'm0',
    role: 'assistant',
    content:
      "Hi Rhea — I'm Flow, your AI finance assistant. I've analyzed Aurora Textiles' books, receivables and forecasts for today. Ask me anything, or try one of these:",
    time: '09:30',
    chips: [
      'How much cash do I need next month?',
      'Which customer pays late?',
      'Should I finance invoice #452?',
      'Can I afford a ₹40L purchase?',
    ],
  },
];

export const integrations: Integration[] = [
  { id: 'i1', name: 'SAP S/4HANA', category: 'ERP', status: 'connected', logo: 'SAP', lastSync: '12m ago', description: 'Sync GL, AR, AP, and POs from SAP S/4HANA in real time.' },
  { id: 'i2', name: 'Oracle NetSuite', category: 'ERP', status: 'connected', logo: 'NS', lastSync: '1h ago', description: 'Two-way sync of invoices, vendors, and journal entries.' },
  { id: 'i3', name: 'Tally Prime', category: 'ERP', status: 'connected', logo: 'TP', lastSync: '3h ago', description: 'Import Tally masters, vouchers, and GST returns.' },
  { id: 'i4', name: 'Zoho Books', category: 'ERP', status: 'available', logo: 'ZB', description: 'Connect Zoho Books for unified AR/AP and GST filing.' },
  { id: 'i5', name: 'QuickBooks', category: 'ERP', status: 'available', logo: 'QB', description: 'Sync QuickBooks Online customers, invoices, and expenses.' },
  { id: 'i6', name: 'Busy', category: 'ERP', status: 'beta', logo: 'BU', description: 'Beta integration for Busy accounting — vouchers and inventory.' },
  { id: 'i7', name: 'HDFC Bank', category: 'Banking', status: 'connected', logo: 'HB', lastSync: '2m ago', description: 'Live balances, statements, and auto-reconciliation.' },
  { id: 'i8', name: 'ICICI Bank', category: 'Banking', status: 'connected', logo: 'IB', lastSync: '5m ago', description: 'Corporate banking feeds and cash management.' },
  { id: 'i9', name: 'Razorpay', category: 'Payments', status: 'connected', logo: 'RZ', lastSync: '8m ago', description: 'Collect via UPI, cards, netbanking with auto-reconciliation.' },
  { id: 'i10', name: 'Stripe', category: 'Payments', status: 'connected', logo: 'ST', lastSync: '14m ago', description: 'International collections and payouts.' },
  { id: 'i11', name: 'GST Portal', category: 'Tax', status: 'connected', logo: 'GP', lastSync: '1h ago', description: 'Auto-fetch GSTR-2B, file GSTR-1/3B directly.' },
  { id: 'i12', name: 'ClearTax', category: 'Tax', status: 'available', logo: 'CT', description: 'Tax filing and reconciliation suite.' },
];

export const taxFilings: TaxFiling[] = [
  { id: 'tf1', type: 'GSTR-1', period: 'Jul 2025', dueOn: '2025-08-11', status: 'upcoming', liability: 0, paid: 0 },
  { id: 'tf2', type: 'GSTR-3B', period: 'Jul 2025', dueOn: '2025-08-20', status: 'upcoming', liability: 6_42_000, paid: 0 },
  { id: 'tf3', type: 'TDS', period: 'Q1 FY26', dueOn: '2025-07-30', status: 'filed', liability: 1_84_000, paid: 1_84_000 },
  { id: 'tf4', type: 'GSTR-9', period: 'FY 2024-25', dueOn: '2025-12-31', status: 'draft', liability: 0, paid: 0 },
  { id: 'tf5', type: 'PT', period: 'FY 2025-26', dueOn: '2025-08-15', status: 'upcoming', liability: 2_500, paid: 0 },
  { id: 'tf6', type: 'ITR', period: 'FY 2024-25', dueOn: '2025-10-31', status: 'draft', liability: 0, paid: 0 },
];

export const inventory: InventoryItem[] = [
  { id: 'inv1', sku: 'YRN-COT-40', name: 'Cotton Yarn 40s', warehouse: 'Bhiwandi WH-1', qty: 1240, reorderLevel: 400, unitCost: 240, value: 2_97_600, turnover: 8.2, daysOfStock: 44, financeable: true },
  { id: 'inv2', sku: 'FAB-MSC-220', name: 'Muslin 220 GSM', warehouse: 'Bhiwandi WH-1', qty: 580, reorderLevel: 250, unitCost: 480, value: 2_78_400, turnover: 6.4, daysOfStock: 57, financeable: true },
  { id: 'inv3', sku: 'DYE-IND-01', name: 'Indigo Dye', warehouse: 'Bhiwandi WH-2', qty: 64, reorderLevel: 80, unitCost: 1800, value: 1_15_200, turnover: 12.1, daysOfStock: 9, financeable: false },
  { id: 'inv4', sku: 'PKG-BOX-L', name: 'Carton Box L', warehouse: 'Bhiwandi WH-2', qty: 4200, reorderLevel: 1500, unitCost: 22, value: 92_400, turnover: 14.8, daysOfStock: 28, financeable: true },
  { id: 'inv5', sku: 'FAB-LIN-180', name: 'Linen 180 GSM', warehouse: 'Bhiwandi WH-1', qty: 210, reorderLevel: 180, unitCost: 640, value: 1_34_400, turnover: 4.8, daysOfStock: 76, financeable: true },
  { id: 'inv6', sku: 'THR-POL-20', name: 'Polyester Thread', warehouse: 'Bhiwandi WH-2', qty: 920, reorderLevel: 400, unitCost: 60, value: 55_200, turnover: 9.6, daysOfStock: 38, financeable: false },
];

export const reports: ReportItem[] = [
  { id: 'r1', name: 'Profit & Loss Statement', type: 'P&L', period: 'Jul 2025', generatedOn: '2025-07-31', format: 'PDF' },
  { id: 'r2', name: 'Balance Sheet', type: 'Balance Sheet', period: 'As of Jul 2025', generatedOn: '2025-07-31', format: 'PDF' },
  { id: 'r3', name: 'Cash Flow Statement', type: 'Cash Flow', period: 'Jul 2025', generatedOn: '2025-07-31', format: 'Excel' },
  { id: 'r4', name: 'Receivable Aging Report', type: 'Receivable', period: 'Jul 2025', generatedOn: '2025-07-31', format: 'Excel' },
  { id: 'r5', name: 'Payable Aging Report', type: 'Payable', period: 'Jul 2025', generatedOn: '2025-07-31', format: 'PDF' },
  { id: 'r6', name: 'Funding Summary Report', type: 'Funding', period: 'Q1 FY26', generatedOn: '2025-07-29', format: 'PDF' },
  { id: 'r7', name: 'GST Reconciliation Report', type: 'GST', period: 'Jul 2025', generatedOn: '2025-07-30', format: 'Excel' },
];

// Funding marketplace lender catalog
export const lenders = [
  { id: 'ld1', name: 'HDFC Bank', type: 'Bank' as const, product: 'Invoice Discounting', rate: 9.8, maxAmount: 5_00_00_000, tenure: '30–90 days', rating: 4.8, disbursal: '24 hrs' },
  { id: 'ld2', name: 'Axis Finance', type: 'NBFC' as const, product: 'Invoice Discounting', rate: 11.2, maxAmount: 2_00_00_000, tenure: '30–60 days', rating: 4.5, disbursal: '8 hrs' },
  { id: 'ld3', name: 'Kotak Mahindra', type: 'Bank' as const, product: 'Working Capital Loan', rate: 10.5, maxAmount: 10_00_00_000, tenure: '12 months', rating: 4.7, disbursal: '48 hrs' },
  { id: 'ld4', name: 'Lendingkart', type: 'NBFC' as const, product: 'Working Capital Loan', rate: 12.6, maxAmount: 1_00_00_000, tenure: '6–24 months', rating: 4.2, disbursal: '6 hrs' },
  { id: 'ld5', name: 'IndiFi Capital', type: 'Private Lender' as const, product: 'Supply Chain Finance', rate: 13.4, maxAmount: 3_00_00_000, tenure: '60–120 days', rating: 4.0, disbursal: '12 hrs' },
  { id: 'ld6', name: 'FlexiLoans', type: 'NBFC' as const, product: 'Purchase Order Finance', rate: 14.0, maxAmount: 1_50_00_000, tenure: 'Per PO', rating: 4.1, disbursal: '10 hrs' },
  { id: 'ld7', name: 'Aditya Birla Finance', type: 'NBFC' as const, product: 'Equipment Finance', rate: 11.8, maxAmount: 5_00_00_000, tenure: '24–60 months', rating: 4.6, disbursal: '72 hrs' },
  { id: 'ld8', name: 'Tata Capital', type: 'NBFC' as const, product: 'Invoice Discounting', rate: 10.9, maxAmount: 4_00_00_000, tenure: '30–90 days', rating: 4.6, disbursal: '24 hrs' },
];

// Analytics — monthly trend data
export const analyticsTrend = [
  { m: 'Feb', revenue: 268, expense: 196, receivables: 312, payables: 142, funding: 38 },
  { m: 'Mar', revenue: 286, expense: 198, receivables: 324, payables: 148, funding: 42 },
  { m: 'Apr', revenue: 312, expense: 214, receivables: 348, payables: 156, funding: 51 },
  { m: 'May', revenue: 298, expense: 206, receivables: 356, payables: 162, funding: 47 },
  { m: 'Jun', revenue: 348, expense: 232, receivables: 372, payables: 168, funding: 64 },
  { m: 'Jul', revenue: 364, expense: 241, receivables: 392, payables: 159, funding: 72 },
];

export const industryBenchmark = [
  { metric: 'DSO (Days)', you: 54, industry: 48, best: 38 },
  { metric: 'DPO (Days)', you: 28, industry: 34, best: 42 },
  { metric: 'Current Ratio', you: 1.8, industry: 1.5, best: 2.4 },
  { metric: 'Gross Margin', you: 31, industry: 27, best: 38 },
  { metric: 'WC Cycle', you: 62, industry: 58, best: 42 },
];

// AI assistant canned responses keyed by intent
export const aiResponses: { match: RegExp; reply: (ctx: typeof company) => { content: string; chips?: string[] } }[] = [
  {
    match: /cash.*next month|how much cash.*need|cash.*require/i,
    reply: () => ({
      content:
        "Based on your 30-day forecast, you'll need approximately ₹86.4L to cover scheduled payables, payroll, and tax liabilities. Expected inflows of ₹1.12L leave you with a +₹25.9L net position — but a ₹84L overdue receivable bucket (Vertex, Orbit) means a real liquidity gap by Aug 18 if collections slip. Recommendation: finance FLW-1458 (+₹25.2L) to stay above the ₹50L safety floor.",
      chips: ['Show cash flow forecast', 'Finance FLW-1458', 'Which customer pays late?'],
    }),
  },
  {
    match: /customer.*late|who pays late|late.*payer/i,
    reply: () => ({
      content:
        'Three customers are pulling your DSO up:\n• Sundara Hotels — 88 days avg (risk: high)\n• Orbit Logistics — 71 days avg (risk: elevated)\n• Vertex Industries — 67 days avg (risk: moderate, ₹52.4L outstanding)\nCrestline (45d) and Nimbus (38d) are your most reliable payers. I can auto-send WhatsApp reminders to the top 3 today.',
      chips: ['Send reminders now', 'Show customer risk scores', 'Suggest financing for Vertex'],
    }),
  },
  {
    match: /finance.*invoice|should i finance|invoice.*#?\s*\d+|flw-?\d+/i,
    reply: () => ({
      content:
        'Invoice FLW-1458 (Vertex Industries, ₹28.08L) is your best financing candidate:\n• Buyer payment probability: 94%\n• Best offer: HDFC @ 10.4%, ₹24.82L net advance\n• Cost of funds for 60 days: ~₹1.46L\n• Net benefit vs. waiting 67 days: +₹23.4L liquidity to cover payroll & GST due Aug 20.\nVerdict: finance it. Want me to list it on the marketplace?',
      chips: ['List FLW-1458 now', 'Compare all offers', 'Show forecast with financing'],
    }),
  },
  {
    match: /afford|can i buy|large purchase|₹\d+\s*l/i,
    reply: () => ({
      content:
        'A ₹40L purchase today would drop your cash position from ₹1.84Cr to ₹1.44Cr — still above the ₹50L safety floor, but it would tighten your Aug 18 buffer to ₹4L. Given the predicted cash gap, I would recommend either (a) staging the purchase across 2 months, or (b) financing FLW-1472 (+₹20L) first to preserve working capital headroom.',
      chips: ['Stage across 2 months', 'Finance FLW-1472 first', 'Show working capital impact'],
    }),
  },
  {
    match: /supplier.*pay first|which supplier|pay.*first/i,
    reply: () => ({
      content:
        'Pay Apex Machinery (AM-2207, ₹12.8L) first — it is 8 days overdue and critical priority, affecting your vendor risk score. Then Marlin Yarns (₹8.6L, due in 10d, 1.5% early discount = ₹12,900 saved). Delay Trident Supplies (TR-9982, ₹14.2L) by 5 days — within terms and unlocks buffer for the Aug 18 gap.',
      chips: ['Schedule Apex payment', 'Apply Marlin early discount', 'Show payable planner'],
    }),
  },
  {
    match: /credit score|my score|risk/i,
    reply: () => ({
      content:
        "Your FlowOS Credit Score is 742/900 (Moderate, top 38% of your segment). Breakdown:\n• Financial Health: 78/100\n• Cash Flow Stability: 71/100\n• Invoice Reliability: 84/100\n• Credit Utilization: 68% (healthy)\n• Repayment Prediction: 88% on-time\nLifting DSO from 54→48 days would push your score to ~780 and unlock better lender rates.",
      chips: ['Improve my score', 'See score factors', 'Compare lender rates'],
    }),
  },
  {
    match: /report|generate.*report|p&l|balance sheet/i,
    reply: () => ({
      content:
        'I can generate any of these now:\n• P&L Statement (Jul 2025)\n• Balance Sheet (as of Jul 2025)\n• Cash Flow Statement (Jul 2025)\n• Receivable/Payable Aging\n• GST Reconciliation\nAll exportable to PDF or Excel. Which would you like?',
      chips: ['Generate P&L', 'Generate Balance Sheet', 'Open Reports center'],
    }),
  },
];

export const aiFallback = {
  content:
    "I can help with cash planning, receivables, payables, financing decisions, credit score, vendors, and reports. Try asking about your cash position next month, which customers pay late, or whether to finance a specific invoice.",
  chips: ['How much cash do I need next month?', 'Which customer pays late?', 'Show my credit score'],
};
