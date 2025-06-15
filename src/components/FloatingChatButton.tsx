
import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';

const FloatingChatButton = () => {
  const { state, dispatch } = useChat();
  const [message, setMessage] = useState('');
  const [clientName, setClientName] = useState('');
  const [step, setStep] = useState<'name' | 'chat'>('name');
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);

  const handleStartChat = () => {
    if (!clientName.trim()) return;
    
    // Crear la sala inmediatamente con un mensaje de bienvenida del cliente
    dispatch({
      type: 'CREATE_ROOM',
      payload: {
        clientName: clientName,
        initialMessage: `Hola, soy ${clientName}. ¿Podrían ayudarme?`
      }
    });
    
    // Encontrar la sala recién creada
    setTimeout(() => {
      const newRoom = state.rooms.find(room => room.clientName === clientName);
      if (newRoom) {
        setCurrentRoomId(newRoom.id);
      }
    }, 100);
    
    setStep('chat');
  };

  const handleSendMessage = () => {
    if (!message.trim() || !clientName) return;
    
    // Buscar la sala actual del cliente
    let targetRoom = state.rooms.find(room => room.clientName === clientName);
    
    if (!targetRoom) {
      // Si no existe la sala, crearla con el primer mensaje
      dispatch({
        type: 'CREATE_ROOM',
        payload: {
          clientName: clientName,
          initialMessage: message
        }
      });
      
      // Establecer el ID de la sala después de crearla
      setTimeout(() => {
        const newRoom = state.rooms.find(room => room.clientName === clientName);
        if (newRoom) {
          setCurrentRoomId(newRoom.id);
        }
      }, 100);
    } else {
      // Si la sala existe, agregar el mensaje
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          roomId: targetRoom.id,
          message: {
            text: message,
            sender: 'client',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            clientName: clientName
          }
        }
      });
      setCurrentRoomId(targetRoom.id);
    }
    
    setMessage('');
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_FLOATING_CHAT', payload: false });
    // No resetear el step y clientName para mantener la conversación
  };

  // Obtener los mensajes de la sala actual
  const currentMessages = currentRoomId 
    ? state.rooms.find(room => room.id === currentRoomId)?.messages || []
    : state.rooms.find(room => room.clientName === clientName)?.messages || [];

  // Contar mensajes no leídos total
  const totalUnreadCount = state.rooms.reduce((total, room) => total + room.unreadCount, 0);

  // Resetear cuando se cierra completamente el chat
  const handleReset = () => {
    setStep('name');
    setClientName('');
    setMessage('');
    setCurrentRoomId(null);
    dispatch({ type: 'TOGGLE_FLOATING_CHAT', payload: false });
  };

  return (
    <>
      {/* Chat Window */}
      {state.isFloatingChatOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 h-96 shadow-2xl animate-fade-in">
          <Card className="h-full flex flex-col">
            <CardHeader className="bg-automotive-blue text-white rounded-t-lg p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {step === 'chat' ? `Chat - ${clientName}` : 'Chat de Ayuda'}
                </CardTitle>
                <div className="flex gap-1">
                  {step === 'chat' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="text-white hover:bg-white/20 p-1 h-8 w-8"
                      title="Nueva conversación"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-white hover:bg-white/20 p-1 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {step === 'name' ? (
                <div className="flex-1 flex flex-col justify-center p-4">
                  <h3 className="text-lg font-semibold mb-4 text-center">¡Bienvenido!</h3>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Para comenzar, por favor ingresa tu nombre:
                  </p>
                  <Input
                    placeholder="Tu nombre..."
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
                    className="mb-4"
                  />
                  <Button
                    onClick={handleStartChat}
                    disabled={!clientName.trim()}
                    className="bg-automotive-blue hover:bg-automotive-blue/80"
                  >
                    Iniciar Chat
                  </Button>
                </div>
              ) : (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {currentMessages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p className="text-sm">¡Hola {clientName}!</p>
                        <p className="text-xs mt-2">Escribe tu mensaje y un asesor te atenderá pronto.</p>
                      </div>
                    ) : (
                      currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg text-sm ${
                              msg.sender === 'admin'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-automotive-blue text-white'
                            }`}
                          >
                            {msg.text}
                            <div className={`text-xs mt-1 ${
                              msg.sender === 'admin' ? 'text-gray-500' : 'text-gray-200'
                            }`}>
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Input Area */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Escribe tu mensaje..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        disabled={!message.trim()}
                        className="bg-automotive-blue hover:bg-automotive-blue/80"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => dispatch({ type: 'TOGGLE_FLOATING_CHAT' })}
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-automotive-blue hover:bg-automotive-blue/80 shadow-lg hover:shadow-xl transition-all duration-300"
        size="icon"
      >
        {state.isFloatingChatOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
              </span>
            )}
          </div>
        )}
      </Button>
    </>
  );
};

export default FloatingChatButton;
