import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useCart } from '../lib/cart.jsx'
import CartDrawer from './CartDrawer'

export default function Nav() {
  const { pathname } = useLocation()
  const { totalItems } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const active = (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path))

  return (
    <>
      <nav style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--rule)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4px 32px',
          borderBottom: '1px solid var(--rule)',
          position: 'relative',
        }}>
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

          {totalItems > 0 && (
            <button
              onClick={() => setCartOpen(true)}
              style={{
                position: 'absolute',
                right: '32px',
                background: 'var(--forest)',
                border: 'none',
                color: '#a8d4b4',
                padding: '8px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                fontFamily: 'sans-serif',
              }}
            >
              🛒 <span>{totalItems}</span>
            </button>
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
            { label: 'Accessories', to: '/accessories' },
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

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  )
}
