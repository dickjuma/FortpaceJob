import React from "react";
import ViewRequests from "../../freelancer/components/Findwork/BuyerRequests/ViewRequests";
import WorkspaceToolLayout from "../../platform/common/pages/WorkspaceToolLayout";

export default function BuyerRequestsPage() {
  return (
    <WorkspaceToolLayout
      title="Buyer Requests"
      description="Buyer requests now open as their own page so they are separate from the Find Work container."
    >
      <ViewRequests />
    </WorkspaceToolLayout>
  );
}

