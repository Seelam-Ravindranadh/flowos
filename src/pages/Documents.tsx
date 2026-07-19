import { motion } from 'framer-motion';
import { Cloud, Download, FileStack, FileText, Folder, Lock, Plus, Search, Shield, Upload } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AiPill } from '../components/InsightCard';

const folders = [
  { name: 'Invoices', count: 248, size: '184 MB', icon: FileText, color: '#1E78FF' },
  { name: 'Purchase Orders', count: 86, size: '42 MB', icon: FileStack, color: '#06B6D4' },
  { name: 'Contracts', count: 34, size: '128 MB', icon: Folder, color: '#10B981' },
  { name: 'GST Returns', count: 18, size: '12 MB', icon: FileStack, color: '#F59E0B' },
  { name: 'PAN & KYC', count: 12, size: '8 MB', icon: Shield, color: '#8B5CF6' },
  { name: 'Bank Statements', count: 64, size: '36 MB', icon: FileText, color: '#64748B' },
];

const recent = [
  { name: 'FLW-1458_signed.pdf', folder: 'Invoices', size: '248 KB', time: '2h ago' },
  { name: 'GSTR-3B_Jul2025.pdf', folder: 'GST Returns', size: '1.2 MB', time: '6h ago' },
  { name: 'Trident_MSA_v3.pdf', folder: 'Contracts', size: '3.4 MB', time: '1d ago' },
  { name: 'PAN_AuroraTextiles.pdf', folder: 'PAN & KYC', size: '180 KB', time: '3d ago' },
  { name: 'PO-3301_Trident.pdf', folder: 'Purchase Orders', size: '420 KB', time: '4d ago' },
];

export function Documents() {
  return (
    <div className="space-y-6">
      <PageHeader title="Document Center" subtitle="Digital vault for invoices, contracts, GST, PAN & KYC" badge={<AiPill>Encrypted Vault</AiPill>} actions={<Button size="sm" icon={<Upload size={14} />}>Upload</Button>} />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Total Documents</div><div className="mt-1 font-display text-xl font-bold tabular-nums">462</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Storage Used</div><div className="mt-1 font-display text-xl font-bold tabular-nums">410 MB</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Vault Encryption</div><div className="mt-1 font-display text-xl font-bold text-success-600 dark:text-success-400">AES-256</div></Card>
        <Card className="p-4"><div className="text-[11px] text-slate-500 dark:text-slate-400">Retention Policy</div><div className="mt-1 font-display text-xl font-bold">7 yrs</div></Card>
      </div>

      {/* Folders */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {folders.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div key={f.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover className="p-5">
                <div className="flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `${f.color}1a`, color: f.color }}><Icon size={20} /></div>
                  <Lock size={14} className="text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="mt-3 font-display text-[14px] font-semibold text-slate-900 dark:text-white">{f.name}</h3>
                <div className="mt-1 flex items-center gap-3 text-[11.5px] text-slate-500 dark:text-slate-400">
                  <span>{f.count} files</span><span>·</span><span>{f.size}</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent files */}
      <Card>
        <CardHeader title="Recent Documents" icon={<FileStack size={16} />} action={
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-white/10 dark:bg-white/5">
            <Search size={13} className="text-slate-400" />
            <input placeholder="Search vault…" className="w-32 bg-transparent text-[12px] outline-none placeholder:text-slate-400" />
          </div>
        } />
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {recent.map((f) => (
              <div key={f.name} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/5"><FileText size={16} /></div>
                  <div>
                    <div className="text-[12.5px] font-medium text-slate-800 dark:text-white">{f.name}</div>
                    <div className="text-[11px] text-slate-400">{f.folder} · {f.size} · {f.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"><Download size={14} /></button>
                  <Button size="sm" variant="ghost">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gradient-to-br from-brand-600 to-accent-600 text-white">
        <CardBody className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Cloud size={24} />
            <div>
              <h3 className="font-display text-base font-semibold">All documents encrypted & audit-logged</h3>
              <p className="text-[12.5px] text-white/85">AES-256 at rest · TLS 1.3 in transit · 7-year retention · role-based access</p>
            </div>
          </div>
          <Button variant="secondary" className="!bg-white !text-brand-700">Configure vault</Button>
        </CardBody>
      </Card>
    </div>
  );
}
