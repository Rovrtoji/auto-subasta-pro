
import { MessageCircle, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '../../components/Header';
import AdminHeader from '../../components/AdminHeader';
import ChatCenter from '../../components/ChatCenter';
import { useChat } from '@/contexts/ChatContext';

const AdminChatCenter = () => {
  const { state } = useChat();

  const activeChats = state.rooms.filter(room => room.status === 'active').length;
  const waitingChats = state.rooms.filter(room => room.status === 'waiting').length;
  const resolvedToday = state.rooms.filter(room => room.status === 'resolved').length;
  const totalUnread = state.rooms.reduce((total, room) => total + room.unreadCount, 0);

  const headerStats = [
    { label: 'Chats Activos', value: activeChats },
    { label: 'Atendidos Hoy', value: resolvedToday },
    { label: 'Satisfacción', value: '98%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <AdminHeader 
        title="Centro de Chat"
        subtitle="Atiende a los clientes en tiempo real"
        stats={headerStats}
      />

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg automotive-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chats Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{waitingChats}</div>
              <p className="text-xs text-muted-foreground">
                {totalUnread > 0 ? `${totalUnread} mensajes sin leer` : 'Todos los mensajes leídos'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg automotive-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chats Activos</CardTitle>
              <MessageCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeChats}</div>
              <p className="text-xs text-muted-foreground">En conversación</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg automotive-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resueltos Hoy</CardTitle>
              <Users className="h-4 w-4 text-automotive-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-automotive-blue">{resolvedToday}</div>
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
