
import { useChat } from '@/contexts/ChatContext';
import ChatRoomList from './chat/ChatRoomList';
import ChatWindow from './chat/ChatWindow';

const ChatCenter = () => {
  const { state, dispatch } = useChat();

  const handleRoomSelect = (roomId: string) => {
    dispatch({ type: 'SELECT_ROOM', payload: roomId });
  };

  const selectedRoomData = state.rooms.find(room => room.id === state.selectedRoom);

  return (
    <div className="h-[600px] flex border rounded-lg overflow-hidden bg-white shadow-lg">
      <ChatRoomList
        rooms={state.rooms}
        selectedRoomId={state.selectedRoom}
        onRoomSelect={handleRoomSelect}
      />
      <ChatWindow
        selectedRoom={selectedRoomData}
        messages={state.messages || []}
      />
    </div>
  );
};

export default ChatCenter;
