import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
