import { Loader2 } from "lucide-react";

const Button = ({
  variant = "primary",
  size = "medium",
  isLoading = false,
  children,
  icon: Icon,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visibl:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ";
  const variantClasses = {
    primary: "bg-blue-900 hover:bg-blue-800 text-white",
    outline: " bg-white hover:bg-slate-50 text-slate-200",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
  };

  const sizeClasses = {
    small: "h-8 px-3 py-1 text-sm",
    medium: "h-10 px-4 py-2 text-sm",
    large: "h-12 px-6 py-3 text-base",
    xl: "h-14 px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${props.className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="h-5 w-5 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};
export default Button;
