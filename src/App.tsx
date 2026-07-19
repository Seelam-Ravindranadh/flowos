import { useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { Landing } from './components/Landing';
import type { NavKey } from './lib/nav';

import { Dashboard } from './pages/Dashboard';
import { Assistant } from './pages/Assistant';
import { Forecast } from './pages/Forecast';
import { Receivables } from './pages/Receivables';
import { Payables } from './pages/Payables';
import { InvoiceFinancing } from './pages/InvoiceFinancing';
import { PurchaseOrders } from './pages/PurchaseOrders';
import { Vendors } from './pages/Vendors';
import { Customers } from './pages/Customers';
import { CreditScore } from './pages/CreditScore';
import { FundingMarketplace } from './pages/FundingMarketplace';
import { Analytics } from './pages/Analytics';
import { Expenses } from './pages/Expenses';
import { Inventory } from './pages/Inventory';
import { Tax } from './pages/Tax';
import { Banking } from './pages/Banking';
import { Payments } from './pages/Payments';
import { Documents } from './pages/Documents';
import { Notifications } from './pages/Notifications';
import { Workflows } from './pages/Workflows';
import { Fraud } from './pages/Fraud';
import { Reports } from './pages/Reports';
import { Integrations } from './pages/Integrations';

type View = 'landing' | NavKey;

function App() {
  const [view, setView] = useState<View>('landing');

  if (view === 'landing') {
    return <Landing onEnter={() => setView('dashboard')} />;
  }

  const active = view as NavKey;
  const navigate = (k: string) => {
    setView(k as View);
    window.scrollTo({ top: 0 });
  };

  return (
    <AppLayout active={active} onNavigate={navigate}>
      <PageRouter view={active} onNavigate={navigate} />
    </AppLayout>
  );
}

function PageRouter({ view, onNavigate }: { view: NavKey; onNavigate: (k: string) => void }) {
  switch (view) {
    case 'dashboard': return <Dashboard onNavigate={onNavigate} />;
    case 'assistant': return <Assistant onNavigate={onNavigate} />;
    case 'forecast': return <Forecast />;
    case 'receivables': return <Receivables />;
    case 'payables': return <Payables />;
    case 'invoices': return <InvoiceFinancing />;
    case 'purchase_orders': return <PurchaseOrders />;
    case 'vendors': return <Vendors />;
    case 'customers': return <Customers />;
    case 'credit_score': return <CreditScore />;
    case 'funding_marketplace': return <FundingMarketplace />;
    case 'analytics': return <Analytics />;
    case 'expenses': return <Expenses />;
    case 'inventory': return <Inventory />;
    case 'tax': return <Tax />;
    case 'banking': return <Banking />;
    case 'payments': return <Payments />;
    case 'documents': return <Documents />;
    case 'notifications': return <Notifications />;
    case 'workflows': return <Workflows />;
    case 'fraud': return <Fraud />;
    case 'reports': return <Reports />;
    case 'integrations': return <Integrations />;
    default: return <Dashboard onNavigate={onNavigate} />;
  }
}

export default App;
