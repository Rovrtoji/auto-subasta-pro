
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Menu, X, Gavel, ShoppingCart, User, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-automotive-gradient rounded-lg flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-automotive-carbon">AutoElite</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-automotive-blue transition-colors font-medium"
            >
              Inicio
            </Link>
            
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-automotive-blue transition-colors font-medium">
                <ShoppingCart className="h-4 w-4" />
                <span>Venta Directa</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link 
                  to="/venta-directa" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-automotive-blue transition-colors"
                >
                  Ver Todos los Vehículos
                </Link>
                <Link 
                  to="/venta-directa?filter=sedan" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-automotive-blue transition-colors"
                >
                  Sedán
                </Link>
                <Link 
                  to="/venta-directa?filter=suv" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-automotive-blue transition-colors"
                >
                  SUV
                </Link>
                <Link 
                  to="/venta-directa?filter=pickup" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-automotive-blue transition-colors"
                >
                  Pick-up
                </Link>
              </div>
            </div>
            
            <Link 
              to="/subastas" 
              className="flex items-center space-x-1 text-gray-700 hover:text-automotive-blue transition-colors font-medium"
            >
              <Gavel className="h-4 w-4" />
              <span>Subastas</span>
            </Link>
            
            <Link 
              to="/contacto" 
              className="text-gray-700 hover:text-automotive-blue transition-colors font-medium"
            >
              Contacto
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/login">
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <LogIn className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="btn-premium flex items-center space-x-1">
                <UserPlus className="h-4 w-4" />
                <span>Registrarse</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-automotive-blue transition-colors font-medium"
                onClick={toggleMenu}
              >
                Inicio
              </Link>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-1 text-gray-700 font-medium">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Venta Directa</span>
                </div>
                <div className="pl-6 space-y-2">
                  <Link 
                    to="/venta-directa" 
                    className="block text-gray-600 hover:text-automotive-blue transition-colors"
                    onClick={toggleMenu}
                  >
                    Ver Todos
                  </Link>
                  <Link 
                    to="/venta-directa?filter=sedan" 
                    className="block text-gray-600 hover:text-automotive-blue transition-colors"
                    onClick={toggleMenu}
                  >
                    Sedán
                  </Link>
                  <Link 
                    to="/venta-directa?filter=suv" 
                    className="block text-gray-600 hover:text-automotive-blue transition-colors"
                    onClick={toggleMenu}
                  >
                    SUV
                  </Link>
                  <Link 
                    to="/venta-directa?filter=pickup" 
                    className="block text-gray-600 hover:text-automotive-blue transition-colors"
                    onClick={toggleMenu}
                  >
                    Pick-up
                  </Link>
                </div>
              </div>
              
              <Link 
                to="/subastas" 
                className="flex items-center space-x-1 text-gray-700 hover:text-automotive-blue transition-colors font-medium"
                onClick={toggleMenu}
              >
                <Gavel className="h-4 w-4" />
                <span>Subastas</span>
              </Link>
              
              <Link 
                to="/contacto" 
                className="text-gray-700 hover:text-automotive-blue transition-colors font-medium"
                onClick={toggleMenu}
              >
                Contacto
              </Link>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1">
                    <LogIn className="h-4 w-4" />
                    <span>Iniciar Sesión</span>
                  </Button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <Button size="sm" className="w-full btn-premium flex items-center justify-center space-x-1">
                    <UserPlus className="h-4 w-4" />
                    <span>Registrarse</span>
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
