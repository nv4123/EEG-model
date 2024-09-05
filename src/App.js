import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./components/home";
import Result from "./components/result";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/result" element={<Result />} />

      {/* Add other routes here if needed */}
    </Routes>
  </Router>
);

export default App;
