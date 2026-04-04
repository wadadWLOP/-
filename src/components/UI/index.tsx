import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  decorative?: boolean;
}

export function Card({ children, className = '', hover = true, decorative = false }: CardProps) {
  return (
    <div
      className={`
        bg-card rounded-2xl border border-border shadow-sm p-6
        ${decorative ? 'border-t-4 border-t-primary' : ''}
        ${hover ? 'hover-lift' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-full shadow-md transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-[hsl(340,80%,60%)] hover:shadow-lg',
    secondary: 'bg-card border-2 border-primary/20 text-primary hover:bg-accent hover:border-primary/40',
    ghost: 'bg-transparent text-foreground hover:bg-accent shadow-none',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'happy' | 'sweet' | 'touched' | 'sad';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-[hsl(150,60%,95%)] text-[hsl(150,60%,45%)]',
    warning: 'bg-[hsl(35,90%,95%)] text-[hsl(35,90%,60%)]',
    error: 'bg-[hsl(0,70%,95%)] text-[hsl(0,70%,60%)]',
    happy: 'bg-[hsl(45,90%,95%)] text-[hsl(45,80%,40%)]',
    sweet: 'bg-[hsl(340,80%,95%)] text-[hsl(340,70%,50%)]',
    touched: 'bg-[hsl(200,80%,95%)] text-[hsl(200,70%,50%)]',
    sad: 'bg-[hsl(0,70%,95%)] text-[hsl(0,70%,50%)]',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6 text-primary">
          {icon}
        </div>
      )}
      <h3 className="font-heading font-semibold text-xl text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}

export { FloatingCalendar } from './FloatingCalendar';
export { UpcomingAnniversaryCard } from './UpcomingAnniversaryCard';
export { GlobalCatMenu } from './GlobalCatMenu';
export { CoreFeaturesGrid } from './CoreFeaturesGrid';