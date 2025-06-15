
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VentaDirecta from "./pages/VentaDirecta";
import Auctions from "./pages/Auctions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import Inventory from "./pages/admin/Inventory";
import ActiveAuctions from "./pages/admin/ActiveAuctions";
import AuctionInventory from "./pages/admin/AuctionInventory";
import ChatCenter from "./pages/admin/ChatCenter";
import Calculator from "./pages/admin/Calculator";
import LoginAdmin from "./pages/admin/LoginAdmin";
import RegisterExecutive from "./pages/admin/RegisterExecutive";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/venta-directa" element={<VentaDirecta />} />
          <Route path="/subastas" element={<Auctions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/active-auctions" element={<ActiveAuctions />} />
          <Route path="/admin/auction-inventory" element={<AuctionInventory />} />
          <Route path="/admin/chat-center" element={<ChatCenter />} />
          <Route path="/admin/calculator" element={<Calculator />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/register" element={<RegisterExecutive />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
