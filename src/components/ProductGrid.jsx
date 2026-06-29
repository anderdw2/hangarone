import { useState } from 'react'
import { useCart } from '../lib/cart.jsx'

const formatPrice = (price) => {
  const n = parseFloat(price)
  return Number.isFinite(n) ? n.toFixed(2) : '0.00'
}

export default function ProductGrid({ items, emptyMessage }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState({})

  const handleAddToCart = (item) => {
    addItem(item)
    const id = item.sku || item.id
    setAdded(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setAdded(prev => ({ ...prev, [id]: false }))
    }, 1500)
  }

  if (!items.length) {
    return (
      <div style={{
        color: 'var(--muted)',
        fontSize: '14px',
        padding: '48px 0',
        textAlign: 'center',
      }}>
        {emptyMessage || 'No products found.'}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
      {items.map(item => {
        const id = item.sku || item.id
        return (
          <div key={id} style={{
            background: 'var(--bg2)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '260px',
            flexGrow: 1,
            maxWidth: '400px',
          }}>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  maxHeight: '160px',
                  objectFit: 'contain',
                  marginBottom: '4px',
                }}
              />
            )}
            <div style={{
              fontSize: '9px',
              letterSpacing: '.12em',
              color: 'var(--gun)',
              textTransform: 'uppercase',
            }}>
              {item.sub_category || item.parent_category || item.category}
            </div>
            {item.stock !== undefined && (
              <div style={{
                fontSize: '9px',
                letterSpacing: '.12em',
                color: item.stock > 0 ? '#a8d4b4' : 'var(--muted)',
                textTransform: 'uppercase',
              }}>
                {item.stock > 0 ? `In Stock (${item.stock})` : 'Out of Stock'}
              </div>
            )}
            <div style={{
              fontSize: '13px',
              color: 'var(--white)',
              lineHeight: '1.4',
              fontWeight: '500',
              flexGrow: 1,
            }}>
              {item.name}
            </div>
            {item.sku && (
              <div style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '.06em' }}>
                SKU: {item.sku}
              </div>
            )}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '8px',
              paddingTop: '12px',
              borderTop: '1px solid var(--rule)',
            }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '22px',
                letterSpacing: '.04em',
                color: 'var(--amber)',
              }}>
                ${formatPrice(item.price)}
              </div>
              <button
                onClick={() => handleAddToCart(item)}
                style={{
                  fontSize: '10px',
                  letterSpacing: '.1em',
                  color: added[id] ? '#080808' : '#a8d4b4',
                  background: added[id] ? '#a8d4b4' : 'var(--forest)',
                  padding: '6px 14px',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'sans-serif',
                  transition: 'all 0.2s',
                }}
              >
                {added[id] ? '✓ Added' : 'Add to Cart'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
