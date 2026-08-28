import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import FixedExpenses from "./pages/FixedExpenses";
import RandomExpenses from "./pages/RandomExpenses";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-void">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fixed" element={<FixedExpenses />} />
          <Route path="/random" element={<RandomExpenses />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
