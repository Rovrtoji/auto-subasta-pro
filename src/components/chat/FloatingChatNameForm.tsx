
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  clientName: string;
  setClientName: (name: string) => void;
  handleStartChat: () => void;
}

const FloatingChatNameForm = ({ clientName, setClientName, handleStartChat }: Props) => (
  <div className="flex-1 flex flex-col justify-center p-4">
    <h3 className="text-lg font-semibold mb-4 text-center">¡Bienvenido!</h3>
    <p className="text-sm text-gray-600 mb-4 text-center">
      Para comenzar, por favor ingresa tu nombre:
    </p>
    <Input
      placeholder="Tu nombre..."
      value={clientName}
      onChange={(e) => setClientName(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && handleStartChat()}
      className="mb-4"
    />
    <Button
      onClick={handleStartChat}
      disabled={!clientName.trim()}
      className="bg-automotive-blue hover:bg-automotive-blue/80"
    >
      Iniciar Chat
    </Button>
  </div>
);

export default FloatingChatNameForm;
