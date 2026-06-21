import gunwall from '../assets/gunwall.png'
import scopeview from '../assets/scopeview1.png'
import countersales from '../assets/countersales.png'

export default function Home() {
  return (
    <div style={{ color: 'var(--white)' }}>

      {/* Hero */}
      <div style={{
        padding: '56px 40px 40px',
        textAlign: 'center',
        borderBottom: '1px solid var(--rule)',
      }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '48px',
          letterSpacing: '.08em',
          color: 'var(--white)',
          marginBottom: '16px',
        }}>
          BUILT ON PRECISION. PROVEN BY DISCIPLINE.
        </h1>
        <p style={{
          fontSize: '15px',
          color: 'var(--gun)',
          maxWidth: '620px',
          margin: '0 auto',
          lineHeight: '1.7',
        }}>
          Hangar One Precision Arms offers a curated selection of firearms and accessories, with a specialty in custom rifle builds — engineered for accuracy and performance, with dedicated expertise for the left-hand shooter.
        </p>
        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <a href="/shop" style={{
            background: 'var(--forest)',
            color: '#a8d4b4',
            fontSize: '11px',
            letterSpacing: '.1em',
            padding: '12px 28px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            Shop Now
          </a>
          <a href="/contact" style={{
            border: '1px solid var(--rule)',
            color: 'var(--gun)',
            fontSize: '11px',
            letterSpacing: '.1em',
            padding: '12px 28px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            Contact Us
          </a>
        </div>
      </div>

      {/* Firearms & Accessories - Full Width */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={countersales}
          alt="Firearms and accessories counter"
          style={{
            width: '100%',
            display: 'block',
            maxHeight: '400px',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.3) 100%)',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{ padding: '48px' }}>
            <div style={{
              background: 'var(--forest)',
              display: 'inline-block',
              fontSize: '9px',
              letterSpacing: '.12em',
              color: '#a8d4b4',
              padding: '3px 8px',
              marginBottom: '14px',
              textTransform: 'uppercase',
              fontWeight: '700',
            }}>Firearms &amp; Accessories</div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '42px',
              letterSpacing: '.06em',
              color: 'var(--white)',
              marginBottom: '12px',
              maxWidth: '520px',
            }}>YOUR ONE-STOP GUN SHOP</div>
            <p style={{
              fontSize: '14px',
              color: 'var(--gun)',
              maxWidth: '480px',
              lineHeight: '1.7',
              marginBottom: '20px',
            }}>
              We carry a wide variety of brands to suit every type of shooter — whether you hunt, like to plink, or are just getting started, we have the firearm and accessories to fit your needs.
            </p>
            <a href="/shop" style={{
              display: 'inline-block',
              fontSize: '10px',
              letterSpacing: '.1em',
              color: 'var(--amber)',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}>Browse the Shop →</a>
          </div>
        </div>
      </div>

      {/* Two main tiles - image on top, text below */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2px',
        background: 'var(--rule)',
      }}>

        {/* Gun Wall - Custom Rifles */}
        <div style={{ background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
          <img
            src={gunwall}
            alt="Custom rifle builds"
            style={{ width: '100%', display: 'block' }}
          />
          <div style={{ padding: '28px' }}>
            <div style={{
              background: 'var(--amber)',
              display: 'inline-block',
              fontSize: '9px',
              letterSpacing: '.12em',
              color: '#080808',
              padding: '3px 8px',
              marginBottom: '10px',
              textTransform: 'uppercase',
              fontWeight: '700',
            }}>Custom Rifles</div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '28px',
              letterSpacing: '.06em',
              color: 'var(--white)',
              marginBottom: '8px',
            }}>PRECISION BUILDS</div>
            <div style={{ fontSize: '13px', color: 'var(--gun)', lineHeight: '1.6' }}>
              Hand-built custom rifles crafted to your exact specifications. Every build is tailored for accuracy and performance.
            </div>
          </div>
        </div>

        {/* Scope View - Left Hand Shooter */}
        <div style={{ background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
          <img
            src={scopeview}
            alt="Left hand shooter scope view"
            style={{ width: '100%', display: 'block' }}
          />
          <div style={{ padding: '28px' }}>
            <div style={{
              background: 'var(--gun)',
              display: 'inline-block',
              fontSize: '9px',
              letterSpacing: '.12em',
              color: '#080808',
              padding: '3px 8px',
              marginBottom: '10px',
              textTransform: 'uppercase',
              fontWeight: '700',
            }}>Left-Hand Specialist</div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '28px',
              letterSpacing: '.06em',
              color: 'var(--white)',
              marginBottom: '8px',
            }}>BUILT FOR SOUTHPAWS</div>
            <div style={{ fontSize: '13px', color: 'var(--gun)', lineHeight: '1.6' }}>
              Dedicated expertise for left-handed shooters. Precision optics and custom configurations built around you.
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}