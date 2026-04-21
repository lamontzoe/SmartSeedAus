import { useState } from 'preact/hooks';

interface StateData {
  code: string;
  name: string;
  status: string;
  pin: [number, number];
  path: string;
  hub: string;
  response: string;
  projects: string;
}

const STATES: StateData[] = [
  {
    code: 'ACT',
    name: 'Canberra & ACT',
    status: 'Home base',
    pin: [690, 440],
    path: 'M 675,425 L 715,425 L 715,465 L 675,465 Z',
    hub: 'Canberra',
    response: '24–48 hrs',
    projects: '120+ projects',
  },
  {
    code: 'NSW',
    name: 'New South Wales',
    status: 'Full coverage',
    pin: [640, 340],
    path: 'M 420,230 L 820,210 L 860,370 L 820,440 L 720,450 L 715,425 L 675,425 L 675,465 L 560,470 L 450,410 L 400,340 Z',
    hub: 'Sydney · Wagga · Newcastle',
    response: '48–72 hrs',
    projects: '340+ projects',
  },
  {
    code: 'VIC',
    name: 'Victoria',
    status: 'Full coverage',
    pin: [520, 550],
    path: 'M 370,480 L 720,470 L 720,620 L 390,620 Z',
    hub: 'Melbourne · Bendigo',
    response: '48–96 hrs',
    projects: '95+ projects',
  },
];

export default function CoverageMap() {
  const [active, setActive] = useState('ACT');
  const curr = STATES.find(s => s.code === active)!;

  return (
    <section class="coverage-section" id="coverage" aria-labelledby="coverage-heading">
      <div class="container">
        <div class="section-label-wrap">
          <span class="section-label">Coverage · 04</span>
        </div>
        <h2 id="coverage-heading" class="coverage-title">
          Where we <em>work.</em>
        </h2>

        <div class="coverage-grid">
          {/* State selector list */}
          <div class="coverage-states">
            {STATES.map(s => (
              <button
                key={s.code}
                class={`coverage-state${active === s.code ? ' active' : ''}`}
                onClick={() => setActive(s.code)}
                onMouseEnter={() => setActive(s.code)}
                aria-pressed={active === s.code}
              >
                <span class="state-code mono">{s.code}</span>
                <span class="state-name">{s.name}</span>
                <span class="state-status">{s.status} →</span>
              </button>
            ))}
          </div>

          {/* SVG map */}
          <div class="map-shell">
            <svg
              viewBox="300 180 600 470"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Map of Australia showing coverage areas"
              role="img"
            >
              {/* Australia outline */}
              <path
                d="M 340 320 Q 360 240, 460 220 L 640 200 Q 780 200, 860 260 L 880 360 Q 880 440, 800 470 L 720 500 L 720 620 L 430 620 L 380 570 Q 340 500, 340 400 Z"
                fill="oklch(93% 0.02 65)"
                stroke="oklch(72% 0.04 65)"
                strokeWidth="1.5"
              />

              {/* State regions */}
              {STATES.map(s => (
                <g key={s.code}>
                  <path
                    d={s.path}
                    class={`map-state${active === s.code ? ' active' : ''}`}
                    onClick={() => setActive(s.code)}
                    onMouseEnter={() => setActive(s.code)}
                    style={{ cursor: 'pointer' }}
                  />
                  <text
                    x={s.pin[0]}
                    y={s.pin[1] + (s.code === 'ACT' ? -25 : 40)}
                    textAnchor="middle"
                    class={`map-label${active === s.code ? ' active' : ''}`}
                  >
                    {s.code}
                  </text>
                </g>
              ))}

              {/* Animated pin on active state */}
              <g>
                <circle cx={curr.pin[0]} cy={curr.pin[1]} r="18" fill="oklch(65% 0.17 75 / 0.2)">
                  <animate attributeName="r" values="14;26;14" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle
                  cx={curr.pin[0]}
                  cy={curr.pin[1]}
                  r="8"
                  fill="oklch(40% 0.13 148)"
                  stroke="#fff"
                  strokeWidth="2"
                />
              </g>
            </svg>

            {/* Info overlay */}
            <div class="map-info">
              <div class="map-info-item">
                <div class="map-info-key mono">Crew hub</div>
                <div class="map-info-val">{curr.hub}</div>
              </div>
              <div class="map-info-item">
                <div class="map-info-key mono">Response</div>
                <div class="map-info-val">{curr.response}</div>
              </div>
              <div class="map-info-item">
                <div class="map-info-key mono">Delivered</div>
                <div class="map-info-val">{curr.projects}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .coverage-section {
          padding-block: var(--space-section);
          background: var(--color-bg);
        }

        .coverage-title {
          font-family: var(--font-display);
          font-size: var(--text-3xl);
          color: var(--color-green-900);
          margin-bottom: var(--space-10);
        }

        .coverage-title em {
          font-style: italic;
          color: var(--color-teal-700);
        }

        .coverage-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
        }

        @media (min-width: 768px) {
          .coverage-grid {
            grid-template-columns: 220px 1fr;
            align-items: start;
          }
        }

        .coverage-states {
          display: flex;
          flex-direction: row;
          gap: var(--space-3);
          flex-wrap: wrap;
        }

        @media (min-width: 768px) {
          .coverage-states { flex-direction: column; }
        }

        .coverage-state {
          background: none;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-4) var(--space-5);
          cursor: pointer;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          transition: border-color var(--duration-fast), background var(--duration-fast);
          width: 100%;
        }

        .coverage-state:hover {
          border-color: var(--color-green-400);
          background: var(--color-green-50);
        }

        .coverage-state.active {
          border-color: var(--color-green-700);
          background: var(--color-green-50);
        }

        .state-code {
          font-family: var(--font-mono);
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--color-green-800);
        }

        .state-name {
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-earth-700);
        }

        .state-status {
          font-size: var(--text-xs);
          color: var(--color-teal-700);
          font-family: var(--font-mono);
        }

        .coverage-state.active .state-status {
          color: var(--color-green-600);
        }

        /* Map */
        .map-shell {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--color-border);
          background: var(--color-earth-50);
        }

        .map-shell svg {
          width: 100%;
          display: block;
        }

        .map-state {
          fill: oklch(85% 0.04 148 / 0.4);
          stroke: oklch(50% 0.10 148);
          stroke-width: 1.5;
          transition: fill var(--duration-normal);
        }

        .map-state.active {
          fill: oklch(67% 0.14 148 / 0.55);
        }

        .map-state:hover {
          fill: oklch(67% 0.14 148 / 0.4);
        }

        .map-label {
          font-family: sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          fill: oklch(32% 0.11 148);
          letter-spacing: 0.08em;
          pointer-events: none;
          opacity: 0.6;
          transition: opacity var(--duration-normal);
        }

        .map-label.active {
          opacity: 1;
        }

        /* Info panel */
        .map-info {
          display: flex;
          gap: var(--space-6);
          flex-wrap: wrap;
          padding: var(--space-5) var(--space-6);
          border-top: 1px solid var(--color-border);
          background: #fff;
        }

        .map-info-item {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .map-info-key {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-earth-400);
        }

        .map-info-val {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--color-green-900);
        }
      `}</style>
    </section>
  );
}
