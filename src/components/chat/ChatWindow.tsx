
import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatMessage, ChatRoom, useChat } from '@/contexts/ChatContext';
import { MessageCircle, Send } from 'lucide-react';

interface Props {
  selectedRoom: ChatRoom | undefined;
  messages: ChatMessage[];
}

const ChatWindow = ({ selectedRoom, messages }: Props) => {
  const { sendMessage, refreshMessages } = useChat();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRoom) {
      refreshMessages(selectedRoom.id);
    }
  }, [selectedRoom, refreshMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedRoom) return;
    await sendMessage(selectedRoom.id, message, 'admin', selectedRoom.clientName);
    setMessage('');
    await refreshMessages(selectedRoom.id);
  };

  if (!selectedRoom) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Selecciona un chat</p>
          <p className="text-sm mt-1">Elige una conversación para comenzar a responder</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{selectedRoom.clientName}</h3>
            <span className="text-sm text-gray-600">
              Iniciado: {new Date(selectedRoom.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
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
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

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
    </div>
  );
};

export default ChatWindow;
