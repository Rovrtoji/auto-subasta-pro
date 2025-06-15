
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface Props {
  message: string;
  setMessage: (v: string) => void;
  handleSendMessage: () => void;
}

const FloatingChatMessageInput = ({ message, setMessage, handleSendMessage }: Props) => (
  <div className="border-t p-4">
    <div className="flex space-x-2">
      <Input
        placeholder="Escribe tu mensaje..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
        className="flex-1"
      />
      <Button
        onClick={handleSendMessage}
        size="sm"
        disabled={!message.trim()}
        className="bg-automotive-blue hover:bg-automotive-blue/80"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default FloatingChatMessageInput;
