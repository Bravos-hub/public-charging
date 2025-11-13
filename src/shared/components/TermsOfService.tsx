import React from 'react';
import { FileText } from 'lucide-react';

export function TermsOfService(): React.ReactElement {
  return (
    <div className="prose prose-slate max-w-none">
      <h3>1. Introduction</h3>
      <p>Welcome to EVzone. By using our services you agree to these terms…</p>
      <h3>2. Accounts</h3>
      <p>Users are responsible for maintaining the security of their account…</p>
      <h3>3. Charging Sessions</h3>
      <p>Use compatible connectors and follow on-site safety guidelines…</p>
      <h3>4. Payments & Refunds</h3>
      <p>Prepaid and postpaid terms, fees, and refund policies…</p>
      <h3>5. Privacy</h3>
      <p>We process data according to our Privacy Policy…</p>
      <h3>6. Liability</h3>
      <p>EVzone is not liable for…</p>
      <h3>7. Changes</h3>
      <p>We may update these terms. Continued use means acceptance…</p>
    </div>
  );
}

