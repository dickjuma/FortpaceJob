import React from 'react';
import AuditLogViewer from '../components/audit/AuditLogViewer';

export default function AdminModerationDashboard() {
  return (
    <div className="space-y-8">
      <AuditLogViewer
        moduleFilter="FRAUD"
        title="Moderation Command Center"
        description="Live platform moderation and incident audit logs for flagged jobs, accounts, and compliance events."
      />
    </div>
  );
}
