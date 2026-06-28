import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../lib/api'
import { FINDER_TABS } from '../lib/shopDepartments'
import ProductGrid from '../components/ProductGrid'

const FILTER_FIELDS = {
  firearms: [
    { key: 'subcategory', label: 'Firearm Type' },
    { key: 'manufacturer', label: 'Brand' },
  ],
  ammunition: [
    { key: 'subcategory', label: 'Ammo Type' },
    { key: 'manufacturer', label: 'Brand' },
  ],
  optics: [
    { key: 'subcategory', label: 'Optic Type' },
    { key: 'manufacturer', label: 'Brand' },
  ],
  accessories: [
    { key: 'subcategory', label: 'Product Type' },
    { key: 'manufacturer', label: 'Brand' },
  ],
}

export default function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const finder = searchParams.get('finder') || 'accessories'
  const subcategory = searchParams.get('subcategory') || ''
  const manufacturer = searchParams.get('manufacturer') || ''
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const hasSearched = searchParams.has('q')

  const [draft, setDraft] = useState({ subcategory, manufacturer, search })
  const [items, setItems] = useState([])
  const [filterOptions, setFilterOptions] = useState({ subcategories: [], manufacturers: [] })
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setDraft({ subcategory, manufacturer, search })
  }, [subcategory, manufacturer, search])

  const loadFilterOptions = async (tabId) => {
    try {
      const data = await fetchProducts({ finder: tabId, per_page: '1' })
      if (data.filter_options) setFilterOptions(data.filter_options)
    } catch (err) {
      console.error('Failed to load filter options', err)
    }
  }

  const runSearch = async (overrides = {}) => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        finder: overrides.finder ?? finder,
        page: overrides.page ?? page,
        per_page: '24',
      }
      const sub = overrides.subcategory ?? subcategory
      const mfr = overrides.manufacturer ?? manufacturer
      const q = overrides.search ?? search
      if (sub) params.subcategory = sub
      if (mfr) params.manufacturer = mfr
      if (q.trim()) params.search = q.trim()

      const data = await fetchProducts(params)
      setItems(data.items || [])
      setPagination(data.pagination || null)
      if (data.filter_options) setFilterOptions(data.filter_options)
    } catch (err) {
      setError(err.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFilterOptions(finder)
  }, [finder])

  useEffect(() => {
    if (hasSearched) {
      runSearch()
    }
  }, [finder, page, subcategory, manufacturer, search, hasSearched])

  const selectTab = (tabId) => {
    setFilterOptions({ subcategories: [], manufacturers: [] })
    setSearchParams({ finder: tabId })
    setItems([])
    setPagination(null)
    loadFilterOptions(tabId)
  }

  const handleSearch = () => {
    const next = new URLSearchParams()
    next.set('finder', finder)
    next.set('q', '1')
    if (draft.subcategory) next.set('subcategory', draft.subcategory)
    if (draft.manufacturer) next.set('manufacturer', draft.manufacturer)
    if (draft.search.trim()) next.set('search', draft.search.trim())
    setSearchParams(next)
  }

  const updatePage = (nextPage) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(nextPage))
    next.set('q', '1')
    setSearchParams(next)
  }

  const selectStyle = {
    width: '100%',
    background: 'var(--bg2)',
    border: '1px solid var(--rule)',
    color: 'var(--white)',
    padding: '12px 16px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'sans-serif',
    appearance: 'none',
  }

  const fields = FILTER_FIELDS[finder] || FILTER_FIELDS.accessories

  return (
    <div style={{ color: 'var(--white)' }}>
      <div style={{
        padding: '48px 48px 32px',
        borderBottom: '1px solid var(--rule)',
        background: 'var(--bg2)',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '.14em',
          color: 'var(--amber)',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}>Product Finder</div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '44px',
          letterSpacing: '.06em',
          marginBottom: '12px',
        }}>SEARCH THE CATALOG</h1>
        <p style={{ fontSize: '14px', color: 'var(--gun)', maxWidth: '560px', lineHeight: '1.6' }}>
          Filter by category, type, and brand — or browse by department on the{' '}
          <Link to="/shop" style={{ color: 'var(--amber)' }}>Shop</Link> page.
        </p>
      </div>

      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--rule)',
        background: 'var(--logo-blue-dim)',
      }}>
        {FINDER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => selectTab(tab.id)}
            style={{
              flex: 1,
              padding: '18px 12px',
              border: 'none',
              borderBottom: finder === tab.id ? '3px solid var(--amber)' : '3px solid transparent',
              background: 'transparent',
              color: finder === tab.id ? 'var(--white)' : 'var(--muted)',
              fontSize: '11px',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', minHeight: '480px' }}>
        <aside style={{
          width: '320px',
          flexShrink: 0,
          padding: '32px 28px',
          borderRight: '1px solid var(--rule)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          {fields.map(field => (
            <label key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{
                fontSize: '13px',
                color: 'var(--gun)',
              }}>
                {field.label}
              </span>
              <select
                value={draft[field.key] || ''}
                onChange={e => setDraft(d => ({ ...d, [field.key]: e.target.value }))}
                style={selectStyle}
              >
                <option value="">Any</option>
                {(field.key === 'subcategory'
                  ? filterOptions.subcategories
                  : filterOptions.manufacturers
                ).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>
          ))}

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--gun)' }}>Keyword</span>
            <input
              type="text"
              value={draft.search}
              onChange={e => setDraft(d => ({ ...d, search: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Product name..."
              style={{
                ...selectStyle,
                background: 'var(--bg)',
              }}
            />
          </label>

          <button
            onClick={handleSearch}
            style={{
              marginTop: '8px',
              background: 'var(--amber)',
              border: 'none',
              color: 'var(--bg)',
              padding: '14px',
              fontSize: '13px',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              fontWeight: '600',
            }}
          >
            Search
          </button>
        </aside>

        <div style={{ flex: 1, padding: '32px 40px' }}>
          {!hasSearched && (
            <div style={{
              color: 'var(--muted)',
              fontSize: '14px',
              padding: '80px 0',
              textAlign: 'center',
              lineHeight: '1.7',
            }}>
              Choose your filters and click Search to see matching products.
            </div>
          )}

          {hasSearched && loading && (
            <div style={{ color: 'var(--muted)', fontSize: '14px', padding: '48px 0', textAlign: 'center' }}>
              Searching...
            </div>
          )}

          {hasSearched && error && (
            <div style={{ color: 'var(--amber)', fontSize: '14px', padding: '48px 0', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {hasSearched && !loading && !error && (
            <>
              {pagination && (
                <div style={{
                  fontSize: '12px',
                  color: 'var(--muted)',
                  marginBottom: '24px',
                }}>
                  {pagination.total.toLocaleString()} results
                </div>
              )}
              <ProductGrid items={items} emptyMessage="No products match your filters." />

              {pagination && pagination.page_count > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '16px',
                  marginTop: '48px',
                }}>
                  <button
                    onClick={() => updatePage(Math.max(1, page - 1))}
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
                    Page {page} of {pagination.page_count}
                  </span>
                  <button
                    onClick={() => updatePage(page + 1)}
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
