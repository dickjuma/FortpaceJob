import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar"
import Footer from "./Components/Footer/Footer";
import Signup from "./Components/Loginsignup/signup";
import Signin from "./Components/Loginsignup/Signin";
import ForgotPassword from "./Components/Loginsignup/Forgotpassword";
import HomePage from "./Components/Homepage/Homepage";
import Pricing from "./Components/PricingPage/Pricing";
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
      <Route path="/pricing" element={<Pricing />} />
    </Routes>
    </main>
    <Footer/>
    </div>
  );
}


export default App;
