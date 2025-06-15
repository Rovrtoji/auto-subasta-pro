
import { createContext, useContext, useReducer, ReactNode } from 'react';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'admin' | 'client';
  timestamp: string;
  clientName: string;
}

interface ChatRoom {
  id: number;
  clientName: string;
  lastMessage: string;
  timestamp: string;
  status: 'active' | 'waiting' | 'resolved';
  unreadCount: number;
  messages: ChatMessage[];
}

interface ChatState {
  rooms: ChatRoom[];
  selectedRoom: number | null;
  isFloatingChatOpen: boolean;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: { roomId: number; message: Omit<ChatMessage, 'id'> } }
  | { type: 'CREATE_ROOM'; payload: { clientName: string; initialMessage: string } }
  | { type: 'SELECT_ROOM'; payload: number | null }
  | { type: 'UPDATE_ROOM_STATUS'; payload: { roomId: number; status: 'active' | 'waiting' | 'resolved' } }
  | { type: 'MARK_ROOM_READ'; payload: number }
  | { type: 'TOGGLE_FLOATING_CHAT'; payload?: boolean }
  | { type: 'SET_UNREAD_COUNT'; payload: { roomId: number; count: number } };

const initialState: ChatState = {
  rooms: [],
  selectedRoom: null,
  isFloatingChatOpen: false,
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'CREATE_ROOM': {
      const newRoom: ChatRoom = {
        id: Date.now(),
        clientName: action.payload.clientName,
        lastMessage: action.payload.initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'waiting',
        unreadCount: 1,
        messages: [{
          id: Date.now(),
          text: action.payload.initialMessage,
          sender: 'client',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          clientName: action.payload.clientName
        }]
      };
      return {
        ...state,
        rooms: [...state.rooms, newRoom]
      };
    }

    case 'ADD_MESSAGE': {
      return {
        ...state,
        rooms: state.rooms.map(room => {
          if (room.id === action.payload.roomId) {
            const newMessage: ChatMessage = {
              id: Date.now(),
              ...action.payload.message
            };
            return {
              ...room,
              messages: [...room.messages, newMessage],
              lastMessage: action.payload.message.text,
              timestamp: action.payload.message.timestamp,
              status: action.payload.message.sender === 'admin' ? 'active' : 'waiting',
              unreadCount: action.payload.message.sender === 'client' ? room.unreadCount + 1 : room.unreadCount
            };
          }
          return room;
        })
      };
    }

    case 'SELECT_ROOM':
      return {
        ...state,
        selectedRoom: action.payload
      };

    case 'UPDATE_ROOM_STATUS':
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.roomId
            ? { ...room, status: action.payload.status }
            : room
        )
      };

    case 'MARK_ROOM_READ':
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload
            ? { ...room, unreadCount: 0 }
            : room
        )
      };

    case 'TOGGLE_FLOATING_CHAT':
      return {
        ...state,
        isFloatingChatOpen: action.payload !== undefined ? action.payload : !state.isFloatingChatOpen
      };

    case 'SET_UNREAD_COUNT':
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.roomId
            ? { ...room, unreadCount: action.payload.count }
            : room
        )
      };

    default:
      return state;
  }
};

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
} | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export type { ChatMessage, ChatRoom };
