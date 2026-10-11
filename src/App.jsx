import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP)

const CTA = 'Get the app'
const ROUTE = 'M980 80 L980 200 L760 200 L760 330 L520 330 L520 460'

function CityMap({ className, children }) {
  const xs = [120, 300, 520, 760, 980, 1110]
  const ys = [80, 200, 330, 460, 590]
  return (
    <svg className={className} viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path className="map-river" d="M-20 640 C 200 560, 380 700, 620 610 S 1000 520, 1240 600" />
      <rect className="map-park" x="320" y="90" width="180" height="95" rx="10" />
      <rect className="map-park" x="780" y="345" width="180" height="100" rx="10" />
      <rect className="map-block" x="540" y="215" width="200" height="100" rx="8" />
      <rect className="map-block" x="140" y="215" width="140" height="100" rx="8" />
      <rect className="map-block" x="1000" y="215" width="90" height="230" rx="8" />
      {xs.map((x) => <line key={'x' + x} className="map-street" x1={x} y1="0" x2={x} y2="700" />)}
      {ys.map((y) => <line key={'y' + y} className="map-street" x1="0" y1={y} x2="1200" y2={y} />)}
      <line className="map-avenue" x1="0" y1="700" x2="700" y2="0" />
      {children}
    </svg>
  )
}

function Car({ long = 1 }) {
  const w = 120 * long
  return (
    <svg viewBox={`0 0 ${w + 20} 60`} className="ride-art" aria-hidden="true">
      <path d={`M10 40 Q12 26 34 24 L${w * 0.32} 10 L${w * 0.72} 10 L${w * 0.86} 24 Q${w + 8} 26 ${w + 10} 40 Z`} />
      <circle cx="34" cy="44" r="10" /><circle cx={w - 14} cy="44" r="10" />
    </svg>
  )
}

function Moto() {
  return (
    <svg viewBox="0 0 140 60" className="ride-art" aria-hidden="true">
      <circle cx="28" cy="42" r="14" /><circle cx="112" cy="42" r="14" />
      <path d="M28 42 L56 22 L92 22 L112 42 M70 22 L64 10 L82 10" fill="none" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const RIDES = [
  { name: 'Go', seats: 'Up to 4', line: 'The everyday ride. Fast pickup, fair fare.', art: <Car /> },
  { name: 'Comfort', seats: 'Up to 4', line: 'Newer cars, more legroom, quiet mode on request.', art: <Car long={1.15} /> },
  { name: 'XL', seats: 'Up to 6', line: 'For the whole crew, the luggage, and the dog.', art: <Car long={1.4} /> },
  { name: 'Moto', seats: '1 rider', line: 'Cut through traffic when minutes matter.', art: <Moto /> },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function App() {
  const root = useRef(null)
  const eta = useRef(null)
  const [days, setDays] = useState(['Mon', 'Wed', 'Sat'])
  const [dest, setDest] = useState('')

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Hero: four planes, four speeds.
      const hero = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero-map', { yPercent: 12, scrollTrigger: hero })
      gsap.to('.hero-copy', { yPercent: -30, opacity: 0, scrollTrigger: hero })
      gsap.to('.hero-phone', { yPercent: -18, scrollTrigger: hero })
      gsap.to('.hero-chip', { yPercent: -120, scrollTrigger: hero })

      const planes = [['.hero-map', 10], ['.hero-phone', 22], ['.hero-chip', 44]].map(([sel, d]) => [
        gsap.quickTo(sel, 'x', { duration: 0.8, ease: 'power3' }),
        gsap.quickTo(sel, 'y', { duration: 0.8, ease: 'power3' }), d,
      ])
      const onMove = (e) => {
        const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5
        planes.forEach(([qx, qy, d]) => { qx(nx * d); qy(ny * d) })
      }
      addEventListener('pointermove', onMove)

      gsap.from('.hero-title .w', { yPercent: 110, stagger: 0.08, duration: 1, ease: 'expo.out' })
      gsap.from('.hero-phone', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.2 })
      gsap.from('.hero-chip', { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(2)', delay: 0.8 })

      // Tension: lines light up one by one while the frame holds.
      gsap.timeline({ scrollTrigger: { trigger: '.tension', start: 'top top', end: '+=140%', scrub: true, pin: true } })
        .to('.tension p', { opacity: 1, stagger: 0.5, ease: 'none' })
        .from('.tension strong', { yPercent: 60, opacity: 0, ease: 'power2.out' }, '>-0.2')

      // Safety: the panel wipes up into place.
      gsap.fromTo('.safety-panel', { clipPath: 'inset(35% 8% 0% 8% round 32px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 32px)', ease: 'none',
          scrollTrigger: { trigger: '.safety', start: 'top bottom', end: 'top 15%', scrub: true } })
      gsap.from('.safety li', { y: 40, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.safety ul', start: 'top 80%' } })

      return () => removeEventListener('pointermove', onMove)
    })

    // Signature: the scroll is the driver. Runs for everyone; reduced motion just jumps instead of easing.
    const path = root.current.querySelector('.route-line')
    const len = path.getTotalLength()
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
    gsap.timeline({
      scrollTrigger: {
        trigger: '.trip', start: 'top top', end: '+=260%', scrub: 0.6, pin: true,
        onUpdate: ({ progress: p }) => {
          const min = Math.ceil(5 * (1 - p))
          eta.current.textContent = p > 0.97 ? 'Your driver is here' : `Arriving in ${min} min`
          root.current.querySelector('.trip').classList.toggle('arrived', p > 0.97)
        },
      },
    })
      .to(path, { strokeDashoffset: 0, ease: 'none' }, 0)
      .to('.route-car', { motionPath: { path: ROUTE, autoRotate: true, alignOrigin: [0.5, 0.5] }, ease: 'none' }, 0)

    // Rides: lateral travel on wide screens; phones swipe natively.
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const track = root.current.querySelector('.rides-track')
      gsap.to(track, {
        x: () => -(track.scrollWidth - innerWidth), ease: 'none',
        scrollTrigger: { trigger: '.rides', start: 'top top', end: () => '+=' + (track.scrollWidth - innerWidth), scrub: true, pin: true, invalidateOnRefresh: true },
      })
    })
  }, { scope: root })

  const toggle = (d) => setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : DAYS.filter((x) => cur.includes(x) || x === d)))

  return (
    <div ref={root}>
      <header className="nav">
        <a href="#top" className="logo">on<span>My</span>Way</a>
        <nav aria-label="Main">
          <a href="#ride">Ride</a><a href="#safety">Safety</a><a href="#drive">Drive</a>
        </nav>
        <a href="#get" className="btn btn-sm">{CTA}</a>
      </header>

      <main id="top">
        <section className="hero">
          <CityMap className="hero-map" />
          <div className="hero-scrim" />
          <div className="hero-copy">
            <h1 className="hero-title">
              <span className="line"><span className="w">Tap.</span></span>{' '}
              <span className="line"><span className="w">Ride.</span></span>{' '}
              <span className="line"><span className="w accent">Arrive.</span></span>
            </h1>
            <p className="lede">A car at your corner in minutes, a fare you see before you book, and a driver you can watch coming.</p>
            <div className="hero-actions">
              <a href="#get" className="btn">{CTA}</a>
              <a href="#drive" className="link">Or drive with us</a>
            </div>
          </div>
          <div className="hero-phone" aria-hidden="true">
            <div className="phone">
              <CityMap className="phone-map"><path className="phone-route" d={ROUTE} /><circle className="pin" cx="520" cy="460" r="16" /></CityMap>
              <div className="sheet">
                <div className="sheet-bar" />
                <div className="sheet-field"><i /> Where to?</div>
                <div className="sheet-row"><b>Home</b><span>Saved</span></div>
                <div className="sheet-row"><b>Work</b><span>Saved</span></div>
              </div>
            </div>
          </div>
          <div className="hero-chip" aria-hidden="true"><span className="dot" /> Driver 2 min away</div>
        </section>

        <section className="tension" aria-label="The old way">
          <div className="tension-inner">
            <p>Waiting on a corner.</p>
            <p>Waving at cars that don't stop.</p>
            <p>Guessing what it'll cost.</p>
            <strong>Not anymore.</strong>
          </div>
        </section>

        <section className="trip" id="ride" aria-label="Watch your driver arrive">
          <CityMap className="trip-map">
            <path className="route-base" d={ROUTE} />
            <path className="route-line" d={ROUTE} />
            <circle className="pickup-ring" cx="520" cy="460" r="34" />
            <circle className="pin" cx="520" cy="460" r="14" />
            <g className="route-car"><rect x="-22" y="-12" width="44" height="24" rx="8" /><rect className="glass" x="4" y="-8" width="10" height="16" rx="3" /></g>
          </CityMap>
          <div className="trip-card">
            <h2>Watch it come to you.</h2>
            <p>Every turn, live on your map. No guessing, no waving, no wondering if it's the right car.</p>
            <div className="eta" aria-live="off"><span className="dot" /><span ref={eta}>Arriving in 5 min</span></div>
          </div>
        </section>

        <section className="safety" id="safety">
          <div className="safety-panel">
            <div className="safety-copy">
              <h2>Safe from the first tap to the front door.</h2>
              <p>Built in, switched on, never an upsell.</p>
            </div>
            <ul>
              <li><b>Share your trip</b><span>Friends follow your ride live, right to the drop-off.</span></li>
              <li><b>Verified drivers</b><span>ID and background checked before their first ride.</span></li>
              <li><b>Ride PIN</b><span>The trip only starts when your four digits match.</span></li>
              <li><b>Help in one tap</b><span>Reach emergency support without leaving the app.</span></li>
            </ul>
          </div>
        </section>

        <section className="rides" aria-label="Ride options">
          <div className="rides-track">
            <div className="rides-intro">
              <h2>A ride for every kind of trip.</h2>
              <p>Pick the one that fits. Switch any time.</p>
            </div>
            {RIDES.map((r) => (
              <article className="ride" key={r.name}>
                {r.art}
                <h3>{r.name}</h3>
                <span className="seats">{r.seats}</span>
                <p>{r.line}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="drive" id="drive">
          <div className="drive-copy">
            <h2>Drive when it suits you. Stop when it doesn't.</h2>
            <p>No shifts, no boss, no minimum hours. Turn the app on, and you're earning. Turn it off, and you're done.</p>
            <a href="#get" className="link">Sign up to drive</a>
          </div>
          <div className="week">
            <p className="week-label">Pick your days</p>
            <div className="days">
              {DAYS.map((d) => (
                <button key={d} type="button" aria-pressed={days.includes(d)} onClick={() => toggle(d)}>{d}</button>
              ))}
            </div>
            <p className="week-out">
              {days.length === 0 ? 'A week off. Also fine.' : days.length === 7 ? 'Every day. Your call.' : `You drive ${days.join(', ')}. That's it.`}
            </p>
          </div>
        </section>

        <section className="close" id="get">
          <h2>Where to?</h2>
          <form className="where" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="dest" className="sr-only">Destination</label>
            <input id="dest" value={dest} onChange={(e) => setDest(e.target.value)} placeholder="Type anywhere" autoComplete="off" />
          </form>
          <p className="close-line">{dest.trim() ? `${dest.trim()} is a few taps away.` : 'Wherever it is, we\'ll get you there.'}</p>
          <div className="stores">
            <a href="#get" className="btn">{CTA} for iPhone</a>
            <a href="#get" className="btn btn-ghost">{CTA} for Android</a>
          </div>
        </section>
      </main>

      <footer className="foot">
        <span className="logo">on<span>My</span>Way</span>
        <span>© 2026 onMyWay</span>
      </footer>
    </div>
  )
}
