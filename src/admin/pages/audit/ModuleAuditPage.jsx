import React from 'react';
import { useParams } from 'react-router-dom';
import AuditLogViewer from '../../components/audit/AuditLogViewer';

export default function ModuleAuditPage() {
  const { moduleName } = useParams();
  
  const getModuleConfig = (name) => {
    switch (name?.toUpperCase()) {
      case 'FINANCE':
        return {
          filter: 'PAYMENT,BILLING',
          title: 'Financial Audit Ledger',
          description: 'Detailed records of payments, escrow locks, releases, and invoicing activities.'
        };
      case 'MARKETPLACE':
        return {
          filter: 'JOB,CONTRACT,PROPOSAL,REVIEW',
          title: 'Marketplace Operations Log',
          description: 'Tracking the lifecycle of jobs, contracts, and quality control reviews.'
        };
      case 'SECURITY':
        return {
          filter: 'AUTH,PROFILE,FRAUD',
          title: 'Security & Identity Logs',
          description: 'Monitoring authentication events, risk flagging, and profile integrity.'
        };
      case 'DISPUTES':
        return {
          filter: 'DISPUTES',
          title: 'Dispute Resolution Audit',
          description: 'Forensic records of all dispute lifecycle events and arbitration actions.'
        };
      default:
        return {
          filter: name?.toUpperCase(),
          title: `${name} Activity Log`,
          description: `Specific activity stream for the ${name} module.`
        };
    }
  };

  const config = getModuleConfig(moduleName);

  return (
    <AuditLogViewer 
      moduleFilter={config.filter}
      title={config.title}
      description={config.description}
    />
  );
}
