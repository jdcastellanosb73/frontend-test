import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SignupPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.fullName || !formData.password) {
      setError(t('signup.error.required'));
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          full_name: formData.fullName,
          password: formData.password,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        const errorMsg = registerData.detail || registerData.message || t('signup.error.invalidResponse');
        setError(errorMsg);
        return;
      }

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: formData.username,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        const errorMsg = loginData.detail || loginData.message || t('login.error.credentials');
        setError(errorMsg);
        return;
      }

      if (loginData.token && loginData.user) {
        localStorage.setItem('access_token', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        setSuccess(true);

        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setError(t('signup.error.invalidResponse'));
      }
    } catch (err) {
      console.error('Error:', err);
      setError(t('signup.error.connection'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-purple-600 to-pink-500 transform -skew-y-1 origin-bottom-left"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-r from-purple-500 to-pink-600 transform -skew-y-2 origin-bottom-left opacity-80"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-12 w-full">
          <div className="logo mb-8">
            <img
              src="/crosspay-solutions-logo-color.svg"
              alt="Crosspay Solutions"
              className="h-10 w-auto"
            />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-gray-600 mt-4 leading-relaxed">
              {t('hero.description')}
            </p>
          </div>

          <div className="features space-y-6">
            {[
              { title: t('features.fxServices.title'), description: t('features.fxServices.description') },
              { title: t('features.globalPayments.title'), description: t('features.globalPayments.description') },
              { title: t('features.compliance.title'), description: t('features.compliance.description') }
            ].map((feature, index) => (
              <div key={index} className="feature-item flex gap-4">
                <div className="feature-icon flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="feature-content">
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="footer-info mt-12 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              © Crosspay Solutions • 
              <a href="https://crosspaysolutions.com/privacy" className="ml-1 hover:text-purple-600 transition-colors">
                {t('header.pricing')}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {t('signup.title')}
            </h1>
            <p className="text-gray-600">
              {t('signup.subtitle')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {t('signup.success')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('signup.fullName')}
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('signup.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="tu@empresa.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('signup.username')}
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="juan_perez"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('signup.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 disabled:opacity-70"
            >
              {loading ? t('signup.creatingAccount') : t('signup.createAccount')}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">{t('signup.or')}</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              {t('signup.alreadyHaveAccount')}{" "}
              <a href="/login" className="text-purple-600 hover:underline font-medium">
                {t('signup.signIn')}
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}