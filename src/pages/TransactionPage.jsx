import { useState, useEffect } from 'react';
import { Lock, CreditCard, User, FileText, DollarSign, Calendar, Shield, IdCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'https://backend-test-qawh.onrender.com';

export default function TransactionPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    currency: 'COP',
    amount: '',
    description: '',
    customerName: '',
    documentType: 'CC',
    numeroDocumento: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const currencies = [
    { code: 'COP', symbol: '$', name: t('currencies.COP') },
    { code: 'USD', symbol: '$', name: t('currencies.USD') }
  ];

  const documentTypes = [
    { code: 'CC', name: t('documentTypes.CC') },
    { code: 'PP', name: t('documentTypes.PP') }
  ];

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiryDateForAPI = (value) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length >= 4) {
      const month = clean.substring(0, 2).padStart(2, '0');
      const year = clean.substring(2, 4);
      return `${month}/${year}`;
    }
    return '';
  };

  const formatAmountForAPI = (value) => {
    const numericValue = value.replace(/,/g, '');
    return parseFloat(numericValue) || 0;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      const v = value.replace(/\D/g, '');
      if (v.length >= 2) {
        formattedValue = v.substring(0, 2) + '/' + v.substring(2, 4);
      } else {
        formattedValue = v;
      }
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    } else if (field === 'amount') {
      const numericValue = value.replace(/[^0-9]/g, '');
      formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else if (field === 'numeroDocumento') {
      formattedValue = value.replace(/[^0-9]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount) newErrors.amount = t('transactions.error.required').replace('{field}', t('transactions.amount').toLowerCase());
    if (!formData.description.trim()) newErrors.description = t('transactions.error.required').replace('{field}', t('transactions.description').toLowerCase());
    if (!formData.customerName.trim()) newErrors.customerName = t('transactions.error.required').replace('{field}', t('transactions.fullName').toLowerCase());
    if (!formData.numeroDocumento.trim()) newErrors.numeroDocumento = t('transactions.error.required').replace('{field}', t('transactions.documentNumber') || 'número de documento');
    if (!formData.cardNumber.replace(/\s/g, '')) newErrors.cardNumber = t('transactions.error.required').replace('{field}', t('transactions.cardNumber').toLowerCase());
    if (formData.cardNumber.replace(/\s/g, '').length < 13) newErrors.cardNumber = t('transactions.error.invalidCard');
    if (!formData.expiryDate || formData.expiryDate.length < 5) newErrors.expiryDate = t('transactions.error.required').replace('{field}', t('transactions.expiryDate').toLowerCase());
    if (!formData.cvv) newErrors.cvv = t('transactions.error.required').replace('{field}', t('transactions.cvv').toLowerCase());
    if (!formData.cardholderName.trim()) newErrors.cardholderName = t('transactions.error.required').replace('{field}', t('transactions.cardholderName').toLowerCase());

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setApiError('');

    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currency: formData.currency,
          amount: formatAmountForAPI(formData.amount),
          description: formData.description,
          full_name: formData.customerName,
          document_type: formData.documentType,
          numero_documento: formData.numeroDocumento,
          card_number: formData.cardNumber.replace(/\s/g, ''),
          cvv: formData.cvv,
          expiration_date: formatExpiryDateForAPI(formData.expiryDate),
          type: 'payment',
          category: 'online'
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : null;

      if (res.ok) {
        alert(t('transactions.success'));
        setFormData({
          currency: 'COP',
          amount: '',
          description: '',
          customerName: '',
          documentType: 'CC',
          numeroDocumento: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardholderName: ''
        });
      } else {
        const msg = data?.message || t('transactions.error.connection') || 'Error en el servidor';
        setApiError(msg);
      }
    } catch (err) {
      console.error('Error:', err);
      setApiError(t('transactions.error.connection'));
    } finally {
      setIsProcessing(false);
    }
  };

  const getAmountInCurrency = () => {
    if (!formData.amount) return '0.00';
    const numericAmount = formData.amount.replace(/,/g, '');
    return parseFloat(numericAmount || 0).toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const selectedCurrency = currencies.find(c => c.code === formData.currency) || currencies[0];

  return (
    <div className="flex min-h-screen bg-bgPpal-light dark:bg-bgPpal-dark">
      <Sidebar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"></div>

          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <h2 className="text-white font-semibold">PayConnect</h2>
                  <p className="text-gray-400 text-sm">Pasarela de Pagos</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {selectedCurrency.symbol}{getAmountInCurrency()}
                </div>
                <div className="text-sm text-gray-400">{selectedCurrency.name}</div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {apiError && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
                {apiError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  {t('transactions.currency')}
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code} className="bg-gray-800">
                      {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('transactions.amount')}
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`w-full px-3 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none ${
                    errors.amount ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="100,000"
                />
                {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FileText size={16} className="inline mr-1" />
                {t('transactions.description')}
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-3 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none ${
                  errors.description ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Pago de servicios, compra de productos, etc."
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User size={16} className="inline mr-1" />
                {t('transactions.fullName')}
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className={`w-full px-3 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none ${
                  errors.customerName ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Juan Pérez González"
              />
              {errors.customerName && <p className="text-red-400 text-xs mt-1">{errors.customerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <IdCard size={16} className="inline mr-1" />
                {t('transactions.documentNumber') || 'Número de documento'}
              </label>
              <input
                type="text"
                value={formData.numeroDocumento}
                onChange={(e) => handleInputChange('numeroDocumento', e.target.value)}
                className={`w-full px-3 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none ${
                  errors.numeroDocumento ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="12345678"
                maxLength={20}
              />
              {errors.numeroDocumento && <p className="text-red-400 text-xs mt-1">{errors.numeroDocumento}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('transactions.documentType')}
              </label>
              <select
                value={formData.documentType}
                onChange={(e) => handleInputChange('documentType', e.target.value)}
                className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
              >
                {documentTypes.map(doc => (
                  <option key={doc.code} value={doc.code} className="bg-gray-800">
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <CreditCard size={16} className="inline mr-1" />
                {t('transactions.cardNumber')}
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className={`w-full px-3 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="•••• •••• •••• ••••"
                maxLength={19}
              />
              {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  {t('transactions.expiryDate')}
                </label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className={`w-full px-3 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="MM/AA"
                  maxLength={5}
                />
                {errors.expiryDate && <p className="text-red-400 text-xs mt-1">{errors.expiryDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Shield size={16} className="inline mr-1" />
                  {t('transactions.cvv')}
                </label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className={`w-full px-3 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none ${
                    errors.cvv ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="•••"
                  maxLength={4}
                />
                {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('transactions.cardholderName')}
              </label>
              <input
                type="text"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                className={`w-full px-3 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none ${
                  errors.cardholderName ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Nombre como aparece en la tarjeta"
              />
              {errors.cardholderName && <p className="text-red-400 text-xs mt-1">{errors.cardholderName}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isProcessing
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  {t('transactions.processing')}
                </div>
              ) : (
                `${t('transactions.title')} ${selectedCurrency.symbol}${getAmountInCurrency()}`
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock size={14} />
              <span>{t('payment.security')}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}