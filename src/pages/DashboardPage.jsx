import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  if (!user) return null;

  // Datos de ejemplo para el dashboard
  const stats = [
    { title: 'Total Revenue', value: '$24,580', change: '+12.5%', icon: '💰' },
    { title: 'Active Sellers', value: '1,248', change: '+8.2%', icon: '👥' },
    { title: 'Transactions', value: '4,892', change: '+15.3%', icon: '📊' },
    { title: 'Disputes', value: '24', change: '-3.1%', icon: '⚠️' },
  ];

  const recentTransactions = [
    { id: 'TXN-001', merchant: 'Lyft', amount: '$12.47', status: 'completed', date: '2023-05-15' },
    { id: 'TXN-002', merchant: 'Uber', amount: '$24.99', status: 'completed', date: '2023-05-14' },
    { id: 'TXN-003', merchant: 'Airbnb', amount: '$142.50', status: 'pending', date: '2023-05-13' },
    { id: 'TXN-004', merchant: 'Shopify', amount: '$89.99', status: 'completed', date: '2023-05-12' },
  ];

  return (
    <div className="flex min-h-screen bg-bgPpal-light dark:bg-bgPpal-dark">
      <Sidebar />
      
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-titles-light dark:text-titles-dark">
            Bienvenido, {user.username} 👋
          </h1>
          <p className="text-pg-light dark:text-pg-dark mt-2">
            Aquí está tu resumen de actividad reciente.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-bgSec-light dark:bg-bgSec-dark p-6 rounded-xl border border-line-light dark:border-line-dark shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pg-light dark:text-pg-dark text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-titles-light dark:text-titles-dark mt-1">{stat.value}</p>
                  <p className="text-green-500 text-sm mt-1">{stat.change}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-bgSec-light dark:bg-bgSec-dark rounded-xl border border-line-light dark:border-line-dark p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-titles-light dark:text-titles-dark">
              Transacciones recientes
            </h2>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Ver todas
            </button>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((txn) => (
              <div 
                key={txn.id} 
                className="flex items-center justify-between p-4 border border-line-light dark:border-line-dark rounded-lg hover:bg-bgPpal-light dark:hover:bg-bgPpal-dark transition-colors"
              >
                <div>
                  <p className="font-medium text-titles-light dark:text-titles-dark">{txn.merchant}</p>
                  <p className="text-sm text-pg-light dark:text-pg-dark">{txn.id} • {txn.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-titles-light dark:text-titles-dark">{txn.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    txn.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {txn.status === 'completed' ? 'Completada' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}