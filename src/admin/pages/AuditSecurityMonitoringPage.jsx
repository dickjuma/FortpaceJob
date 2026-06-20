import React from 'react';
import AuditLogViewer from '../components/audit/AuditLogViewer';

export default function AuditSecurityMonitoringPage() {
  return (
    <div className="space-y-8">
      <AuditLogViewer
        moduleFilter="SECURITY"
        title="Security & Audit Monitoring"
        description="Live backend-driven event monitoring for platform security, authentication, and system integrity."
      />
    </div>
  );
}

