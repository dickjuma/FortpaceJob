import React from 'react';
import AuditLogViewer from '../../components/audit/AuditLogViewer';

export default function SecurityAuditPage() {
  return (
    <AuditLogViewer
      moduleFilter="AUTH,PROFILE,SECURITY"
      title="Security & Identity Audit"
      description="Comprehensive trail of authentication events, profile updates, verification actions, and security interventions."
    />
  );
}
