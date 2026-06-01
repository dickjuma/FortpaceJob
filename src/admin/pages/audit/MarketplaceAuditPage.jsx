import React from 'react';
import AuditLogViewer from '../../components/audit/AuditLogViewer';

export default function MarketplaceAuditPage() {
  return (
    <AuditLogViewer
      moduleFilter="JOB,CONTRACT,PROPOSAL,REVIEW"
      title="Marketplace Activity Logs"
      description="Monitoring all job postings, contract negotiations, and community feedback events."
    />
  );
}