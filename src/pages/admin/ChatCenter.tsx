
import { MessageCircle, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '../../components/Header';
import ChatCenter from '../../components/ChatCenter';

const AdminChatCenter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Chat Center Header */}
      <div className="bg-automotive-gradient text-white py-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <MessageCircle className="h-8 w-8" />
                Centro de Chat
              </h1>
              <p className="text-gray-200 mt-2">Atiende a los clientes en tiempo real</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-gray-200">Chats Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-gray-200">Atendidos Hoy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg automotive-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chats Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-xs text-muted-foreground">Esperando respuesta</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg automotive-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chats Activos</CardTitle>
              <MessageCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">2</div>
              <p className="text-xs text-muted-foreground">En conversación</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg automotive-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resueltos Hoy</CardTitle>
              <Users className="h-4 w-4 text-automotive-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-automotive-blue">12</div>
              <p className="text-xs text-muted-foreground">Satisfacción: 98%</p>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="border-0 shadow-lg automotive-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-automotive-blue" />
              <span>Interfaz de Chat</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChatCenter />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminChatCenter;
