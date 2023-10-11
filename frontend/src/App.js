import "./App.css";
import React from "react";
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Register from "./pages/Registration";
import SuccessfulRegistration from "./pages/SuccessfulRegistration";
import Header from './components/header'
import Home from "./pages/Home";
import Goals from "./pages/Goals";


function App() {
  return (
    <BrowserRouter>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/registration" element={<Register />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/successful_registration" element={<SuccessfulRegistration />} />
                </Routes>
    </BrowserRouter>

  );
}

export default App;


