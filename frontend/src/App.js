import "./App.css";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./pages/Registration";
import Authentication from "./pages/Authentication";
import SuccessfulRegistration from "./pages/SuccessfulRegistration";
import MainWrapper from "./layouts/MainWrapper";
import Home from "./pages/Home";
import Goals from "./pages/Goals";


function App() {
    return (
        <BrowserRouter>
            <MainWrapper>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/registration" element={<Register />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/successful_registration" element={<SuccessfulRegistration />} />
                    <Route path="/login" element={<Authentication />} />
                </Routes>
            </MainWrapper>
        </BrowserRouter>

    );
}

export default App;