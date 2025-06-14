
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FloatingChatButton from './components/FloatingChatButton';

const queryClient = new QueryClient();

// Lazy load components
const Index = lazy(() => import('./pages/Index'));
const VentaDirecta = lazy(() => import('./pages/VentaDirecta'));
const Auctions = lazy(() => import('./pages/Auctions'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminInventory = lazy(() => import('./pages/admin/Inventory'));
const AdminActiveAuctions = lazy(() => import('./pages/admin/ActiveAuctions'));
const AdminChatCenter = lazy(() => import('./pages/admin/ChatCenter'));
const AdminCalculator = lazy(() => import('./pages/admin/Calculator'));
const AdminLogin = lazy(() => import('./pages/admin/LoginAdmin'));
const AdminRegisterExecutive = lazy(() => import('./pages/admin/RegisterExecutive'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-automotive-blue"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/venta-directa" element={<VentaDirecta />} />
                <Route path="/subastas" element={<Auctions />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/inventario" element={<AdminInventory />} />
                <Route path="/admin/subastas" element={<AdminActiveAuctions />} />
                <Route path="/admin/chat" element={<AdminChatCenter />} />
                <Route path="/admin/calculadora" element={<AdminCalculator />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/registro-ejecutivo" element={<AdminRegisterExecutive />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <FloatingChatButton />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
