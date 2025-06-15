import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'admin' | 'client';
  timestamp: string;
  clientName: string;
  roomId: string;
}

interface ChatRoom {
  id: string;
  clientName: string;
  created_at: string;
}

interface ChatState {
  rooms: ChatRoom[];
  selectedRoom: string | null;
  isFloatingChatOpen: boolean;
  messages: ChatMessage[];
}

type ChatAction =
  | { type: 'SET_ROOMS'; payload: ChatRoom[] }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'SELECT_ROOM'; payload: string | null }
  | { type: 'TOGGLE_FLOATING_CHAT'; payload?: boolean };

// Datos de ejemplo para demostrar el funcionamiento
const initialState: ChatState = {
  rooms: [],
  selectedRoom: null,
  isFloatingChatOpen: false,
  messages: [],
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SELECT_ROOM':
      return { ...state, selectedRoom: action.payload };
    case 'TOGGLE_FLOATING_CHAT':
      return {
        ...state,
        isFloatingChatOpen: action.payload !== undefined ? action.payload : !state.isFloatingChatOpen
      };
    default:
      return state;
  }
};

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  refreshRooms: () => Promise<void>;
  refreshMessages: (roomId: string) => Promise<void>;
  createRoom: (clientName: string) => Promise<ChatRoom>;
  sendMessage: (roomId: string, text: string, sender: 'admin' | 'client', clientName: string) => Promise<void>;
} | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Cargar rooms desde Supabase
  const refreshRooms = async () => {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return;
    dispatch({ type: 'SET_ROOMS', payload: data as ChatRoom[] });
  };

  // Cargar mensajes de un room según ID
  const refreshMessages = async (roomId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('timestamp', { ascending: true });
    if (error) return;
    dispatch({ type: 'SET_MESSAGES', payload: data as ChatMessage[] });
  };

  // Crear un nuevo room
  const createRoom = async (clientName: string) => {
    const { data, error } = await supabase
      .from('chat_rooms')
      .insert({ client_name: clientName })
      .select()
      .single();
    if (error) throw error;
    await refreshRooms();
    return data as ChatRoom;
  };

  // Enviar un mensaje
  const sendMessage = async (roomId: string, text: string, sender: 'admin' | 'client', clientName: string) => {
    await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        text,
        sender,
        client_name: clientName,
        timestamp: new Date().toISOString()
      });
    await refreshMessages(roomId);
  };

  // Sincronización inicial de rooms
  useEffect(() => {
    refreshRooms();
    // Realtime subscription
    const roomsChannel = supabase
      .channel('rooms-table')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_rooms' }, (payload) => {
        refreshRooms();
      })
      .subscribe();
    return () => { supabase.removeChannel(roomsChannel); };
  }, []);

  return (
    <ChatContext.Provider value={{ state, dispatch, refreshRooms, refreshMessages, createRoom, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};

export type { ChatMessage, ChatRoom };
