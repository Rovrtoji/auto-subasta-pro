
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

// Datos de ejemplo para demostrar el funcionamiento
const initialState: ChatState = {
  rooms: [
    {
      id: 1,
      clientName: 'María González',
      lastMessage: 'Hola, necesito información sobre un vehículo',
      timestamp: '14:30',
      status: 'waiting',
      unreadCount: 2,
      messages: [
        {
          id: 1,
          text: 'Hola, necesito información sobre un vehículo',
          sender: 'client',
          timestamp: '14:30',
          clientName: 'María González'
        },
        {
          id: 2,
          text: '¿Podrían ayudarme con los precios?',
          sender: 'client',
          timestamp: '14:31',
          clientName: 'María González'
        }
      ]
    },
    {
      id: 2,
      clientName: 'Carlos Ruiz',
      lastMessage: 'Perfecto, muchas gracias por la información',
      timestamp: '13:45',
      status: 'resolved',
      unreadCount: 0,
      messages: [
        {
          id: 3,
          text: '¿Tienen Toyota Corolla disponible?',
          sender: 'client',
          timestamp: '13:40',
          clientName: 'Carlos Ruiz'
        },
        {
          id: 4,
          text: 'Sí, tenemos varios modelos disponibles. Te puedo enviar la información.',
          sender: 'admin',
          timestamp: '13:42',
          clientName: 'Carlos Ruiz'
        },
        {
          id: 5,
          text: 'Perfecto, muchas gracias por la información',
          sender: 'client',
          timestamp: '13:45',
          clientName: 'Carlos Ruiz'
        }
      ]
    }
  ],
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
              id: Date.now() + Math.random(), // Asegurar IDs únicos
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
