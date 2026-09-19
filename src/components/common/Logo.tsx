import { Link } from 'react-router-dom'

interface LogoProps {
  to?: string
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const imageSizes = {
  sm: 'h-8 sm:h-10',
  md: 'h-9 sm:h-12',
  lg: 'h-11 sm:h-14',
}

const textSizes = {
  sm: 'text-sm',
  md: 'text-sm sm:text-base',
  lg: 'text-base sm:text-lg',
}

function Logo({ to = '/', variant = 'dark', size = 'md', showText = true, className = '' }: LogoProps) {
  const isLight = variant === 'light'

  return (
    <Link to={to} className={`inline-flex items-center gap-3 ${className}`} aria-label="Ghar Wapasi home">
      <img src="/logo.png" alt="Ghar Wapasi logo" className={`${imageSizes[size]} w-auto rounded-xl object-contain`} />
      {showText && (
        <span className={`font-display font-extrabold tracking-tight ${textSizes[size]}`}>
          <span className={`font-serif font-semibold italic ${isLight ? 'text-white' : 'text-brand-600 dark:text-brand-300'}`}>Ghar</span>{' '}
          <span className={isLight ? 'text-white' : 'text-slate-900'}>Wapasi</span>
        </span>
      )}
    </Link>
  )
}

export default Logo