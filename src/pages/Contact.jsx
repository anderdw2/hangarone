import { useState } from 'react'
import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_bzytexi'
const TEMPLATE_ID = 'template_sp1rqsa'
const PUBLIC_KEY = 'ZfdkljRVv91BQhqBJ'

export default function Contact() {
  const [form, setForm] = useState({
    from_name: '',
    from_email: '',
    phone: '',
    inquiry_type: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.from_name || !form.from_email || !form.inquiry_type || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    setSending(true)
    setError('')
    setSuccess('')
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      setSuccess('Message sent! We\'ll get back to you shortly.')
      setForm({ from_name: '', from_email: '', phone: '', inquiry_type: '', message: '' })
    } catch (err) {
      setError('Failed to send message. Please try again or email us directly.')
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--bg2)',
    border: '1px solid var(--rule)',
    color: 'var(--white)',
    padding: '12px 16px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '.1em',
    color: 'var(--gun)',
    textTransform: 'uppercase',
    marginBottom: '8px',
  }

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
        }}>Contact Us</div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '52px',
          letterSpacing: '.06em',
          color: 'var(--white)',
          marginBottom: '16px',
        }}>LET'S TALK GUNS</h1>
        <p style={{
          fontSize: '14px',
          color: 'var(--gun)',
          maxWidth: '520px',
          lineHeight: '1.7',
        }}>
          Questions about a build, looking for a specific firearm, or just getting started? Reach out and we'll get back to you as soon as possible.
        </p>
      </div>

      {/* Form + Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2px',
        background: 'var(--rule)',
      }}>

        {/* Form */}
        <div style={{ background: 'var(--bg)', padding: '56px 48px' }}>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Name *</label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.from_name}
              onChange={e => setForm({ ...form, from_name: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.from_email}
              onChange={e => setForm({ ...form, from_email: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Phone</label>
            <input
              type="tel"
              placeholder="Your phone number"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Inquiry Type *</label>
            <select
              value={form.inquiry_type}
              onChange={e => setForm({ ...form, inquiry_type: e.target.value })}
              style={{ ...inputStyle, appearance: 'none' }}
            >
              <option value="">Select an inquiry type...</option>
              <option value="Purchase a Firearm">Purchase a Firearm</option>
              <option value="Purchase an Accessory">Purchase an Accessory</option>
              <option value="Custom Build">Custom Build</option>
              <option value="General Question">General Question</option>
            </select>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>Message *</label>
            <textarea
              placeholder="Tell us what you're looking for..."
              rows={6}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {error && (
            <div style={{ color: 'var(--amber)', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ color: '#a8d4b4', fontSize: '13px', marginBottom: '16px' }}>
              {success}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={sending}
            style={{
              background: sending ? 'var(--gun-dim)' : 'var(--forest)',
              color: '#a8d4b4',
              fontSize: '11px',
              letterSpacing: '.1em',
              padding: '14px 36px',
              textTransform: 'uppercase',
              border: 'none',
              cursor: sending ? 'not-allowed' : 'pointer',
              fontFamily: 'sans-serif',
            }}
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </div>

        {/* Contact Info */}
        <div style={{ background: 'var(--bg)', padding: '56px 48px', borderLeft: '1px solid var(--rule)' }}>
          <div style={{
            fontSize: '9px',
            letterSpacing: '.14em',
            color: 'var(--amber)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>Direct Contact</div>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '36px',
            letterSpacing: '.06em',
            color: 'var(--white)',
            marginBottom: '32px',
          }}>REACH OUT DIRECTLY</h2>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '.1em', color: 'var(--gun)', textTransform: 'uppercase', marginBottom: '8px' }}>Owner</div>
            <div style={{ fontSize: '16px', color: 'var(--white)' }}>Dave Anderson</div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '.1em', color: 'var(--gun)', textTransform: 'uppercase', marginBottom: '8px' }}>Email</div>
            <a href="mailto:danderson@hangaroneprecision.com" style={{
              fontSize: '15px',
              color: 'var(--amber)',
              textDecoration: 'none',
            }}>danderson@hangaroneprecision.com</a>
          </div>

          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '.1em', color: 'var(--gun)', textTransform: 'uppercase', marginBottom: '8px' }}>Phone</div>
            <a href="tel:7178600163" style={{
              fontSize: '15px',
              color: 'var(--amber)',
              textDecoration: 'none',
            }}>717.860.0163</a>
          </div>

          <div style={{
            borderTop: '1px solid var(--rule)',
            paddingTop: '32px',
          }}>
            <div style={{ fontSize: '10px', letterSpacing: '.1em', color: 'var(--gun)', textTransform: 'uppercase', marginBottom: '12px' }}>Hours</div>
            <div style={{ fontSize: '14px', color: 'var(--gun)', lineHeight: '1.8' }}>
              By appointment only.<br />
              We'll work around your schedule.
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}