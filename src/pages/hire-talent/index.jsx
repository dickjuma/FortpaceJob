import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TalentHome from "./TalentHome";
import TalentProfile from "./TalentProfile";
import CategoryPage from "./category";
import "./talent.css";

const TalentRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<TalentHome />} />
      <Route path="request" element={<Navigate to="/client-services/create-job" replace />} />
      <Route path="categories/:slug" element={<CategoryPage />} />
      <Route path=":id" element={<TalentProfile />} />
      <Route path="*" element={<Navigate to="" />} />
    </Routes>
  );
};

export default TalentRoutes;
