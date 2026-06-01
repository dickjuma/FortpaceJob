import React from 'react';
import AuditLogViewer from '../../components/audit/AuditLogViewer';

export default function DisputeAuditPage() {
  return (
    <AuditLogViewer
      moduleFilter="DISPUTES"
      title="Dispute Resolution Audit"
      description="Forensic records of all dispute lifecycle events, evidence submissions, and arbitration actions."
    />
  );
}