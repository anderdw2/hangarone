import patriot2 from '../assets/patriot7prc2.png'
import krg from '../assets/krg257blue.png'
import stormtrooper from '../assets/stormtrooper.png'
import creed from '../assets/65creed.png'

export default function Portfolio() {
  return (
    <div style={{ color: 'var(--white)' }}>

      {/* Hero - full width */}
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
        }}>Our Work</div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '52px',
          letterSpacing: '.06em',
          color: 'var(--white)',
          marginBottom: '16px',
          lineHeight: '1.1',
        }}>OUR WORK SPEAKS FOR ITSELF</h1>
        <p style={{
          fontSize: '14px',
          color: 'var(--gun)',
          lineHeight: '1.8',
          marginBottom: '16px',
        }}>
          At Hangar One Precision, every build starts with a conversation and ends with a rifle that's uniquely yours. Whether you're looking for a custom bolt gun built for long-range precision, or an AR-platform rifle dialed in for your shooting style, we bring the same level of care and craftsmanship to every project.
        </p>
        <p style={{
          fontSize: '14px',
          color: 'var(--gun)',
          lineHeight: '1.8',
          marginBottom: '16px',
        }}>
          We also partner with an exceptional Cerakote artist to give your chassis, stock, or entire rifle a finish that's as tough as it is striking. From tactical matte blacks to patriotic custom patterns, the options are limitless.
        </p>
        <p style={{
          fontSize: '14px',
          color: 'var(--gun)',
          lineHeight: '1.8',
        }}>
          And while we specialize in left-handed builds, our right-handed friends are equally welcome — we build for the shooter, not the hand.
        </p>
      </div>

      {/* Row 1 - patriot7prc2 image left, text right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2px',
        background: 'var(--rule)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <img
            src={patriot2}
            alt="Patriot 7PRC build"
            style={{ width: '100%', display: 'block' }}
          />
        </div>
        <div style={{ background: 'var(--bg)', padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            fontSize: '9px',
            letterSpacing: '.14em',
            color: 'var(--amber)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>Custom Bolt Gun</div>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '36px',
            letterSpacing: '.06em',
            color: 'var(--white)',
            marginBottom: '20px',
          }}>PATRIOT 7PRC</h2>
          <p style={{ fontSize: '14px', color: 'var(--gun)', lineHeight: '1.8' }}>
            A precision long-range bolt gun built for the left-hand shooter. Custom chassis, hand-selected components, and a Cerakote finish that turns heads at the range.
          </p>
        </div>
      </div>

      {/* Row 2 - text left, krg image right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2px',
        background: 'var(--rule)',
      }}>
        <div style={{ background: 'var(--bg)', padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            fontSize: '9px',
            letterSpacing: '.14em',
            color: 'var(--gun-bright)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>Custom Bolt Gun</div>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '36px',
            letterSpacing: '.06em',
            color: 'var(--white)',
            marginBottom: '20px',
          }}>KRG 257 — BLUE</h2>
          <p style={{ fontSize: '14px', color: 'var(--gun)', lineHeight: '1.8' }}>
            A KRG chassis ready to mount to a 700 Remington action and X-Caliber barrel in .257 Weatherby — finished in a striking custom blue Cerakote.
          </p>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <img
            src={krg}
            alt="KRG 257 Blue build"
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      </div>

      {/* Row 3 - stormtrooper image left, text right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2px',
        background: 'var(--rule)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <img
            src={stormtrooper}
            alt="Stormtrooper white Cerakote build"
            style={{ width: '100%', display: 'block' }}
          />
        </div>
        <div style={{ background: 'var(--bg)', padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            fontSize: '9px',
            letterSpacing: '.14em',
            color: 'var(--gun-bright)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>Cerakote Custom</div>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '36px',
            letterSpacing: '.06em',
            color: 'var(--white)',
            marginBottom: '20px',
          }}>THE STORMTROOPER</h2>
          <p style={{ fontSize: '14px', color: 'var(--gun)', lineHeight: '1.8' }}>
            An all-white Cerakote finish that makes a statement. Clean, aggressive, and unmistakable — this is what happens when our Cerakote artist has room to work.
          </p>
        </div>
      </div>

      {/* Row 4 - 65creed full width CTA */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={creed}
          alt="65 Creedmoor build"
          style={{ width: '100%', display: 'block' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0.1) 100%)',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{ padding: '48px' }}>
            <div style={{
              fontSize: '9px',
              letterSpacing: '.14em',
              color: 'var(--amber)',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>Ready to Build?</div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '42px',
              letterSpacing: '.06em',
              color: 'var(--white)',
              marginBottom: '12px',
              lineHeight: '1.1',
            }}>LET'S BUILD YOURS</h2>
            <p style={{ fontSize: '14px', color: 'var(--gun)', maxWidth: '400px', lineHeight: '1.7', marginBottom: '24px' }}>
              Every rifle in our portfolio started with a conversation. Let's start yours.
            </p>
            <a href="/contact" style={{
              display: 'inline-block',
              background: 'var(--forest)',
              color: '#a8d4b4',
              fontSize: '11px',
              letterSpacing: '.1em',
              padding: '12px 28px',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}>Start a Build →</a>
          </div>
        </div>
      </div>

    </div>
  )
}