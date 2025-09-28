import { useState } from 'react';
import { CreditCard, Calendar, User, Eye, EyeOff, Lock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const CardPreview = ({ cardNumber, expiryDate, cardholderName }) => {
  const getCardIcon = (number) => {
    const clean = number.replace(/\s/g, '');
    if (clean.match(/^4/)) return 'VISA';
    if (clean.match(/^5[1-5]/)) return 'MASTERCARD';
    if (clean.match(/^3[47]/)) return 'AMEX';
    if (clean.match(/^6/)) return 'DISCOVER';
    return 'CARD';
  };

  const cardType = getCardIcon(cardNumber);
  const icon = cardType === 'AMEX' ? '🁢' : '💳';

  return (
    <div className="w-full max-w-sm mx-auto mb-6">
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div className="text-2xl">{icon}</div>
          <div className="text-right">
            <div className="text-xs opacity-80">{cardType}</div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-xl font-mono tracking-wider">
            {cardNumber || '•••• •••• •••• ••••'}
          </div>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs opacity-80 mb-1">TITULAR</div>
            <div className="font-semibold text-sm">
              {cardholderName || 'NOMBRE DEL TITULAR'}
            </div>
          </div>
          <div>
            <div className="text-xs opacity-80 mb-1">VÁLIDA</div>
            <div className="font-semibold text-sm">
              {expiryDate || 'MM/AA'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AddCardForm({ onAddCard, isAdding }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  
  const [showCvv, setShowCvv] = useState(false);
  const [errors, setErrors] = useState({});

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2, 4);
    return v;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const cleanCard = formData.cardNumber.replace(/\s/g, '');
    
    if (!cleanCard) newErrors.cardNumber = t('transactions.error.required').replace('{field}', t('cards.cardNumber'));
    else if (cleanCard.length < 13) newErrors.cardNumber = t('transactions.error.invalidCard');
    
    if (!formData.expiryDate) newErrors.expiryDate = t('transactions.error.required').replace('{field}', t('cards.expiryDate'));
    else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = t('transactions.error.invalidExpiry');
    
    if (!formData.cvv) newErrors.cvv = t('transactions.error.required').replace('{field}', t('cards.cvv'));
    else if (formData.cvv.length < 3) newErrors.cvv = t('transactions.error.invalidCvv');
    
    if (!formData.cardholderName.trim()) newErrors.cardholderName = t('transactions.error.required').replace('{field}', t('cards.cardholderName'));

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAddCard({
        card_number: formData.cardNumber.replace(/\s/g, ''),
        expiration_date: formData.expiryDate,
        cvv: formData.cvv,
        cardholder_name: formData.cardholderName,
        type: detectCardType(formData.cardNumber)
      });
    }
  };

  const detectCardType = (number) => {
    const clean = number.replace(/\s/g, '');
    if (clean.match(/^4/)) return 'visa';
    if (clean.match(/^5[1-5]/)) return 'mastercard';
    if (clean.match(/^3[47]/)) return 'amex';
    return 'visa';
  };

  return (
    <div className="bg-bgSec-light dark:bg-bgSec-dark rounded-xl p-6 border border-line-light dark:border-line-dark">
      <h3 className="text-lg font-semibold text-titles-light dark:text-titles-dark mb-6">
        {t('cards.addCard')}
      </h3>
      
      <CardPreview 
        cardNumber={formData.cardNumber}
        expiryDate={formData.expiryDate}
        cardholderName={formData.cardholderName}
      />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-pg-light dark:text-pg-dark mb-2">
            <CreditCard size={16} className="inline mr-1" />
            {t('cards.cardNumber')}
          </label>
          <input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            className={`w-full px-3 py-2 bg-bgPpal-light dark:bg-bgPpal-dark border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition ${
              errors.cardNumber ? 'border-red-500' : 'border-line-light dark:border-line-dark'
            }`}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
          {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pg-light dark:text-pg-dark mb-2">
              <Calendar size={16} className="inline mr-1" />
              {t('cards.expiryDate')}
            </label>
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              className={`w-full px-3 py-2 bg-bgPpal-light dark:bg-bgPpal-dark border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition ${
                errors.expiryDate ? 'border-red-500' : 'border-line-light dark:border-line-dark'
              }`}
              placeholder="MM/AA"
              maxLength={5}
            />
            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-pg-light dark:text-pg-dark mb-2">
              {t('cards.cvv')}
            </label>
            <div className="relative">
              <input
                type={showCvv ? "text" : "password"}
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                className={`w-full px-3 py-2 bg-bgPpal-light dark:bg-bgPpal-dark border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition ${
                  errors.cvv ? 'border-red-500' : 'border-line-light dark:border-line-dark'
                }`}
                placeholder="123"
                maxLength={4}
              />
              <button
                type="button"
                onClick={() => setShowCvv(!showCvv)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pg-light dark:text-pg-dark hover:text-titles-light dark:hover:text-titles-dark"
              >
                {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pg-light dark:text-pg-dark mb-2">
            <User size={16} className="inline mr-1" />
            {t('cards.cardholderName')}
          </label>
          <input
            type="text"
            value={formData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            className={`w-full px-3 py-2 bg-bgPpal-light dark:bg-bgPpal-dark border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition ${
              errors.cardholderName ? 'border-red-500' : 'border-line-light dark:border-line-dark'
            }`}
            placeholder="Nombre como aparece en la tarjeta"
          />
          {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-600 transition disabled:opacity-70"
        >
          {isAdding ? t('cards.adding') : t('cards.addCard')}
        </button>

        <div className="flex items-center gap-2 text-xs text-pg-light dark:text-pg-dark mt-2">
          <Lock size={14} />
          <span>{t('payment.security')}</span>
        </div>
      </form>
    </div>
  );
}