
import { MessageCircle } from 'lucide-react';

interface Message {
  id?: number;
  text: string;
  sender: 'admin' | 'client';
  timestamp: string;
}

interface Props {
  clientName: string;
  messages: Message[];
}

const FloatingChatMessageList = ({ clientName, messages }: Props) => {
  if (messages.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p className="text-sm">¡Hola {clientName}!</p>
        <p className="text-xs mt-2">Escribe tu mensaje y un asesor te atenderá pronto.</p>
      </div>
    );
  }
  return (
    <>
      {messages.map(msg => (
        <div
          key={msg.id ?? Math.random()}
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
      ))}
    </>
  );
};

export default FloatingChatMessageList;
