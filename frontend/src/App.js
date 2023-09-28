import "./App.css";
import React from "react";
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Register from "./pages/Registration";
import Authentication from "./pages/Authentication";
import SuccessfulRegistration from "./pages/SuccessfulRegistration";
import Header from './components/header'
import MainWrapper from "./layouts/MainWrapper";
import Home from "./pages/Home";


function App() {
  return (
    <BrowserRouter>
        <MainWrapper>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/registration" element={<Register />} />
                    <Route path="/successful_registration" element={<SuccessfulRegistration />} />
                    <Route path="/login" element={<Authentication />} />
                </Routes>
        </MainWrapper>
    </BrowserRouter>

  );
}

export default App;


