import { TradingDashboard } from "@/components/TradingDashboard";
import { Routes, Route } from 'react-router-dom';

const Index = () => {
  return (
    <Routes>
      <Route path="/*" element={<TradingDashboard />} />
    </Routes>
  );
};

export default Index;
