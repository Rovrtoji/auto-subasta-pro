
import { Car, Menu, User, MessageCircle, Gavel } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Inicio', href: '/', icon: Car },
    { name: 'Subastas', href: '/subastas', icon: Gavel },
    { name: 'Contacto', href: '/contacto', icon: MessageCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-automotive-blue to-automotive-gold">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div className="hidden font-bold sm:block">
            <span className="text-automotive-blue">Auto</span>
            <span className="text-automotive-gold">Subasta</span>
            <span className="text-automotive-carbon">Pro</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center space-x-2 text-sm font-medium text-foreground/80 transition-colors hover:text-automotive-blue hover:scale-105 transform duration-200"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </Button>
          
          <Button size="sm" className="btn-premium">
            <User className="h-4 w-4 mr-2" />
            Ingresar
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 text-lg font-medium p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </a>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <Button className="w-full btn-premium">
                    <User className="h-4 w-4 mr-2" />
                    Ingresar
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
