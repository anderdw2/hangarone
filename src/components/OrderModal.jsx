import { useState } from 'react'

const CHECKOUT_SESSION_URL = 'https://createcheckoutsession-fd7m3vtzba-uc.a.run.app'

const inputStyle = {
  width: '100%',
  background: '#0d1318',
  border: '1px solid #3a4d55',
  color: '#f0ede8',
  padding: '12px 16px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'sans-serif',
  marginBottom: '16px',
}

const labelStyle = {
  display: 'block',
  fontSize: '10px',
  letterSpacing: '.1em',
  color: '#7d8fa1',
  textTransform: 'uppercase',
  marginBottom: '6px',
}

export default function OrderModal({ items, onClose, onSuccess }) {
  const [step, setStep] = useState('info')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hasFirearm = items?.some(i => i.department === 'firearms')
  const subtotal = items?.reduce((sum, i) => sum + (parseFloat(i.price) * (i.quantity || 1)), 0) || 0

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    fflName: '',
    fflAddress: '',
    fflCity: '',
    fflState: '',
    fflZip: '',
    fflPhone: '',
    shippingMethod: 'pickup',
  })

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleStartPayment = async () => {
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in all required fields.')
      return
    }
    if (hasFirearm && (!form.fflName || !form.fflAddress || !form.fflState)) {
      setError('Please provide your FFL dealer information for firearm items.')
      return
    }
    if (!hasFirearm && form.shippingMethod === 'ship' && (!form.address || !form.city || !form.state || !form.zip)) {
      setError('Please provide a shipping address.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const shippingCost = (!hasFirearm && form.shippingMethod === 'ship') ? 15 : 0
      const total = (subtotal + shippingCost).toFixed(2)

      const products = items.map(item => ({
        name: item.name,
        price: (parseFloat(item.price) * (item.quantity || 1)).toFixed(2),
        quantity: item.quantity || 1,
        logoUrl: item.image || '',
      }))

      if (shippingCost > 0) {
        products.push({
          name: 'Shipping',
          price: shippingCost.toFixed(2),
          quantity: 1,
          logoUrl: '',
        })
      }

      const res = await fetch(CHECKOUT_SESSION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products,
          orderInfo: {
            hasFirearm,
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            shippingMethod: hasFirearm ? 'ffl' : form.shippingMethod,
            fflName: form.fflName,
            fflAddress: form.fflAddress,
            fflCity: form.fflCity,
            fflState: form.fflState,
            fflZip: form.fflZip,
            fflPhone: form.fflPhone,
            items: items.map(i => ({ sku: i.sku || i.id, name: i.name, price: i.price, quantity: i.quantity || 1 })),
          },
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error?.message || data.error || 'Failed to start checkout.')
        setLoading(false)
        return
      }

      const token = data.token
      if (!token) {
        setError('No checkout token returned.')
        setLoading(false)
        return
      }

      setStep('payment')
      setLoading(false)

      setTimeout(async () => {
        try {
          await window.checkout.mount(token, 'north-payment-fields')
        } catch (mountErr) {
          setError('Failed to load payment form: ' + mountErr.message)
        }
      }, 300)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleSubmitPayment = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await window.checkout.submit()
      if (result?.error) {
        setError(result.error.message || 'Payment failed.')
        setLoading(false)
      } else {
        setStep('success')
        setLoading(false)
      }
    } catch (err) {
      setError('Payment failed: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: '#080808',
        border: '1px solid #3a4d55',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '40px',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#7d8fa1',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >✕</button>

        {/* Order summary */}
        <div style={{
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '1px solid #3a4d55',
        }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#f0ede8', marginBottom: '16px' }}>
            ORDER SUMMARY
          </div>
          {items?.map(item => (
            <div key={item.sku || item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              <div style={{ fontSize: '13px', color: '#afc0ce', flex: 1, paddingRight: '16px' }}>
                {item.name} {item.quantity > 1 ? `x${item.quantity}` : ''}
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: '#c89b3c' }}>
                ${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}
              </div>
            </div>
          ))}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #3a4d55',
          }}>
            <div style={{ fontSize: '11px', color: '#7d8fa1', letterSpacing: '.1em', textTransform: 'uppercase' }}>Subtotal</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#c89b3c' }}>
              ${subtotal.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Success */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: '#a8d4b4', marginBottom: '16px' }}>
              ORDER PLACED!
            </div>
            <p style={{ fontSize: '14px', color: '#7d8fa1', lineHeight: '1.7', marginBottom: '24px' }}>
              Thank you for your order. We'll be in touch shortly to confirm details
              {hasFirearm ? ' and coordinate the FFL transfer.' : '.'}
            </p>
            <button onClick={() => { onSuccess?.(); onClose(); }} style={{
              background: '#2d5a3d',
              color: '#a8d4b4',
              border: 'none',
              padding: '12px 32px',
              fontSize: '11px',
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}>Close</button>
          </div>
        )}

        {/* Info step */}
        {step === 'info' && (
          <>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#f0ede8', marginBottom: '24px' }}>
              YOUR INFORMATION
            </div>

            <label style={labelStyle}>Full Name *</label>
            <input style={inputStyle} value={form.name} onChange={set('name')} placeholder="John Smith" />

            <label style={labelStyle}>Email *</label>
            <input style={inputStyle} type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" />

            <label style={labelStyle}>Phone *</label>
            <input style={inputStyle} type="tel" value={form.phone} onChange={set('phone')} placeholder="555-555-5555" />

            {hasFirearm && (
              <>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#c89b3c', margin: '24px 0 16px' }}>
                  FFL DEALER INFORMATION
                </div>
                <p style={{ fontSize: '13px', color: '#7d8fa1', lineHeight: '1.6', marginBottom: '20px' }}>
                  Firearms must be transferred through a licensed FFL dealer. Please provide your local dealer's information below.
                </p>
                <label style={labelStyle}>FFL Dealer Name *</label>
                <input style={inputStyle} value={form.fflName} onChange={set('fflName')} placeholder="Local Gun Shop LLC" />
                <label style={labelStyle}>FFL Address *</label>
                <input style={inputStyle} value={form.fflAddress} onChange={set('fflAddress')} placeholder="123 Main St" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px', gap: '8px' }}>
                  <div>
                    <label style={labelStyle}>City *</label>
                    <input style={{ ...inputStyle }} value={form.fflCity} onChange={set('fflCity')} placeholder="City" />
                  </div>
                  <div>
                    <label style={labelStyle}>State *</label>
                    <input style={{ ...inputStyle }} value={form.fflState} onChange={set('fflState')} placeholder="PA" maxLength={2} />
                  </div>
                  <div>
                    <label style={labelStyle}>Zip</label>
                    <input style={{ ...inputStyle }} value={form.fflZip} onChange={set('fflZip')} placeholder="17201" />
                  </div>
                </div>
                <label style={labelStyle}>FFL Phone</label>
                <input style={inputStyle} value={form.fflPhone} onChange={set('fflPhone')} placeholder="555-555-5555" />
              </>
            )}

            {!hasFirearm && (
              <>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: '#c89b3c', margin: '24px 0 16px' }}>
                  DELIVERY METHOD
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#f0ede8', cursor: 'pointer' }}>
                    <input type="radio" name="shipping" value="pickup" checked={form.shippingMethod === 'pickup'} onChange={set('shippingMethod')} />
                    Local Pickup (Free)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#f0ede8', cursor: 'pointer' }}>
                    <input type="radio" name="shipping" value="ship" checked={form.shippingMethod === 'ship'} onChange={set('shippingMethod')} />
                    Ship to Me (+$15.00)
                  </label>
                </div>
                {form.shippingMethod === 'ship' && (
                  <>
                    <label style={labelStyle}>Address *</label>
                    <input style={inputStyle} value={form.address} onChange={set('address')} placeholder="123 Main St" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px', gap: '8px' }}>
                      <div>
                        <label style={labelStyle}>City *</label>
                        <input style={{ ...inputStyle }} value={form.city} onChange={set('city')} placeholder="City" />
                      </div>
                      <div>
                        <label style={labelStyle}>State *</label>
                        <input style={{ ...inputStyle }} value={form.state} onChange={set('state')} placeholder="PA" maxLength={2} />
                      </div>
                      <div>
                        <label style={labelStyle}>Zip *</label>
                        <input style={{ ...inputStyle }} value={form.zip} onChange={set('zip')} placeholder="17201" />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {error && <div style={{ color: '#c89b3c', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

            <button
              onClick={handleStartPayment}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#3d4e5c' : '#2d5a3d',
                color: '#a8d4b4',
                border: 'none',
                padding: '14px',
                fontSize: '11px',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'sans-serif',
                marginTop: '8px',
              }}
            >
              {loading ? 'Setting up payment...' : 'Continue to Payment'}
            </button>
          </>
        )}

        {/* Payment step */}
        {step === 'payment' && (
          <>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#f0ede8', marginBottom: '24px' }}>
              PAYMENT
            </div>

            <div id="north-payment-fields" style={{ marginBottom: '24px', minHeight: '200px' }} />

            {error && <div style={{ color: '#c89b3c', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

            <button
              onClick={handleSubmitPayment}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#3d4e5c' : '#2d5a3d',
                color: '#a8d4b4',
                border: 'none',
                padding: '14px',
                fontSize: '11px',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'sans-serif',
              }}
            >
              {loading ? 'Processing...' : `Pay $${(subtotal + (!hasFirearm && form.shippingMethod === 'ship' ? 15 : 0)).toFixed(2)}`}
            </button>

            <button
              onClick={() => setStep('info')}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid #3a4d55',
                color: '#7d8fa1',
                padding: '12px',
                fontSize: '11px',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                marginTop: '8px',
              }}
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}