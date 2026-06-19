import React from 'react';
import { useDeliverOrder } from '../services/freelancerHooks';

const DeliverablesPage = () => {
  const deliverOrder = useDeliverOrder();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Deliverables</h1>
      <p className="text-ink-secondary">Upload Deliverables, Track Deliveries, Version History.</p>
      <div className="mt-8 p-8 border border-dashed border-border rounded-xl flex items-center justify-center bg-surface-muted/50">
        <p className="text-sm font-medium text-ink-secondary">This module is currently under development.</p>
      </div>
    </div>
  );
};

export default DeliverablesPage;
