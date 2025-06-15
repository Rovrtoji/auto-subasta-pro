
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatRoom } from '@/contexts/ChatContext';
import { MessageCircle, Users } from 'lucide-react';

interface Props {
  rooms: ChatRoom[];
  selectedRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
}

const ChatRoomList = ({ rooms, selectedRoomId, onRoomSelect }: Props) => {
  return (
    <div className="w-1/3 border-r bg-gray-50">
      <div className="p-4 border-b bg-white">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-automotive-blue" />
          Chats
        </h3>
      </div>
      
      <ScrollArea className="h-[calc(600px-65px)]">
        <div className="p-2">
          {rooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500 mt-10">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay chats</p>
              <p className="text-xs mt-1">Los nuevos chats aparecerán aquí</p>
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => onRoomSelect(room.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  selectedRoomId === room.id 
                    ? 'bg-automotive-blue text-white' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{room.clientName}</h4>
                  <span className="text-xs opacity-75">
                    {new Date(room.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatRoomList;
