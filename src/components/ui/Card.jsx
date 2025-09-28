export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-bgSec-light dark:bg-bgSec-dark rounded-2xl p-6 shadow-xl border border-line-light dark:border-line-dark relative overflow-hidden ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent1 to-accent2"></div>
      {children}
    </div>
  );
}