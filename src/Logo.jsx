const LOGO = {
  white: '/logo-white.png',
  black: '/logo-black.png',
}

export default function Logo({ variant = 'white', className = '', alt = 'DEVNDIS', ...props }) {
  return <img src={LOGO[variant] || LOGO.white} alt={alt} className={'brand-logo' + (className ? ' ' + className : '')} {...props} />
}
