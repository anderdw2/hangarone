import gunlover from '../assets/gunlover.png'
import mornhunt from '../assets/mornhunt.png'
import patriot from '../assets/patriot7prc.png'

export default function About() {
  return (
    <div style={{ color: 'var(--white)' }}>

      {/* Hero - mornhunt faded background, text only */}
      <div style={{
        position: 'relative',
        minHeight: '420px',
        backgroundImage: `url(${mornhunt})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.82)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '48px' }}>
          <div style={{
            fontSize: '9px',
            letterSpacing: '.14em',
            color: 'var(--amber)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>About Us</div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '52px',
            letterSpacing: '.06em',
            color: 'var(--white)',
            marginBottom: '16px',
            maxWidth: '520px',
            lineHeight: '1.1',
          }}>
            PRECISION IS NOT JUST A NAME
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--gun)',
            maxWidth: '460px',
            lineHeight: '1.7',
          }}>
            Hangar One Precision is a licensed FFL dealer operating as a home-based business — and that's exactly how we keep your costs down. Low overhead means better prices for you, without sacrificing service.
          </p>
        </div>
      </div>

      {/* Three image tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '2px',
        background: 'var(--rule)',
      }}>

        {/* Gunlover tile */}
        <div style={{ overflow: 'hidden' }}>
          <img
            src={gunlover}
            alt="Owner with guns"
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* Mornhunt tile */}
        <div style={{ overflow: 'hidden' }}>
          <img
            src={mornhunt}
            alt="Morning hunt"
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* Patriot tile with overlay text */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={patriot}
            alt="Patriot 7PRC build"
            style={{ width: '100%', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.0) 60%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '24px',
          }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '22px',
              letterSpacing: '.06em',
              color: 'var(--white)',
              lineHeight: '1.2',
            }}>BUILT ON EXPERIENCE.<br />DRIVEN BY PASSION.</div>
          </div>
        </div>

      </div>

      {/* Who we are */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2px',
        background: 'var(--rule)',
      }}>
        <div style={{ background: 'var(--bg)', padding: '56px 48px' }}>
          <div style={{
            fontSize: '9px',
            letterSpacing: '.14em',
            color: 'var(--amber)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>Who We Are</div>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '36px',
            letterSpacing: '.06em',
            color: 'var(--white)',
            marginBottom: '20px',
          }}>BUILT ON EXPERIENCE. DRIVEN BY PASSION.</h2>
          <p style={{ fontSize: '14px', color: 'var(--gun)', lineHeight: '1.8', marginBottom: '16px' }}>
            The owner is a pilot who understands precision, discipline, and the importance of maintaining the tools you depend on. Whether you're a weekend plinker, a serious hunter, or working toward becoming the next legend at the range, we treat every customer and every build with the same level of care.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--gun)', lineHeight: '1.8' }}>
            New to gun ownership? No problem. We'll walk you through everything at your own pace, with zero pressure and straight answers.
          </p>
        </div>

        <div style={{ background: 'var(--bg)', padding: '56px 48px', borderLeft: '1px solid var(--rule)' }}>
          <div style={{
            fontSize: '9px',
            letterSpacing: '.14em',
            color: 'var(--gun-bright)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>Left-Hand Specialist</div>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '36px',
            letterSpacing: '.06em',
            color: 'var(--white)',
            marginBottom: '20px',
          }}>BUILT FOR SOUTHPAWS</h2>
          <p style={{ fontSize: '14px', color: 'var(--gun)', lineHeight: '1.8', marginBottom: '16px' }}>
            We're proud specialists in the left-handed shooting community. As a southpaw shooter himself, the owner knows firsthand how underserved left-handed shooters can be — and we're here to change that, whether through custom builds or sourcing the right left-handed firearm for you.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--gun)', lineHeight: '1.8' }}>
            Beyond sales, we build. Custom rifle builds crafted to your exact specifications, and we partner with an exceptional Cerakote artist who treats every finish like a work of art — as you'll see in our Portfolio.
          </p>
        </div>
      </div>

      {/* Contact strip */}
      <div style={{
        background: 'var(--bg2)',
        borderTop: '1px solid var(--rule)',
        borderBottom: '1px solid var(--rule)',
        padding: '56px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '32px',
      }}>
        <div>
          <div style={{
            fontSize: '9px',
            letterSpacing: '.14em',
            color: 'var(--amber)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>Get In Touch</div>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '36px',
            letterSpacing: '.06em',
            color: 'var(--white)',
            marginBottom: '8px',
          }}>LET'S TALK GUNS</h2>
          <p style={{ fontSize: '14px', color: 'var(--gun)', lineHeight: '1.7' }}>
            Questions about a build, looking for a specific firearm, or just getting started? We're here to help.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '13px', color: 'var(--gun-bright)' }}>Dave Anderson</div>
          <a href="mailto:dave.anderson@hangaroneprecision.com" style={{
            fontSize: '13px',
            color: 'var(--amber)',
            textDecoration: 'none',
            letterSpacing: '.02em',
          }}>dave.anderson@hangaroneprecision.com</a>
          <a href="tel:7178600163" style={{
            fontSize: '13px',
            color: 'var(--amber)',
            textDecoration: 'none',
            letterSpacing: '.04em',
          }}>717.860.0163</a>
          <a href="/contact" style={{
            marginTop: '8px',
            display: 'inline-block',
            background: 'var(--forest)',
            color: '#a8d4b4',
            fontSize: '11px',
            letterSpacing: '.1em',
            padding: '12px 28px',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}>Contact Us</a>
        </div>
      </div>

    </div>
  )
}
