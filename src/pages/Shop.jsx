import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { db } from '../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { fetchProducts } from '../lib/api'
import { DEPARTMENTS } from '../lib/shopDepartments'
import ProductGrid from '../components/ProductGrid'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const department = searchParams.get('department') || ''
  const subcategory = searchParams.get('subcategory') || ''
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  const [tab, setTab] = useState(department ? 'products' : 'browse')

  const [customItems, setCustomItems] = useState([])
  const [customLoading, setCustomLoading] = useState(true)

  const [items, setItems] = useState([])
  const [departmentCounts, setDepartmentCounts] = useState({})
  const [filterOptions, setFilterOptions] = useState({ subcategories: [], manufacturers: [] })
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadCustomItems = async () => {
    setCustomLoading(true)
    try {
      const snap = await getDocs(collection(db, 'custom_inventory'))
      setCustomItems(
        snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(i => i.in_stock),
      )
    } catch (err) {
      console.error('Failed to load custom inventory', err)
    } finally {
      setCustomLoading(false)
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, per_page: '24' }
      if (department) params.department = department
      if (subcategory) params.subcategory = subcategory
      if (search.trim()) params.search = search.trim()

      const data = await fetchProducts(params)
      setItems(data.items || [])
      setPagination(data.pagination || null)
      if (data.department_counts) setDepartmentCounts(data.department_counts)
      if (data.filter_options) setFilterOptions(data.filter_options)
    } catch (err) {
      setError(err.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomItems()
  }, [])

  useEffect(() => {
    if (tab === 'products' || tab === 'browse') {
      loadProducts()
    }
  }, [tab, page, department, subcategory, search])

  useEffect(() => {
    if (department) setTab('products')
  }, [department])

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(updates)) {
      if (value === '' || value === null || value === undefined) {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
    }
    if (!('page' in updates)) next.delete('page')
    setSearchParams(next)
  }

  const selectDepartment = (id) => {
    setTab('products')
    setSearchParams(id ? { department: id } : {})
  }

  const deptLabel = DEPARTMENTS.find(d => d.id === department)?.label

  const tabStyle = (t) => ({
    padding: '14px 32px',
    fontSize: '11px',
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    border: 'none',
    borderBottom: tab === t ? '2px solid var(--amber)' : '2px solid transparent',
    background: 'transparent',
    color: tab === t ? 'var(--white)' : 'var(--muted)',
    fontFamily: 'sans-serif',
  })

  const selectStyle = {
    background: 'var(--bg2)',
    border: '1px solid var(--rule)',
    color: 'var(--white)',
    padding: '10px 16px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'sans-serif',
    minWidth: '220px',
  }

  return (
    <div style={{ color: 'var(--white)' }}>
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
          Browse by department or use our{' '}
          <Link to="/accessories" style={{ color: 'var(--amber)' }}>Product Finder</Link>
          {' '}to search by type, brand, and more.
        </p>
      </div>

      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--rule)',
        padding: '0 48px',
      }}>
        <button style={tabStyle('inventory')} onClick={() => setTab('inventory')}>
          Current Inventory
        </button>
        <button style={tabStyle('browse')} onClick={() => { setTab('browse'); setSearchParams({}) }}>
          Browse by Department
        </button>
        {department && (
          <button style={tabStyle('products')} onClick={() => setTab('products')}>
            {deptLabel}
          </button>
        )}
      </div>

      {tab === 'inventory' && (
        <div style={{ padding: '32px 48px' }}>
          {customLoading && (
            <div style={{ color: 'var(--muted)', fontSize: '14px', padding: '48px 0', textAlign: 'center' }}>
              Loading inventory...
            </div>
          )}
          {!customLoading && customItems.length === 0 && (
            <div style={{ color: 'var(--muted)', fontSize: '14px', padding: '48px 0', textAlign: 'center' }}>
              No current inventory — check back soon or browse by department.
            </div>
          )}
          {!customLoading && customItems.length > 0 && (
            <ProductGrid items={customItems} />
          )}
        </div>
      )}

      {tab === 'browse' && !department && (
        <div style={{ padding: '32px 48px' }}>
          <p style={{
            fontSize: '13px',
            color: 'var(--gun)',
            marginBottom: '24px',
            maxWidth: '640px',
            lineHeight: '1.6',
          }}>
            Choose a department to browse our full in-stock catalog.
          </p>
          {loading && !Object.keys(departmentCounts).length && (
            <div style={{ color: 'var(--muted)', fontSize: '14px', padding: '24px 0' }}>
              Loading departments...
            </div>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '2px',
          }}>
            {DEPARTMENTS.map(dept => (
              <button
                key={dept.id}
                onClick={() => selectDepartment(dept.id)}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--rule)',
                  color: 'var(--white)',
                  padding: '28px 24px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  letterSpacing: '.02em',
                }}>
                  {dept.label}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {(departmentCounts[dept.id] || 0).toLocaleString()} products
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {(tab === 'products' || department) && (
        <div>
          <div style={{
            padding: '24px 48px',
            borderBottom: '1px solid var(--rule)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => { setTab('browse'); setSearchParams({}) }}
              style={{
                background: 'transparent',
                border: '1px solid var(--rule)',
                color: 'var(--muted)',
                padding: '8px 14px',
                fontSize: '11px',
                letterSpacing: '.08em',
                textTransform: 'uppercase',
              }}
            >
              ← All Departments
            </button>
            <input
              type="text"
              placeholder="Search in department..."
              defaultValue={search}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  updateParams({ search: e.target.value, page: '' })
                }
              }}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--rule)',
                color: 'var(--white)',
                padding: '10px 16px',
                fontSize: '13px',
                outline: 'none',
                width: '280px',
              }}
            />
            {pagination && (
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: 'auto' }}>
                {pagination.total.toLocaleString()} products
              </div>
            )}
          </div>

          {department && (
            <div style={{
              padding: '20px 48px',
              borderBottom: '1px solid var(--rule)',
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '28px',
                letterSpacing: '.06em',
                color: 'var(--amber)',
                marginRight: '8px',
              }}>
                {deptLabel}
              </div>
              {filterOptions.subcategories.length > 0 && (
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{
                    fontSize: '9px',
                    letterSpacing: '.12em',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                  }}>Type</span>
                  <select
                    value={subcategory}
                    onChange={e => updateParams({ subcategory: e.target.value, page: '' })}
                    style={selectStyle}
                  >
                    <option value="">All Types</option>
                    {filterOptions.subcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          )}

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
              <ProductGrid
                items={items}
                emptyMessage={`No products found${deptLabel ? ` in ${deptLabel}` : ''}.`}
              />
            )}

            {!loading && pagination && pagination.page_count > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                marginTop: '48px',
              }}>
                <button
                  onClick={() => updateParams({ page: String(Math.max(1, page - 1)) })}
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
                  onClick={() => updateParams({ page: String(page + 1) })}
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
      )}
    </div>
  )
}
