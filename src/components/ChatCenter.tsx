import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Users, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/contexts/ChatContext';

const ChatCenter = () => {
  const { state, dispatch, refreshRooms, refreshMessages, sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Al seleccionar un room, cargar sus mensajes de Supabase
  useEffect(() => {
    if (state.selectedRoom) {
      refreshMessages(state.selectedRoom);
    }
  }, [state.selectedRoom, refreshMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.selectedRoom]);

  const handleSendMessage = async () => {
    if (!message.trim() || !state.selectedRoom) return;
    const selectedRoomData = state.rooms.find(room => room.id === state.selectedRoom);
    if (!selectedRoomData) return;

    await sendMessage(state.selectedRoom, message, 'admin', selectedRoomData.clientName);
    setMessage('');
    await refreshMessages(state.selectedRoom);
  };

  const handleRoomSelect = (roomId: string) => {
    dispatch({ type: 'SELECT_ROOM', payload: roomId });
    refreshMessages(roomId);
  };

  const handleMarkResolved = () => {
    if (!state.selectedRoom) return;
    
    dispatch({
      type: 'UPDATE_ROOM_STATUS',
      payload: {
        roomId: state.selectedRoom,
        status: 'resolved'
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'waiting': return 'bg-yellow-500';
      case 'resolved': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'waiting': return 'Esperando';
      case 'resolved': return 'Resuelto';
      default: return 'Desconocido';
    }
  };

  const selectedRoomData = state.rooms.find(room => room.id === state.selectedRoom);
  const currentMessages = state.messages || [];

  return (
    <div className="h-[600px] flex border rounded-lg overflow-hidden bg-white shadow-lg">
      {/* Lista de Chats */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b bg-white">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-automotive-blue" />
            Chats Activos
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {state.rooms.filter(room => room.status === 'waiting').length} esperando respuesta
          </p>
        </div>
        
        <ScrollArea className="h-[calc(600px-80px)]">
          <div className="p-2">
            {state.rooms.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay chats activos</p>
                <p className="text-xs mt-1">Los nuevos chats aparecerán aquí</p>
              </div>
            ) : (
              state.rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleRoomSelect(room.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    state.selectedRoom === room.id 
                      ? 'bg-automotive-blue text-white' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{room.clientName}</h4>
                    <div className="flex items-center gap-2">
                      {room.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                          {room.unreadCount}
                        </Badge>
                      )}
                      <span className="text-xs opacity-75">{room.timestamp}</span>
                    </div>
                  </div>
                  <p className={`text-xs truncate ${
                    state.selectedRoom === room.id ? 'text-gray-200' : 'text-gray-600'
                  }`}>
                    {room.lastMessage}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(room.status)}`} />
                    <span className={`text-xs ${
                      state.selectedRoom === room.id ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                      {getStatusText(room.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col">
        {state.selectedRoom && selectedRoomData ? (
          <>
            {/* Header del Chat */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedRoomData.clientName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedRoomData.status)}`} />
                    <span className="text-sm text-gray-600">
                      {getStatusText(selectedRoomData.status)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkResolved}
                  disabled={selectedRoomData.status === 'resolved'}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Marcar Resuelto
                </Button>
              </div>
            </div>

            {/* Mensajes */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === 'admin'
                          ? 'bg-automotive-blue text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'admin' ? 'text-gray-200' : 'text-gray-500'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input de Mensaje */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <Input
                  placeholder="Escribe tu respuesta..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-automotive-blue hover:bg-automotive-blue/80"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Selecciona un chat</p>
              <p className="text-sm mt-1">Elige una conversación para comenzar a responder</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatCenter;
