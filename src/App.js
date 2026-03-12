import React from "react";

import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar"
import Footer from "./Components/Footer/Footer";
import Signup from "./Components/Loginsignup/signup";
import Signin from "./Components/Loginsignup/Signin";
import ForgotPassword from "./Components/Loginsignup/Forgotpassword";
import ResetPassword from "./Components/Loginsignup/ResetPassword";
import OAuthCallback from "./Components/Loginsignup/OAuthCallback";
import HomePage from "./Components/Homepage/Homepage";
import FindWork from "./Components/Findwork/Findwork";
import TalentPage from "./pages/hire-talent";
import MyProfile from "./pages/MyProfile";
function App() {
  return (
    <div>
    <Navbar/>
    <main>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/talent/*" element={<TalentPage />} />
       <Route path="/" element={<Navigate to="/find-work" />} />

    
        <Route path="/find-work/*" element={<FindWork />} />

    
        <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
    </main>
    <Footer/>
    </div>
  );
}


export default App;
