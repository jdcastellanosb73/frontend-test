import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Si no hay usuario, redirigir al login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'pagos', path: '/transactions' },
    { name: 'Tarjetas', path: '/accounts' },
    { name: 'Configuración', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-bgSec-light dark:bg-bgSec-dark min-h-screen border-r border-line-light dark:border-line-dark flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-line-light dark:border-line-dark">
        <div className="flex items-center gap-3">
          <img
            src="/crosspay-solutions-logo-color.svg"
            alt="Crosspay"
            className="h-8 w-auto"
          />
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-titles-light dark:text-titles-dark hover:bg-bgPpal-light dark:hover:bg-bgPpal-dark transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </a>
        ))}
      </nav>

      {/* Perfil de usuario */}
      {user && (
        <div className="p-4 border-t border-line-light dark:border-line-dark">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-titles-light dark:text-titles-dark">
                  {user.username}
                </p>
                <p className="text-sm text-pg-light dark:text-pg-dark">Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-pg-light dark:text-pg-dark hover:text-red-500 transition-colors"
              title="Cerrar sesión"
            >
              🚪
            </button>
          </div>
        </div>
      )}
    </div>
  );
}