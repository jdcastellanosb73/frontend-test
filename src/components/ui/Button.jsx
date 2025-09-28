export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) {
  const baseClasses = "px-4 py-2 rounded-lg font-semibold transition focus:outline-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent1 to-accent3 text-white hover:opacity-90 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    secondary: "border-2 border-accent3 text-accent3 hover:bg-accent3 hover:text-white",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}