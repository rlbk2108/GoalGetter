import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Registration";
import SuccessfulRegistration from "./pages/SuccessfulRegistration";
import Header from './components/header'

function App() {
  return (
    <div className="App">
        <Router>
                <Header/>
                <Routes>
                    <Route path="/successful_registration" element={<SuccessfulRegistration />} />
                    <Route path="/registration" element={<Register />} />
                </Routes>
        </Router>
    </div>
  );
}

export default App;