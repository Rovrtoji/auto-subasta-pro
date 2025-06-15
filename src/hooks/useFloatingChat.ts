import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';

export const useFloatingChat = () => {
  const { state, dispatch, refreshRooms, refreshMessages, createRoom, sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const [clientName, setClientName] = useState('');
  const [step, setStep] = useState<'name' | 'chat'>('name');
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  // Al iniciar, buscar si hay un room para el cliente actual
  useEffect(() => {
    if (!clientName) return;
    const foundRoom = state.rooms.find(room => room.clientName === clientName);
    if (foundRoom) {
      setCurrentRoomId(foundRoom.id);
      dispatch({ type: 'SELECT_ROOM', payload: foundRoom.id });
      refreshMessages(foundRoom.id);
      setStep('chat');
    }
  // eslint-disable-next-line
  }, [clientName, state.rooms]);

  // Cuando selecciono un room en el chat flotante (nuevo)
  const handleStartChat = async () => {
    if (!clientName.trim()) return;
    let room = state.rooms.find(room => room.clientName === clientName);
    if (!room) {
      room = await createRoom(clientName);
      await sendMessage(room.id, `Hola, soy ${clientName}. ¿Podrían ayudarme?`, 'client', clientName);
    }
    setCurrentRoomId(room.id);
    dispatch({ type: 'SELECT_ROOM', payload: room.id });
    await refreshMessages(room.id);
    setStep('chat');
  };

  // Enviar mensaje en el chat flotante
  const handleSendMessage = async () => {
    if (!message.trim() || !clientName || !currentRoomId) return;
    await sendMessage(currentRoomId, message, 'client', clientName);
    setMessage('');
    await refreshMessages(currentRoomId);
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_FLOATING_CHAT', payload: false });
  };

  const handleReset = () => {
    setStep('name');
    setClientName('');
    setMessage('');
    setCurrentRoomId(null);
    dispatch({ type: 'TOGGLE_FLOATING_CHAT', payload: false });
  };

  // Los mensajes actuales del room activo
  const currentMessages = state.messages;

  // Unread count: for now always empty, could add with extra supabase column if desired

  return {
    state,
    dispatch,
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
    totalUnreadCount: 0, // para futura mejora
    setStep
  };
};
