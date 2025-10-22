import React from "react";
import HomePage from "./Components/Homepage/Homepage";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar"
import Footer from "./Components/Footer/Footer";

function App() {
  return (
    <div>
    <Navbar/>
    <main>
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
    </main>
    <Footer/>
    </div>
  );
}


export default App;
