export const PRODUCTS_URL = 'https://getproducts-fd7m3vtzba-uc.a.run.app'

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  }
  const res = await fetch(`${PRODUCTS_URL}?${query}`)
  const data = await res.json()
  if (!res.ok || data.error) {
    const msg = typeof data.error === 'string'
      ? data.error
      : data.error?.message || 'Failed to load products.'
    throw new Error(msg)
  }
  return data
}