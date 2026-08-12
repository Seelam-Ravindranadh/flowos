export interface DashboardResponse {
    summary: DashboardSummary;
    cashFlow: CashFlow[];
    businessHealth: BusinessHealth;
    revenueProfit: RevenueProfit[];
    expenseBreakdown: ExpenseBreakdown[];
    receivableAging: ReceivableAging[];
    recentInvoices: Invoice[];
    fundingRequests: FundingRequest[];
    aiInsights: string[];
}

export interface DashboardSummary{
    totalRevenue:number;
    cashBalance:number;
    totalReceivables:number;
    totalPayables:number;
    overdueInvoices:number;
    creditScore:number;
    revenueGrowth:number;
    expenseGrowth:number;
}

export interface CashFlow{
    month:string;
    actual:number;
    forecast:number;
}

export interface BusinessHealth{
    score:number;
    status:string;
    cashRunway:string;
    creditScore:number;
}

export interface RevenueProfit{
    month:string;
    revenue:number;
    profit:number;
    profitMargin:number;
}

export interface ExpenseBreakdown{
    category:string;
    amount:number;
    percentage:number;
}

export interface ReceivableAging{
    agingBucket:string;
    amount:number;
    invoiceCount:number;
}

export interface Invoice{
    invoiceNumber:string;
    customerName:string;
    amount:number;
    invoiceDate:string;
    dueDate:string;
    status:string;
}

export interface FundingRequest{
    requestNumber:string;
    lenderName:string;
    requestedAmount:number;
    approvedAmount:number;
    interestRate:number;
    status:string;
}