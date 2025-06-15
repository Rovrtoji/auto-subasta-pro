import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';
import FloatingChatNameForm from './chat/FloatingChatNameForm';
import FloatingChatMessageList from './chat/FloatingChatMessageList';
import FloatingChatMessageInput from './chat/FloatingChatMessageInput';
import { useFloatingChat } from '@/hooks/useFloatingChat';

const FloatingChatButton = () => {
  const {
    state,
    step,
    message,
    setMessage,
    clientName,
    setClientName,
    handleStartChat,
    handleSendMessage,
    handleClose,
    handleReset,
    currentMessages,
    totalUnreadCount
  } = useFloatingChat();

  return (
    <>
      {/* Ventana de chat (flotante) */}
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
                <FloatingChatNameForm
                  clientName={clientName}
                  setClientName={setClientName}
                  handleStartChat={handleStartChat}
                />
              ) : (
                <>
                  {/* Área de mensajes */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <FloatingChatMessageList clientName={clientName} messages={currentMessages}/>
                  </div>
                  {/* Input del mensaje */}
                  <FloatingChatMessageInput
                    message={message}
                    setMessage={setMessage}
                    handleSendMessage={handleSendMessage}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {/* Botón flotante */}
      <Button
        onClick={() => state.dispatch({ type: 'TOGGLE_FLOATING_CHAT' })}
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
