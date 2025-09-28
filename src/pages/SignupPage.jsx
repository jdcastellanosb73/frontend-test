import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
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
  setLoading(true);
  setError('');
  setSuccess(false);

  const username = formData.fullName.trim().split(' ')[0].toLowerCase() || 'user';

  try {
    // Paso 1: Registrar al usuario
    const registerResponse = await fetch('https://backend-test-qawh.onrender.com/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email: formData.email,
        full_name: formData.fullName,
        password: formData.password,
      }),
    });

    const registerData = await registerResponse.json();

    if (!registerResponse.ok) {
      setError(registerData.detail || registerData.message || 'Error al crear la cuenta. Intenta de nuevo.');
      return;
    }

    // Paso 2: Iniciar sesión automáticamente
    const loginResponse = await fetch('https://backend-test-qawh.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password: formData.password,
      }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      setError(loginData.detail || loginData.message || 'Error al iniciar sesión automáticamente.');
      return;
    }

    // Paso 3: Guardar token y redirigir
    if (loginData.access_token) {
      localStorage.setItem('access_token', loginData.access_token);
      setSuccess(true);
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        window.location.href = '/dashboard'; // o '/home', según tu app
      }, 1500);
    } else {
      setError('No se recibió un token de autenticación.');
    }
  } catch (err) {
    console.error('Error en el proceso de registro/login:', err);
    setError('Error de conexión. Verifica tu red.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex">
      {/* Panel izquierdo - Información (estructura exacta solicitada) */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-purple-600 to-pink-500 transform -skew-y-1 origin-bottom-left"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-r from-purple-500 to-pink-600 transform -skew-y-2 origin-bottom-left opacity-80"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-12 w-full">
          {/* Logo */}
          <div className="logo mb-16">
            <img
              src="/crosspay-solutions-logo-color.svg"
              alt="Crosspay"
              className="h-8 w-auto"
            />
          </div>

          {/* Features */}
          <div className="features space-y-8">
            {[
              {
                title: "Get started quickly",
                description: "Integrate with developer-friendly APIs or choose low-code or pre-built solutions."
              },
              {
                title: "Support any business model",
                description: "E-commerce, subscriptions, SaaS platforms, marketplaces, and more—all within a unified platform."
              },
              {
                title: "Join millions of businesses",
                description: "Crosspay is trusted by ambitious startups and enterprises of every size."
              }
            ].map((feature, index) => (
              <div key={index} className="feature-item flex gap-4">
                <div className="feature-icon flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="feature-content">
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer info */}
          <div className="footer-info mt-16 pt-8 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-500">
            <span>© Crosspay Solutions</span>
            <span>•</span>
            <a href="https://crosspaysolutions.com/privacy" className="hover:text-purple-600 transition-colors">
              Privacy & terms
            </a>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario (sin cambios) */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create your Crosspay account
            </h1>
            <p className="text-gray-600">Start accepting payments in minutes</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              Account created successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">or</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-purple-600 hover:underline font-medium">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}