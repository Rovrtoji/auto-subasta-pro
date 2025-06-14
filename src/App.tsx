
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInventory from "./pages/admin/Inventory";
import AdminCalculator from "./pages/admin/Calculator";
import AdminChatCenter from "./pages/admin/ChatCenter";
import LoginAdmin from "./pages/admin/LoginAdmin";
import RegisterExecutive from "./pages/admin/RegisterExecutive";
import Auctions from "./pages/Auctions";
import VentaDirecta from "./pages/VentaDirecta";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import FloatingChatButton from "./components/FloatingChatButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/venta-directa" element={<VentaDirecta />} />
          <Route path="/subastas" element={<Auctions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/register" element={<RegisterExecutive />} />
          <Route path="/admin/inventario" element={<AdminInventory />} />
          <Route path="/admin/calculadora" element={<AdminCalculator />} />
          <Route path="/admin/chat" element={<AdminChatCenter />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingChatButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
