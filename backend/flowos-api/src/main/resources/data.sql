-- 1. Ensure table constraints and default timestamps
CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    opening_cash_balance NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    cash_balance NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    credit_score INT DEFAULT 700,
    annual_revenue NUMERIC(18, 2) DEFAULT 0.00,
    total_assets NUMERIC(18, 2) DEFAULT 0.00,
    total_liabilities NUMERIC(18, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clean and seed a master company row if none exists
INSERT INTO companies (
    company_name,
    opening_cash_balance,
    cash_balance,
    credit_score,
    annual_revenue,
    total_assets,
    total_liabilities,
    created_at,
    updated_at
)
SELECT 'FlowOS Demo Company', 0.00, 0.00, 750, 118000.00, 0.00, 522000.00, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM companies);



-- 1. Invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_id BIGINT;
UPDATE invoices SET company_id = (SELECT id FROM companies ORDER BY id ASC LIMIT 1) WHERE company_id IS NULL;
ALTER TABLE invoices ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS fk_invoices_company;
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);

-- 2. Payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS company_id BIGINT;
UPDATE payments SET company_id = (SELECT id FROM companies ORDER BY id ASC LIMIT 1) WHERE company_id IS NULL;
ALTER TABLE payments ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS fk_payments_company;
ALTER TABLE payments ADD CONSTRAINT fk_payments_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_payments_company_id ON payments(company_id);

-- 3. Expenses table
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS company_id BIGINT;
UPDATE expenses SET company_id = (SELECT id FROM companies ORDER BY id ASC LIMIT 1) WHERE company_id IS NULL;
ALTER TABLE expenses ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE expenses DROP CONSTRAINT IF EXISTS fk_expenses_company;
ALTER TABLE expenses ADD CONSTRAINT fk_expenses_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_expenses_company_id ON expenses(company_id);



-- 1. Link Invoices to Company
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_id BIGINT;
UPDATE invoices SET company_id = (SELECT id FROM companies ORDER BY id ASC LIMIT 1) WHERE company_id IS NULL;
ALTER TABLE invoices ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS fk_invoices_company;
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);

-- 2. Link Payments to Company
ALTER TABLE payments ADD COLUMN IF NOT EXISTS company_id BIGINT;
UPDATE payments SET company_id = (SELECT id FROM companies ORDER BY id ASC LIMIT 1) WHERE company_id IS NULL;
ALTER TABLE payments ALTER COLUMN company_id SET NOT NULL;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS fk_payments_company;
ALTER TABLE payments ADD CONSTRAINT fk_payments_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_payments_company_id ON payments(company_id);

-- 3. Link Expenses to Company (already has column, ensure backfilled and indexed)
UPDATE expenses SET company_id = (SELECT id FROM companies ORDER BY id ASC LIMIT 1) WHERE company_id IS NULL;
ALTER TABLE expenses ALTER COLUMN company_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_expenses_company_id ON expenses(company_id);