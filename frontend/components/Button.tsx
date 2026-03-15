import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 shadow-sm hover:-translate-y-0.5'

  const variantStyles = {
    primary: 'bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-700 text-black hover:brightness-105',
    secondary: 'bg-zinc-900 text-amber-100 border border-amber-300/40 hover:bg-zinc-800',
    outline: 'border-2 border-amber-400 text-amber-300 hover:bg-amber-300/10',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
