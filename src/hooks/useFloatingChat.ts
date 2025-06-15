
import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';

export const useFloatingChat = () => {
  const { state, dispatch } = useChat();
  const [message, setMessage] = useState('');
  const [clientName, setClientName] = useState('');
  const [step, setStep] = useState<'name' | 'chat'>('name');
  const [localRoomId, setLocalRoomId] = useState<number | null>(null);

  // Ref to avoid duplicate effect triggers
  const justCreatedRoom = useRef(false);

  const handleStartChat = () => {
    if (!clientName.trim()) return;
    const existingRoom = state.rooms.find(room => room.clientName === clientName);
    if (!existingRoom) {
      justCreatedRoom.current = true;
      dispatch({
        type: 'CREATE_ROOM',
        payload: {
          clientName: clientName,
          initialMessage: `Hola, soy ${clientName}. ¿Podrían ayudarme?`
        }
      });
    } else {
      setLocalRoomId(existingRoom.id);
      dispatch({ type: 'SELECT_ROOM', payload: existingRoom.id });
    }
    setStep('chat');
  };

  useEffect(() => {
    if (!clientName) return;
    const foundRoom = state.rooms.find(room => room.clientName === clientName);
    if (foundRoom && (localRoomId !== foundRoom.id)) {
      setLocalRoomId(foundRoom.id);
      dispatch({ type: 'SELECT_ROOM', payload: foundRoom.id });
      if (justCreatedRoom.current) justCreatedRoom.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.rooms, clientName]);

  useEffect(() => {
    if (localRoomId && state.selectedRoom !== localRoomId) {
      dispatch({ type: 'SELECT_ROOM', payload: localRoomId });
    }
  }, [localRoomId, state.selectedRoom, dispatch]);

  const handleSendMessage = () => {
    if (!message.trim() || !clientName) return;
    const currRoom = state.rooms.find(room => room.clientName === clientName);
    if (currRoom) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          roomId: currRoom.id,
          message: {
            text: message,
            sender: 'client',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            clientName: clientName
          }
        }
      });
      setLocalRoomId(currRoom.id);
    }
    setMessage('');
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_FLOATING_CHAT', payload: false });
  };

  const handleReset = () => {
    setStep('name');
    setClientName('');
    setMessage('');
    setLocalRoomId(null);
    dispatch({ type: 'TOGGLE_FLOATING_CHAT', payload: false });
  };

  const currentMessages = localRoomId
    ? state.rooms.find(room => room.id === localRoomId)?.messages || []
    : [];

  const totalUnreadCount = state.rooms.reduce((total, room) => total + room.unreadCount, 0);

  return {
    state,
    dispatch, // <-- Return dispatch here!
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
    totalUnreadCount,
    setStep
  };
};
