import { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    staySignedIn: true
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.password) {
      setError(t('login.error.credentials'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('access_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (formData.staySignedIn) {
          localStorage.setItem('stay_signed_in', 'true');
        }

        navigate('/dashboard');
      } else {
        setError(data.message || t('login.error.credentials'));
      }
    } catch (err) {
      console.error('Error de login:', err);
      setError(t('login.error.connection'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-bgPpal-light dark:bg-bgPpal-dark flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-64 h-32 bg-gradient-to-r from-purple-600 to-pink-500 transform -skew-y-3 origin-bottom-left opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-48 h-24 bg-gradient-to-r from-purple-500 to-pink-600 transform -skew-y-6 origin-bottom-left opacity-60"></div>
        <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-l from-purple-500 to-pink-500 transform skew-y-3 origin-top-right opacity-80"></div>
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-pink-400 to-purple-400 transform skew-y-6 origin-top-right opacity-60"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 text-2xl font-bold mb-8">
            <img
              src="/crosspay-solutions-logo-color.svg"
              alt="Crosspay"
              className="h-8 w-auto"
            />
          </div>
        </div>

        <div className="bg-bgSec-light dark:bg-bgSec-dark rounded-2xl shadow-xl p-8 border border-line-light dark:border-line-dark">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-titles-light dark:text-titles-dark mb-2">
              {t('login.title')}
            </h1>
            <p className="text-pg-light dark:text-pg-dark">
              {t('login.subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-titles-light dark:text-titles-dark mb-2">
                {t('login.usernameOrEmail')}
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-bgPpal-light dark:bg-bgPpal-dark text-titles-light dark:text-titles-dark"
                placeholder="juan o juan@ejemplo.com"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-titles-light dark:text-titles-dark">
                  {t('login.password')}
                </label>
                <a 
                  href="#" 
                  className="text-sm text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                >
                  {t('login.forgotPassword')}
                </a>
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-bgPpal-light dark:bg-bgPpal-dark text-titles-light dark:text-titles-dark"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="staySignedIn"
                checked={formData.staySignedIn}
                onChange={(e) => handleInputChange('staySignedIn', e.target.checked)}
                className="w-5 h-5 text-purple-600 border-2 border-purple-300 rounded focus:ring-purple-500 focus:ring-2 bg-bgSec-light dark:bg-bgSec-dark"
              />
              <label htmlFor="staySignedIn" className="text-sm text-titles-light dark:text-titles-dark">
                {t('login.staySignedIn')}
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.username || !formData.password}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                isLoading || !formData.username || !formData.password
                  ? 'bg-purple-300 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 hover:transform hover:-translate-y-0.5 hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('login.signingIn')}
                </div>
              ) : (
                t('login.continue')
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium hover:underline"
              >
                {t('login.sso')}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-pg-light dark:text-pg-dark">
            {t('login.noAccount')}{" "}
            <a 
              href="/signup"
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              {t('login.signUp')}
            </a>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-pg-light dark:text-pg-dark">
          <Shield size={14} />
          <span>{t('login.securityTip')}</span>
        </div>
      </div>
    </div>
  );
}