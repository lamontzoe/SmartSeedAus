import { useState, useRef, useEffect } from 'preact/hooks';

interface Project {
  id: string;
  name: string;
  loc: string;
  area: string;
  days: string;
  method: string;
  before: string;
  after: string;
}

const PROJECTS: Project[] = [
  {
    id: 'mt-majura',
    name: 'Mt Majura Batter',
    loc: 'ACT · Civil',
    area: '2.4 ha',
    days: '21 days',
    method: 'Hydromulch · native mix',
    before: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=1600&q=80',
    after: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'wagga',
    name: 'Wagga Estate',
    loc: 'NSW · Residential',
    area: '0.8 ha',
    days: '14 days',
    method: 'Hydroseed · couch blend',
    before: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1600&q=80',
    after: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'bendigo',
    name: 'Bendigo Rehab Site',
    loc: 'VIC · Land rehab',
    area: '6.1 ha',
    days: '35 days',
    method: 'Hydromulch · native + fertiliser',
    before: 'https://images.unsplash.com/photo-1569144157591-c60f3f82f137?auto=format&fit=crop&w=1600&q=80',
    after: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
  },
];

export default function BeforeAfter() {
  const [pct, setPct] = useState(55);
  const [active, setActive] = useState(0);
  const shellRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromEvent = (e: MouseEvent | TouchEvent) => {
    if (!shellRef.current) return;
    const rect = shellRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const p = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPct(p);
  };

  const onDown = (e: MouseEvent | TouchEvent) => {
    draggingRef.current = true;
    updateFromEvent(e);
  };

  const onMove = (e: MouseEvent | TouchEvent) => {
    if (draggingRef.current) updateFromEvent(e);
  };

  const onUp = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMove as EventListener);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove as EventListener);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove as EventListener);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove as EventListener);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const curr = PROJECTS[active];

  return (
    <section class="ba-section" id="results" aria-labelledby="results-heading">
      <div class="container">
        <div class="section-label-wrap">
          <span class="section-label">Proof · 05</span>
        </div>
        <h2 id="results-heading" class="ba-title">
          Before &amp; <em>after.</em>
        </h2>

        {/* Drag slider */}
        <div
          class="ba-shell"
          ref={shellRef}
          style={{ '--pct': `${pct}%` } as Record<string, string>}
          onMouseDown={onDown as unknown as (e: MouseEvent) => void}
          onTouchStart={onDown as unknown as (e: TouchEvent) => void}
          aria-label={`Before and after comparison slider for ${curr.name}`}
          role="img"
        >
          <div class="ba-side ba-before">
            <img src={curr.before} alt={`Before: ${curr.name}`} loading="lazy" />
            <div class="ba-label ba-label-before">Before · Day 0</div>
          </div>
          <div class="ba-side ba-after">
            <img src={curr.after} alt={`After: ${curr.name}`} loading="lazy" />
            <div class="ba-label ba-label-after">After · {curr.days}</div>
          </div>
          <div class="ba-handle" aria-hidden="true">
            <div class="ba-knob">‹ ›</div>
          </div>
        </div>

        {/* Meta */}
        <div class="ba-meta">
          <div class="ba-meta-item">
            <div class="ba-meta-key mono">Project</div>
            <div class="ba-meta-val"><em>{curr.name}</em></div>
          </div>
          <div class="ba-meta-item">
            <div class="ba-meta-key mono">Location</div>
            <div class="ba-meta-val">{curr.loc}</div>
          </div>
          <div class="ba-meta-item">
            <div class="ba-meta-key mono">Area treated</div>
            <div class="ba-meta-val">{curr.area}</div>
          </div>
          <div class="ba-meta-item">
            <div class="ba-meta-key mono">Method</div>
            <div class="ba-meta-val">{curr.method}</div>
          </div>
        </div>

        {/* Project thumbnails */}
        <div class="ba-thumbs">
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              class={`ba-thumb${active === i ? ' active' : ''}`}
              onClick={() => { setActive(i); setPct(55); }}
              aria-label={`View ${p.name}`}
              aria-pressed={active === i}
            >
              <div class="ba-thumb-inner">
                <img src={p.before} alt="" loading="lazy" />
                <img src={p.after} alt="" loading="lazy" />
              </div>
              <div class="ba-thumb-label">{p.name}</div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .ba-section {
          padding-block: var(--space-section);
          background: var(--color-bg);
        }

        .ba-title {
          font-family: var(--font-display);
          font-size: var(--text-3xl);
          color: var(--color-green-900);
          margin-bottom: var(--space-8);
        }

        .ba-title em {
          font-style: italic;
          color: var(--color-teal-700);
        }

        /* Slider shell */
        .ba-shell {
          position: relative;
          aspect-ratio: 16 / 8;
          overflow: hidden;
          border-radius: var(--radius-lg);
          cursor: ew-resize;
          user-select: none;
          touch-action: none;
          border: 1px solid var(--color-border);
          margin-bottom: var(--space-6);
        }

        .ba-side {
          position: absolute;
          inset: 0;
        }

        .ba-side img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }

        .ba-before { z-index: 1; }

        .ba-after {
          z-index: 2;
          clip-path: inset(0 0 0 var(--pct));
        }

        .ba-label {
          position: absolute;
          bottom: var(--space-4);
          padding: var(--space-2) var(--space-4);
          background: oklch(18% 0.07 148 / 0.75);
          color: #fff;
          font-size: var(--text-xs);
          font-family: var(--font-mono);
          font-weight: 500;
          letter-spacing: 0.08em;
          border-radius: var(--radius-sm);
          backdrop-filter: blur(4px);
        }

        .ba-label-before { left: var(--space-4); z-index: 1; }
        .ba-label-after  { right: var(--space-4); z-index: 3; }

        .ba-handle {
          position: absolute;
          top: 0;
          bottom: 0;
          left: var(--pct);
          transform: translateX(-50%);
          z-index: 4;
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .ba-handle::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          background: #fff;
          box-shadow: 0 0 8px oklch(0% 0 0 / 0.3);
        }

        .ba-knob {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: var(--radius-full);
          background: #fff;
          color: var(--color-green-800);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 700;
          box-shadow: 0 2px 12px oklch(0% 0 0 / 0.25);
          position: relative;
          z-index: 1;
        }

        /* Meta */
        .ba-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-6);
          padding: var(--space-5) var(--space-6);
          background: var(--color-earth-100);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-8);
        }

        .ba-meta-item {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          min-width: 120px;
        }

        .ba-meta-key {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-earth-400);
        }

        .ba-meta-val {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--color-green-900);
        }

        .ba-meta-val em {
          font-style: italic;
          color: var(--color-teal-700);
        }

        /* Thumbnails */
        .ba-thumbs {
          display: flex;
          gap: var(--space-4);
          overflow-x: auto;
          padding-bottom: var(--space-2);
          scrollbar-width: thin;
          scrollbar-color: var(--color-green-300) transparent;
        }

        .ba-thumb {
          flex-shrink: 0;
          background: none;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          width: 160px;
          transition: border-color var(--duration-fast);
          padding: 0;
        }

        .ba-thumb:hover { border-color: var(--color-green-400); }
        .ba-thumb.active { border-color: var(--color-green-700); }

        .ba-thumb-inner {
          display: flex;
          height: 80px;
        }

        .ba-thumb-inner img {
          flex: 1;
          object-fit: cover;
          display: block;
          width: 50%;
          height: 100%;
        }

        .ba-thumb-label {
          padding: var(--space-2) var(--space-3);
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--color-earth-700);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
        }

        .ba-thumb.active .ba-thumb-label {
          color: var(--color-green-700);
        }
      `}</style>
    </section>
  );
}
