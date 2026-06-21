import { useState } from 'react'

const CONTACT_EMAIL = 'danderson@hangaroneprecision.com'

const inquiryLabels = {
  'purchase-firearm': 'Purchase a Firearm',
  'purchase-accessory': 'Purchase an Accessory',
  'custom-build': 'Custom Build',
  general: 'General Question',
}

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const inquiryLabel = inquiryLabels[form.inquiryType] || 'Contact Form'
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          inquiryType: inquiryLabel,
          message: form.message,
        }),
      })

      if (!response.ok) throw new Error('Send failed')

      setStatus('success')
      setForm({ name: '', email: '', phone: '', inquiryType: '', message: '' })
    } catch {
      setStatus('error')
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
        background: 'var(--bg)',
      }}>

        {/* Form */}
        <div style={{ background: 'var(--bg)', padding: '56px 48px' }}>
          {status === 'success' ? (
            <div>
              <div style={{
                fontSize: '9px',
                letterSpacing: '.14em',
                color: 'var(--amber)',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>Message Sent</div>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '36px',
                letterSpacing: '.06em',
                color: 'var(--white)',
                marginBottom: '16px',
              }}>WE GOT IT.</h2>
              <p style={{ fontSize: '14px', color: 'var(--gun)', lineHeight: '1.7', marginBottom: '24px' }}>
                Thanks for reaching out. We'll get back to you at the email you provided as soon as possible.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                style={{
                  background: 'var(--forest)',
                  color: '#a8d4b4',
                  fontSize: '11px',
                  letterSpacing: '.1em',
                  padding: '14px 36px',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'sans-serif',
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="contact-name" style={labelStyle}>Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={updateField('name')}
                  placeholder="Your full name"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="contact-email" style={labelStyle}>Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={updateField('email')}
                  placeholder="your@email.com"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="contact-phone" style={labelStyle}>Phone</label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateField('phone')}
                  placeholder="Your phone number"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="contact-inquiry" style={labelStyle}>Inquiry Type</label>
                <select
                  id="contact-inquiry"
                  name="inquiryType"
                  required
                  value={form.inquiryType}
                  onChange={updateField('inquiryType')}
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  <option value="" style={{ background: 'var(--bg2)' }}>Select an inquiry type...</option>
                  <option value="purchase-firearm" style={{ background: 'var(--bg2)' }}>Purchase a Firearm</option>
                  <option value="purchase-accessory" style={{ background: 'var(--bg2)' }}>Purchase an Accessory</option>
                  <option value="custom-build" style={{ background: 'var(--bg2)' }}>Custom Build</option>
                  <option value="general" style={{ background: 'var(--bg2)' }}>General Question</option>
                </select>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label htmlFor="contact-message" style={labelStyle}>Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  value={form.message}
                  onChange={updateField('message')}
                  placeholder="Tell us what you're looking for..."
                  rows={6}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'sans-serif' }}
                />
              </div>

              {status === 'error' && (
                <p style={{ fontSize: '13px', color: '#e88', marginBottom: '16px' }}>
                  Something went wrong. Please try again or email us directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  background: 'var(--forest)',
                  color: '#a8d4b4',
                  fontSize: '11px',
                  letterSpacing: '.1em',
                  padding: '14px 36px',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: status === 'sending' ? 'wait' : 'pointer',
                  fontFamily: 'sans-serif',
                  opacity: status === 'sending' ? 0.7 : 1,
                }}
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
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
            <div style={labelStyle}>Owner</div>
            <div style={{ fontSize: '16px', color: 'var(--white)' }}>Dave Anderson</div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={labelStyle}>Email</div>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{
              fontSize: '15px',
              color: 'var(--amber)',
              textDecoration: 'none',
            }}>{CONTACT_EMAIL}</a>
          </div>

          <div style={{ marginBottom: '48px' }}>
            <div style={labelStyle}>Phone</div>
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
            <div style={labelStyle}>Hours</div>
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
