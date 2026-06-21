import { useState, useEffect } from 'react'

const FUNCTION_URL = 'https://getaccessories-201160203866.us-central1.run.app'

export default function Shop() {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const fetchItems = async (p = 1) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${FUNCTION_URL}?page=${p}&per_page=24`)
      const data = await res.json()
      setItems(data.items || [])
      setPagination(data.pagination || null)
    } catch (err) {
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems(page)
  }, [page])

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ color: 'var(--white)' }}>

      {/* Hero */}
      <div style={{
        padding: '56px 48px 40px',
        borderBottom: '1px solid var(--rule)',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '.14em',
          color: 'var(--amber)',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}>Shop</div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '52px',
          letterSpacing: '.06em',
          color: 'var(--white)',
          marginBottom: '16px',
        }}>FIREARMS &amp; ACCESSORIES</h1>
        <p style={{
          fontSize: '14px',
          color: 'var(--gun)',
          maxWidth: '580px',
          lineHeight: '1.7',
        }}>
          Browse our full selection. Pricing shown is our dealer price — contact us to place an order or ask about availability.
        </p>
      </div>

      {/* Search + controls */}
      <div style={{
        padding: '24px 48px',
        borderBottom: '1px solid var(--rule)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--rule)',
            color: 'var(--white)',
            padding: '10px 16px',
            fontSize: '13px',
            outline: 'none',
            width: '300px',
          }}
        />
        {pagination && (
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: 'auto' }}>
            Page {pagination.page} of {pagination.page_count.toLocaleString()}
          </div>
        )}
      </div>

      {/* Product grid */}
      <div style={{ padding: '32px 48px' }}>
        {loading && (
          <div style={{ color: 'var(--muted)', fontSize: '14px', padding: '48px 0', textAlign: 'center' }}>
            Loading products...
          </div>
        )}

        {error && (
          <div style={{ color: 'var(--amber)', fontSize: '14px', padding: '48px 0', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '2px',
            background: 'var(--rule)',
          }}>
            {filtered.map(item => (
              <div
                key={item.cssi_id}
                style={{
                  background: 'var(--bg2)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{
                  fontSize: '9px',
                  letterSpacing: '.12em',
                  color: item.in_stock_flag ? 'var(--forest)' : 'var(--muted)',
                  textTransform: 'uppercase',
                }}>
                  {item.in_stock_flag ? `In Stock (${item.inventory})` : 'Out of Stock'}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--white)',
                  lineHeight: '1.4',
                  fontWeight: '500',
                  flexGrow: 1,
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--muted)',
                  letterSpacing: '.06em',
                }}>
                  SKU: {item.cssi_id}
                </div>
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
                    ${item.custom_price?.toFixed(2)}
                  </div>
                  <a
                    href="/contact"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '.1em',
                      color: '#a8d4b4',
                      background: 'var(--forest)',
                      padding: '6px 14px',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                  >
                    Order
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            marginTop: '48px',
          }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--rule)',
                color: page === 1 ? 'var(--muted)' : 'var(--white)',
                padding: '10px 24px',
                fontSize: '11px',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Page {page} of {Number(pagination.page_count).toLocaleString()}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= pagination.page_count}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--rule)',
                color: page >= pagination.page_count ? 'var(--muted)' : 'var(--white)',
                padding: '10px 24px',
                fontSize: '11px',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                cursor: page >= pagination.page_count ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
  )
}