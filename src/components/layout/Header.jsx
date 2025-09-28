import { useLanguage } from '../../context/LanguageContext';
import Container from './Container';

export default function Header() {
  const { t, lang, setLang } = useLanguage();

  // Detecta el tema actual (claro u oscuro) para elegir el logo
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <header className="bg-bgSec-light dark:bg-bgSec-dark py-4 shadow-sm sticky top-0 z-50">
      <Container>
        <nav className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={isDarkMode 
                ? "/crosspay-solutions-logo-color.svg"   
                : "/crosspay-solutions-logo-blanco.svg"  
              }
              alt="Crosspay Solutions"
              className="h-10 w-auto"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Selector de idioma */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-bgSec-light dark:bg-bgSec-dark border border-line-light dark:border-line-dark rounded px-2 py-1 text-titles-light dark:text-titles-dark text-sm"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>

            {/* Botón de login */}
            <a
              href="/login"
              className="bg-gradient-to-r from-accent1 to-accent3 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition shadow-md hidden md:block"
            >
              {t('header.login')}
            </a>
          </div>
        </nav>
      </Container>
    </header>
  );
}