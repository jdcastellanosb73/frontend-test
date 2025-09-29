import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import CardItem from '../components/cards/CardItem';
import AddCardForm from '../components/cards/AddCardForm';
import { useLanguage } from '../context/LanguageContext';

export default function CardsPage() {
  const { t } = useLanguage();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCards();
  }, [navigate]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('https://backend-test-qawh.onrender.com/api/cards', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCards(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Error al cargar las tarjetas');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudieron cargar las tarjetas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (cardData) => {
    try {
      setIsAdding(true);
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('https://backend-test-qawh.onrender.com/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cardData)
      });
      
      if (response.ok) {
        await fetchCards();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al añadir tarjeta');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveCard = async (cardId) => {
    if (!window.confirm(t('cards.deleteConfirm'))) return;
    
    try {
      setIsRemoving(cardId);
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`https://backend-test-qawh.onrender.com/api/cards/${cardId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setCards(cards.filter(card => card.id !== cardId));
      } else {
        throw new Error('Error al eliminar la tarjeta');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudo eliminar la tarjeta');
    } finally {
      setIsRemoving(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-bgPpal-light dark:bg-bgPpal-dark">
      <Sidebar />
      
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-titles-light dark:text-titles-dark">
            {t('cards.title')}
          </h1>
          <p className="text-pg-light dark:text-pg-dark mt-2">
            {t('cards.subtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        <AddCardForm onAddCard={handleAddCard} isAdding={isAdding} />

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-titles-light dark:text-titles-dark mb-4">
            {t('cards.savedCards').replace('{count}', cards.length)}
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : cards.length === 0 ? (
            <div className="text-center py-8 text-pg-light dark:text-pg-dark">
              {t('cards.noCards')}
            </div>
          ) : (
            <div className="grid gap-4">
              {cards.map(card => (
                <CardItem
                  key={card.id}
                  card={card}
                  onRemove={handleRemoveCard}
                  isRemoving={isRemoving === card.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}