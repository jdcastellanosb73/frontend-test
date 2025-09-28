import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ total_withdrawals: "0.00" });
  const [statsData, setStatsData] = useState({ monthlySpending: [], topCategories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const transactionsRes = await fetch('/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const transactionsData = await transactionsRes.json();
        const transactionsList = Array.isArray(transactionsData.data) ? transactionsData.data : [];

        const summaryRes = await fetch('/api/transactions/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const summaryData = await summaryRes.json();
        const summaryInfo = summaryData || { total_withdrawals: "0.00" };

        const statsRes = await fetch('/api/transactions/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        const statsInfo = statsData || { monthlySpending: [], topCategories: [] };

        setTransactions(transactionsList);
        setSummary(summaryInfo);
        setStatsData(statsInfo);
      } catch (err) {
        console.error('Error fetching dashboard ', err);
        setError('Error al cargar los datos del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (!user) return null;

  const monthlySpending = statsData.monthlySpending?.[0]?.total || "0.00";
  const monthName = statsData.monthlySpending?.[0]?.month || t('dashboard.totalSpent').replace('Total gastado en ', '');
  const topCategory = statsData.topCategories?.[0]?.category || t('dashboard.topCategory');
  const topCategoryTotal = statsData.topCategories?.[0]?.total || "0.00";

  const formatAmount = (amount) => {
    if (!amount) return "0.00";
    return parseFloat(amount).toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  };

  const getDocumentTypeName = (code) => {
    const types = { 'CC': t('documentTypes.CC'), 'PP': t('documentTypes.PP') };
    return types[code] || code;
  };

  const stats = [
    { 
      title: t('dashboard.totalSpent').replace('{month}', monthName), 
      value: `$${formatAmount(monthlySpending)}`, 
      change: ''
    },
    { 
      title: t('dashboard.topCategory'), 
      value: topCategory,
      change: `$${formatAmount(topCategoryTotal)}` 
    },
    { 
      title: t('dashboard.totalWithdrawals'), 
      value: `$${formatAmount(summary.total_withdrawals)}`, 
      change: ''
    }
  ];

  return (
    <div className="flex min-h-screen bg-bgPpal-light dark:bg-bgPpal-dark">
      <Sidebar />
      
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-titles-light dark:text-titles-dark">
            {t('dashboard.welcome').replace('{username}', user.username)}
          </h1>
          <p className="text-pg-light dark:text-pg-dark mt-2">
            {t('dashboard.summary')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-bgSec-light dark:bg-bgSec-dark p-6 rounded-xl border border-line-light dark:border-line-dark shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pg-light dark:text-pg-dark text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-titles-light dark:text-titles-dark mt-1">{stat.value}</p>
                  {stat.change && (
                    <p className="text-pg-light dark:text-pg-dark text-sm mt-1">{stat.change}</p>
                  )}
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-bgSec-light dark:bg-bgSec-dark rounded-xl border border-line-light dark:border-line-dark p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-titles-light dark:text-titles-dark">
              {t('dashboard.transactions')}
            </h2>
            <button 
              onClick={() => navigate('/transactions')}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              {t('dashboard.createNew')}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-pg-light dark:text-pg-dark">
              {t('dashboard.noTransactions')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line-light dark:border-line-dark">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-titles-light dark:text-titles-dark">
                      {t('dashboard.headers.currency')}
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-titles-light dark:text-titles-dark">
                      {t('dashboard.headers.amount')}
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-titles-light dark:text-titles-dark">
                      {t('dashboard.headers.description')}
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-titles-light dark:text-titles-dark">
                      {t('dashboard.headers.name')}
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-titles-light dark:text-titles-dark">
                      {t('dashboard.headers.documentType')}
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-titles-light dark:text-titles-dark">
                      {t('dashboard.headers.date')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr 
                      key={txn.id} 
                      className="border-b border-line-light dark:border-line-dark hover:bg-bgPpal-light dark:hover:bg-bgPpal-dark transition-colors"
                    >
                      <td className="py-4 px-2 text-pg-light dark:text-pg-dark">{txn.currency}</td>
                      <td className="py-4 px-2 text-pg-light dark:text-pg-dark">${formatAmount(txn.amount)}</td>
                      <td className="py-4 px-2 text-pg-light dark:text-pg-dark">{txn.description || '-'}</td>
                      <td className="py-4 px-2 text-pg-light dark:text-pg-dark">{txn.full_name || '-'}</td>
                      <td className="py-4 px-2 text-pg-light dark:text-pg-dark">{getDocumentTypeName(txn.document_type)}</td>
                      <td className="py-4 px-2 text-pg-light dark:text-pg-dark">{formatDate(txn.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}