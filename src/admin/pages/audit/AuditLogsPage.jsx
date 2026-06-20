import React from 'react';
import AuditLogViewer from '../../components/audit/AuditLogViewer';

export default function AuditLogsPage() {
  return (
    <AuditLogViewer 
      title="Security Audit Trail"
      description="Real-time immutable ledger of all system interactions, administrative overrides, and high-risk security events."
    />
  );
}
