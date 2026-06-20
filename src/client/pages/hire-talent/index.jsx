import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TalentHome from "./TalentHome";
import TalentProfile from "./TalentProfile";
import CategoryPage from "./category";
import TalentRequest from "./TalentRequest";
import "./talent.css";

const TalentRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<TalentHome />} />
      <Route path="request" element={<TalentRequest />} />
      <Route path="categories/:slug" element={<CategoryPage />} />
      <Route path=":id" element={<TalentProfile />} />
      <Route path="*" element={<Navigate to="" />} />
    </Routes>
  );
};

export default TalentRoutes;
