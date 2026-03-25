import React from "react";
import ViewRequests from "../Components/Findwork/BuyerRequests/ViewRequests";
import WorkspaceToolLayout from "./WorkspaceToolLayout";

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
