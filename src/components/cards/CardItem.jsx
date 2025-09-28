import { CreditCard, Calendar, User, Trash2 } from 'lucide-react';

export default function CardItem({ card, onRemove, isRemoving }) {
  const last4 = card.card_number.slice(-4);

  const getCardType = (number) => {
    if (number.startsWith('4')) return 'VISA';
    if (number.startsWith('5')) return 'MASTERCARD';
    if (number.startsWith('3')) return 'AMEX';
    return 'CARD';
  };

  const cardType = getCardType(card.card_number);

  return (
    <div className="bg-bgSec-light dark:bg-bgSec-dark rounded-xl p-6 border border-line-light dark:border-line-dark hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-12 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
            <CreditCard size={16} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-titles-light dark:text-titles-dark">
              **** **** **** {last4}
            </div>
            <div className="text-sm text-pg-light dark:text-pg-dark mt-1">
              {cardType} • {card.expiration_date}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onRemove(card.id)}
          disabled={isRemoving}
          className="p-2 text-pg-light dark:text-pg-dark hover:text-red-500 transition-colors"
          title="Eliminar tarjeta"
        >
          <Trash2 size={20} />
        </button>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-pg-light dark:text-pg-dark">
        <User size={16} />
        <span>{card.card_holder_name}</span>
      </div>
    </div>
  );
}