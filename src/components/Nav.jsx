import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Nav() {
  const { pathname } = useLocation()
  const active = (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path))

  return (
    <nav
      style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--rule)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4px 32px',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <Link to="/">
          <img
            src={logo}
            alt="Hangar One Precision"
            style={{
              height: '200px',
              width: 'auto',
              maxWidth: '90vw',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          { label: 'Portfolio', to: '/portfolio' },
          { label: 'About', to: '/about' },
        ].map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            style={{
              color: active(to) ? 'var(--white)' : 'var(--muted)',
              fontSize: '12px',
              letterSpacing: '.1em',
              padding: '0 28px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              borderRight: '1px solid var(--rule)',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </Link>
        ))}
        <Link
          to="/contact"
          style={{
            color: active('/contact') ? '#a8c4f4' : 'var(--muted)',
            fontSize: '12px',
            letterSpacing: '.1em',
            padding: '0 28px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            background: active('/contact') ? 'var(--logo-blue-dim)' : 'transparent',
            textTransform: 'uppercase',
          }}
        >
          Contact
        </Link>
      </div>
    </nav>
  )
}
