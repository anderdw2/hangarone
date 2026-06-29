import { useState } from 'react'
import { useCart } from '../lib/cart.jsx'
import OrderModal from './OrderModal'

export default function CartDrawer({ onClose }) {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const [checkout, setCheckout] = useState(false)

  if (checkout) {
    return (
      <OrderModal
        items={items}
        onClose={() => setCheckout(false)}
        onSuccess={() => {
          clearCart()
          onClose()
        }}
      />
    )
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
        }}
      />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '420px',
        maxWidth: '100vw',
        background: 'var(--bg)',
        borderLeft: '1px solid var(--rule)',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--rule)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '24px',
            letterSpacing: '.06em',
            color: 'var(--white)',
          }}>CART ({items.length})</div>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--muted)',
            fontSize: '20px',
            cursor: 'pointer',
          }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {items.length === 0 && (
            <div style={{ color: 'var(--muted)', fontSize: '14px', textAlign: 'center', padding: '48px 0' }}>
              Your cart is empty.
            </div>
          )}
          {items.map(item => {
            const id = item.sku || item.id
            return (
              <div key={id} style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                paddingBottom: '24px',
                borderBottom: '1px solid var(--rule)',
              }}>
                {item.image && (
                  <img src={item.image} alt={item.name} style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'contain',
                    flexShrink: 0,
                  }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: 'var(--white)', marginBottom: '4px', lineHeight: '1.4' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>
                    SKU: {item.sku}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => updateQuantity(id, item.quantity - 1)}
                        style={{
                          background: 'var(--bg2)',
                          border: '1px solid var(--rule)',
                          color: 'var(--white)',
                          width: '28px',
                          height: '28px',
                          cursor: 'pointer',
                          fontSize: '16px',
                        }}
                      >−</button>
                      <span style={{ fontSize: '14px', color: 'var(--white)', minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(id, item.quantity + 1)}
                        style={{
                          background: 'var(--bg2)',
                          border: '1px solid var(--rule)',
                          color: 'var(--white)',
                          width: '28px',
                          height: '28px',
                          cursor: 'pointer',
                          fontSize: '16px',
                        }}
                      >+</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '20px',
                        color: 'var(--amber)',
                      }}>
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeItem(id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--muted)',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >✕</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {items.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid var(--rule)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '13px', color: 'var(--gun)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                Subtotal
              </div>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '28px',
                color: 'var(--amber)',
              }}>
                ${subtotal.toFixed(2)}
              </div>
            </div>
            <button
              onClick={() => setCheckout(true)}
              style={{
                width: '100%',
                background: 'var(--forest)',
                color: '#a8d4b4',
                border: 'none',
                padding: '14px',
                fontSize: '11px',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                marginBottom: '8px',
              }}
            >
              Checkout
            </button>
            <button
              onClick={clearCart}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid var(--rule)',
                color: 'var(--muted)',
                padding: '10px',
                fontSize: '11px',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
              }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}