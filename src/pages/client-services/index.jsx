import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ClientServicesLayout from "./ClientServicesLayout";
import ClientOverview from "./ClientOverview";
import ClientProfilePage from "./ClientProfilePage";
import CreateJob from "./CreateJob";
import ClientJobDetail from "./ClientJobDetail";
import MyJobs from "./MyJobs";

export default function ClientServicesRoutes() {
  return (
    <Routes>
      <Route element={<ClientServicesLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<ClientOverview />} />
        <Route path="profile" element={<ClientProfilePage />} />
        <Route path="create-job" element={<CreateJob />} />
        <Route path="my-jobs" element={<MyJobs />} />
        <Route path="jobs/:jobId" element={<ClientJobDetail />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>
    </Routes>
  );
}
