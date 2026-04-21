import { useState } from 'preact/hooks';

interface FormState {
  services: string[];
  state: string;
  area: string;
  size: string;
  message: string;
  name: string;
  email: string;
  phone: string;
  honeypot: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const SERVICE_OPTIONS = ['Hydroseeding', 'Hydromulching', 'Watering', 'Not sure yet'];
const STATE_OPTIONS = [
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'SA', label: 'South Australia' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'NT', label: 'Northern Territory' },
  { value: 'TAS', label: 'Tasmania' },
];
const AREA_OPTIONS = [
  'Residential',
  'Commercial / Builder',
  'Council / Government',
  'Mining / Civil',
  'Landscaper (B2B)',
];

const STEP_LABELS = ['Scope', 'Site', 'Contact'];

export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormState>({
    services: [],
    state: '',
    area: '',
    size: '',
    message: '',
    name: '',
    email: '',
    phone: '',
    honeypot: '',
  });

  function update(k: keyof FormState, v: string) {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }));
  }

  function toggleService(s: string) {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter(x => x !== s)
        : [...prev.services, s],
    }));
    if (errors.services) setErrors(prev => ({ ...prev, services: '' }));
  }

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (form.services.length === 0) e.services = 'Pick at least one service';
      if (!form.state) e.state = 'Select a state';
    }
    if (step === 1) {
      if (!form.size.trim()) e.size = 'Site size is required';
    }
    if (step === 2) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
      if (!/^[\d\s()+-]{8,}$/.test(form.phone)) e.phone = 'Valid phone required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep()) setStep(s => s + 1);
  }

  function back() {
    setStep(s => s - 1);
    setErrors({});
  }

  async function submit(e: Event) {
    e.preventDefault();
    if (form.honeypot) return;
    if (!validateStep()) return;

    setStatus('submitting');
    try {
      const res = await fetch('https://formspree.io/p/2984562134534323348/f/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          services: form.services.join(', '),
          state: form.state,
          projectType: form.area,
          siteSize: form.size,
          notes: form.message,
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div class="form-success" role="status" aria-live="polite">
        <div class="form-success-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <h3>Request received.</h3>
        <p>
          We've logged your enquiry for <strong>{form.services.join(' · ')}</strong> in <strong>{form.state}</strong>. Expect a call from the crew on <strong>0491 021 536</strong> within 24–48 hours with a scoped estimate.
        </p>
        <button
          class="form-submit"
          onClick={() => {
            setStatus('idle');
            setStep(0);
            setForm({ services: [], state: '', area: '', size: '', message: '', name: '', email: '', phone: '', honeypot: '' });
          }}
        >
          Submit another →
        </button>
      </div>
    );
  }

  return (
    <form class="quote-wizard" onSubmit={submit} noValidate aria-label="Quote request form">
      {/* Honeypot */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autocomplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
        value={form.honeypot}
        onInput={(e: Event) => update('honeypot', (e.target as HTMLInputElement).value)}
      />

      {/* Step indicator */}
      <div class="step-indicator">
        <div class="step-dots">
          {[0, 1, 2].map(i => (
            <div key={i} class={`step-dot${i === step ? ' active' : i < step ? ' done' : ''}`} aria-hidden="true" />
          ))}
        </div>
        <span class="step-label mono">Step {step + 1} of 3 · {STEP_LABELS[step]}</span>
      </div>

      {/* Step 0: Scope */}
      {step === 0 && (
        <div class="step-content">
          <div class={`form-field${errors.services ? ' field-error' : ''}`}>
            <label class="form-label">Which services are you interested in?</label>
            <div class="service-chips">
              {SERVICE_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  class={`service-chip${form.services.includes(s) ? ' active' : ''}`}
                  onClick={() => toggleService(s)}
                  aria-pressed={form.services.includes(s)}
                >
                  {form.services.includes(s) ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
            {errors.services && <div class="error-msg" role="alert">{errors.services}</div>}
          </div>

          <div class={`form-field${errors.state ? ' field-error' : ''}`}>
            <label for="qw-state" class="form-label">State</label>
            <select
              id="qw-state"
              value={form.state}
              onChange={(e: Event) => update('state', (e.target as HTMLSelectElement).value)}
              aria-required="true"
            >
              <option value="">Choose a state…</option>
              {STATE_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {errors.state && <div class="error-msg" role="alert">{errors.state}</div>}
          </div>

          <div class="form-field">
            <label for="qw-area" class="form-label">Project type</label>
            <select
              id="qw-area"
              value={form.area}
              onChange={(e: Event) => update('area', (e.target as HTMLSelectElement).value)}
            >
              <option value="">Choose…</option>
              {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-next" onClick={next}>Next →</button>
          </div>
        </div>
      )}

      {/* Step 1: Site */}
      {step === 1 && (
        <div class="step-content">
          <div class={`form-field${errors.size ? ' field-error' : ''}`}>
            <label for="qw-size" class="form-label">Site size (approx. m² or hectares)</label>
            <input
              id="qw-size"
              type="text"
              placeholder="e.g. 1,200 m² or 3 ha"
              value={form.size}
              onInput={(e: Event) => update('size', (e.target as HTMLInputElement).value)}
              aria-required="true"
            />
            {errors.size && <div class="error-msg" role="alert">{errors.size}</div>}
          </div>

          <div class="form-field">
            <label for="qw-message" class="form-label">Tell us about the site (optional)</label>
            <textarea
              id="qw-message"
              rows={3}
              placeholder="Slope, access, timeline, species preferences…"
              value={form.message}
              onInput={(e: Event) => update('message', (e.target as HTMLTextAreaElement).value)}
            />
          </div>

          <div class="form-actions">
            <button type="button" class="btn-back" onClick={back}>← Back</button>
            <button type="button" class="btn-next" onClick={next}>Next →</button>
          </div>
        </div>
      )}

      {/* Step 2: Contact */}
      {step === 2 && (
        <div class="step-content">
          <div class={`form-field${errors.name ? ' field-error' : ''}`}>
            <label for="qw-name" class="form-label">Your name</label>
            <input
              id="qw-name"
              type="text"
              placeholder="First and last"
              value={form.name}
              onInput={(e: Event) => update('name', (e.target as HTMLInputElement).value)}
              autocomplete="name"
              aria-required="true"
            />
            {errors.name && <div class="error-msg" role="alert">{errors.name}</div>}
          </div>

          <div class={`form-field${errors.email ? ' field-error' : ''}`}>
            <label for="qw-email" class="form-label">Email</label>
            <input
              id="qw-email"
              type="email"
              placeholder="you@company.com.au"
              value={form.email}
              onInput={(e: Event) => update('email', (e.target as HTMLInputElement).value)}
              autocomplete="email"
              aria-required="true"
            />
            {errors.email && <div class="error-msg" role="alert">{errors.email}</div>}
          </div>

          <div class={`form-field${errors.phone ? ' field-error' : ''}`}>
            <label for="qw-phone" class="form-label">Phone</label>
            <input
              id="qw-phone"
              type="tel"
              placeholder="04xx xxx xxx"
              value={form.phone}
              onInput={(e: Event) => update('phone', (e.target as HTMLInputElement).value)}
              autocomplete="tel"
              aria-required="true"
            />
            {errors.phone && <div class="error-msg" role="alert">{errors.phone}</div>}
          </div>

          {status === 'error' && (
            <div class="form-alert" role="alert">
              Something went wrong. Please try again or call us directly.
            </div>
          )}

          <div class="form-actions">
            <button type="button" class="btn-back" onClick={back}>← Back</button>
            <button
              type="submit"
              class="btn-submit"
              disabled={status === 'submitting'}
              aria-busy={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending…' : 'Send request →'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
