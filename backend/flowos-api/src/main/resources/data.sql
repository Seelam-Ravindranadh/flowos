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

-- 1. Create Funding Requests Table
CREATE TABLE IF NOT EXISTS funding_requests (
    id BIGSERIAL PRIMARY KEY,
    request_number VARCHAR(100) UNIQUE NOT NULL,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    requested_amount NUMERIC(18, 2) NOT NULL,
    approved_amount NUMERIC(18, 2),
    interest_rate DOUBLE PRECISION,
    lender_name VARCHAR(255),
    request_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_funding_requests_company ON funding_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_funding_requests_invoice ON funding_requests(invoice_id);

-- 2. Create Lender Bids Table
CREATE TABLE IF NOT EXISTS lender_bids (
    id BIGSERIAL PRIMARY KEY,
    bid_number VARCHAR(100) UNIQUE NOT NULL,
    funding_request_id BIGINT NOT NULL REFERENCES funding_requests(id) ON DELETE CASCADE,
    lender_name VARCHAR(255) NOT NULL,
    advance_amount NUMERIC(18, 2) NOT NULL,
    discount_rate DOUBLE PRECISION NOT NULL,
    platform_fee NUMERIC(18, 2) NOT NULL,
    net_disbursement NUMERIC(18, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    bid_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lender_bids_request ON lender_bids(funding_request_id);

-- 3. Update Invoice Status Enum check if necessary or verify status values