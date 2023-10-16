import "./App.css";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./pages/Registration";
import Authentication from "./pages/Authentication";
import SuccessfulRegistration from "./pages/SuccessfulRegistration";
import MainWrapper from "./layouts/MainWrapper";
import Home from "./pages/Home";
import Goals from "./pages/Goals";
import { useParams } from "react-router-dom";
import EditGoal from "./components/EditGoalPage"; // Import the EditGoal component

function App() {
    return (
        <BrowserRouter>
            <MainWrapper>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/registration" element={<Register />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/goals/edit/:id" element={<EditGoalPage />} />
                    <Route path="/successful_registration" element={<SuccessfulRegistration />} />
                    <Route path="/login" element={<Authentication />} />
                </Routes>
            </MainWrapper>
        </BrowserRouter>
    );
}

export default App;

// Create a new component for the EditGoal page
function EditGoalPage() {
    // Extract the goalId from the route parameters
    const { id } = useParams();

    return <EditGoal goalId={id} />;
}