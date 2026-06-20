import React from 'react';
import AuditLogViewer from '../components/audit/AuditLogViewer';

export default function ProposalAuditLogsPage() {
  return (
    <div className="space-y-8">
      <AuditLogViewer
        moduleFilter="PROPOSAL"
        title="Proposal Audit Logs"
        description="Live proposal lifecycle and moderation audit data directly from the backend."
      />
    </div>
  );
}

