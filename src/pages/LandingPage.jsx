import { useLanguage } from '../context/LanguageContext';
import Header from '../components/layout/Header';
import Container from '../components/layout/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const FeaturesSection = ({ t }) => {
  const features = [
    {
      title: t('features.instantOnboarding.title'),
      description: t('features.instantOnboarding.description'),
      icon: "⚡"
    },
    {
      title: t('features.globalPayouts.title'),
      description: t('features.globalPayouts.description'),
      icon: "🌍"
    },
    {
      title: t('features.revenueSharing.title'),
      description: t('features.revenueSharing.description'),
      icon: "💰"
    },
    {
      title: t('features.riskManagement.title'),
      description: t('features.riskManagement.description'),
      icon: "🛡️"
    }
  ];

  return (
    <div className="py-20 bg-bgPpal-light dark:bg-bgPpal-dark">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-titles-light dark:text-titles-dark mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-pg-light dark:text-pg-dark max-w-2xl mx-auto">
            {t('features.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-bgSec-light dark:bg-bgSec-dark p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-line-light dark:border-line-dark"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-titles-light dark:text-titles-dark mb-3">
                {feature.title}
              </h3>
              <p className="text-pg-light dark:text-pg-dark">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-bgPpal-light dark:bg-bgPpal-dark font-sans">
      <Header />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-[-50%] right-[-20%] w-[200%] h-[200%] bg-gradient-to-br from-accent1 to-accent2 rounded-full transform -rotate-45"></div>
        </div>

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold text-titles-light dark:text-titles-dark leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-pg-light dark:text-pg-dark leading-relaxed">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/signup">
                  <Button variant="primary">{t('hero.ctaStart')}</Button>
                </a>
                <a
                  href="https://crosspaysolutions.com/contact-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="secondary">{t('hero.ctaContact')}</Button>
                </a>
              </div>
            </div>

            <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex justify-between items-center pb-4 border-b border-line-light dark:border-line-dark mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-r from-accent1 to-accent2 flex items-center justify-center text-white font-bold">
                    L
                  </div>
                  <div>
                    <div className="font-semibold text-titles-light dark:text-titles-dark">Lyft</div>
                    <div className="text-sm text-pg-light dark:text-pg-dark">Personal</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-titles-light dark:text-titles-dark">$12.47</div>
              </div>

              <div className="space-y-4 opacity-80">
                <div>
                  <label className="block text-sm font-medium text-titles-light dark:text-titles-dark mb-2">
                    {t('payment.method')}
                  </label>
                  <div className="flex gap-2">
                    {['VISA', 'MC', 'AMEX', 'PP'].map((m) => (
                      <div
                        key={m}
                        className="w-10 h-7 flex items-center justify-center bg-bgPpal-light dark:bg-bgPpal-dark border border-line-light dark:border-line-dark rounded text-xs font-bold text-pg-light dark:text-pg-dark"
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-titles-light dark:text-titles-dark mb-1">
                    {t('payment.cardNumber')}
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-line-light dark:border-line-dark rounded-lg bg-bgPpal-light dark:bg-bgPpal-dark text-titles-light dark:text-titles-dark opacity-50">
                    •••• •••• •••• ••••
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-titles-light dark:text-titles-dark mb-1">
                      {t('payment.expiry')}
                    </label>
                    <div className="w-full px-4 py-3 border-2 border-line-light dark:border-line-dark rounded-lg bg-bgPpal-light dark:bg-bgPpal-dark text-titles-light dark:text-titles-dark opacity-50">
                      ••/••
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-titles-light dark:text-titles-dark mb-1">
                      {t('payment.cvv')}
                    </label>
                    <div className="w-full px-4 py-3 border-2 border-line-light dark:border-line-dark rounded-lg bg-bgPpal-light dark:bg-bgPpal-dark text-titles-light dark:text-titles-dark opacity-50">
                      •••
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-titles-light dark:text-titles-dark mb-1">
                    {t('payment.cardHolder')}
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-line-light dark:border-line-dark rounded-lg bg-bgPpal-light dark:bg-bgPpal-dark text-titles-light dark:text-titles-dark opacity-50">
                    {t('payment.cardHolder')}
                  </div>
                </div>

                <div className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-accent1 to-accent2 opacity-70">
                  {t('payment.payButton')}
                </div>

                <div className="flex items-center gap-1 text-sm text-pg-light dark:text-pg-dark">
                  {t('payment.security')}
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>
      <FeaturesSection t={t} />
    </div>
  );
}