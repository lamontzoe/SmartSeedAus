import { useState } from 'preact/hooks';
import { validateName, validateEmail, validatePhone, validateRequired } from '../../lib/validation';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const services = [
  'Hydroseeding — Residential',
  'Hydroseeding — Commercial',
  'Hydromulching',
  'Watering Services',
  'Mine Rehabilitation',
  'Erosion Control',
  'Not sure — need advice',
];

const states = ['NSW', 'ACT', 'VIC', 'QLD', 'SA', 'WA', 'NT', 'TAS'];

export default function QuoteForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    suburb: '',
    state: '',
    service: '',
    area: '',
    timeline: '',
    message: '',
    honeypot: '',
  });

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    const n = validateName(form.name); if (!n.valid) newErrors.name = n.error!;
    const e = validateEmail(form.email); if (!e.valid) newErrors.email = e.error!;
    const p = validatePhone(form.phone); if (!p.valid) newErrors.phone = p.error!;
    const s = validateRequired(form.suburb, 'Suburb'); if (!s.valid) newErrors.suburb = s.error!;
    const st = validateRequired(form.state, 'State'); if (!st.valid) newErrors.state = st.error!;
    const sv = validateRequired(form.service, 'Service type'); if (!sv.valid) newErrors.service = sv.error!;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (form.honeypot) return; // spam guard
    if (!validate()) return;

    setStatus('submitting');
    try {
      const res = await fetch('https://formspree.io/p/2984562134534323348/f/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: `${form.suburb}, ${form.state}`,
          service: form.service,
          area: form.area,
          timeline: form.timeline,
          message: form.message,
        }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div class="form-success" role="status" aria-live="polite">
        <div class="form-success-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h2>Quote Request Received!</h2>
        <p>Thank you, {form.name.split(' ')[0]}. Our team will review your request and be in touch within 1 business day. For urgent enquiries, please call us directly.</p>
        <a href="/" class="btn btn--primary" style="margin-top: 1.5rem; display:inline-flex;">Back to Home</a>
      </div>
    );
  }

  return (
    <form class="quote-form" onSubmit={handleSubmit} noValidate aria-label="Quote request form">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autocomplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
        value={form.honeypot}
        onInput={(e: Event) => set('honeypot', (e.target as HTMLInputElement).value)}
      />

      <div class="form-row">
        <div class="form-group">
          <label for="qf-name" class="form-label">Full Name <span aria-hidden="true" class="form-required">*</span></label>
          <input
            id="qf-name"
            type="text"
            class={`form-input ${errors.name ? 'form-input--error' : ''}`}
            value={form.name}
            onInput={(e: Event) => set('name', (e.target as HTMLInputElement).value)}
            autocomplete="name"
            aria-required="true"
            aria-describedby={errors.name ? 'qf-name-error' : undefined}
            placeholder="Jane Smith"
          />
          {errors.name && <p id="qf-name-error" class="form-error" role="alert">{errors.name}</p>}
        </div>

        <div class="form-group">
          <label for="qf-email" class="form-label">Email Address <span aria-hidden="true" class="form-required">*</span></label>
          <input
            id="qf-email"
            type="email"
            class={`form-input ${errors.email ? 'form-input--error' : ''}`}
            value={form.email}
            onInput={(e: Event) => set('email', (e.target as HTMLInputElement).value)}
            autocomplete="email"
            aria-required="true"
            aria-describedby={errors.email ? 'qf-email-error' : undefined}
            placeholder="jane@example.com"
          />
          {errors.email && <p id="qf-email-error" class="form-error" role="alert">{errors.email}</p>}
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="qf-phone" class="form-label">Phone Number <span aria-hidden="true" class="form-required">*</span></label>
          <input
            id="qf-phone"
            type="tel"
            class={`form-input ${errors.phone ? 'form-input--error' : ''}`}
            value={form.phone}
            onInput={(e: Event) => set('phone', (e.target as HTMLInputElement).value)}
            autocomplete="tel"
            aria-required="true"
            aria-describedby={errors.phone ? 'qf-phone-error' : undefined}
            placeholder="0400 000 000"
          />
          {errors.phone && <p id="qf-phone-error" class="form-error" role="alert">{errors.phone}</p>}
        </div>

        <div class="form-group">
          <label for="qf-suburb" class="form-label">Suburb / Town <span aria-hidden="true" class="form-required">*</span></label>
          <input
            id="qf-suburb"
            type="text"
            class={`form-input ${errors.suburb ? 'form-input--error' : ''}`}
            value={form.suburb}
            onInput={(e: Event) => set('suburb', (e.target as HTMLInputElement).value)}
            autocomplete="address-level2"
            aria-required="true"
            aria-describedby={errors.suburb ? 'qf-suburb-error' : undefined}
            placeholder="Canberra"
          />
          {errors.suburb && <p id="qf-suburb-error" class="form-error" role="alert">{errors.suburb}</p>}
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="qf-state" class="form-label">State <span aria-hidden="true" class="form-required">*</span></label>
          <select
            id="qf-state"
            class={`form-input form-select ${errors.state ? 'form-input--error' : ''}`}
            value={form.state}
            onChange={(e: Event) => set('state', (e.target as HTMLSelectElement).value)}
            aria-required="true"
            aria-describedby={errors.state ? 'qf-state-error' : undefined}
          >
            <option value="">Select state…</option>
            {states.map(s => <option value={s}>{s}</option>)}
          </select>
          {errors.state && <p id="qf-state-error" class="form-error" role="alert">{errors.state}</p>}
        </div>

        <div class="form-group">
          <label for="qf-service" class="form-label">Service Required <span aria-hidden="true" class="form-required">*</span></label>
          <select
            id="qf-service"
            class={`form-input form-select ${errors.service ? 'form-input--error' : ''}`}
            value={form.service}
            onChange={(e: Event) => set('service', (e.target as HTMLSelectElement).value)}
            aria-required="true"
            aria-describedby={errors.service ? 'qf-service-error' : undefined}
          >
            <option value="">Select service…</option>
            {services.map(s => <option value={s}>{s}</option>)}
          </select>
          {errors.service && <p id="qf-service-error" class="form-error" role="alert">{errors.service}</p>}
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="qf-area" class="form-label">Approximate Area (m²)</label>
          <input
            id="qf-area"
            type="text"
            class="form-input"
            value={form.area}
            onInput={(e: Event) => set('area', (e.target as HTMLInputElement).value)}
            placeholder="e.g. 500"
          />
        </div>

        <div class="form-group">
          <label for="qf-timeline" class="form-label">Preferred Timeline</label>
          <select
            id="qf-timeline"
            class="form-input form-select"
            value={form.timeline}
            onChange={(e: Event) => set('timeline', (e.target as HTMLSelectElement).value)}
          >
            <option value="">Select timeline…</option>
            <option>ASAP</option>
            <option>Within 2 weeks</option>
            <option>Within a month</option>
            <option>2–3 months</option>
            <option>Flexible</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="qf-message" class="form-label">Additional Details</label>
        <textarea
          id="qf-message"
          class="form-input form-textarea"
          rows={4}
          value={form.message}
          onInput={(e: Event) => set('message', (e.target as HTMLTextAreaElement).value)}
          placeholder="Tell us more about your site, soil conditions, slope, any specific requirements…"
        />
      </div>

      {status === 'error' && (
        <div class="form-alert" role="alert">
          <p>Something went wrong sending your request. Please try again or call us directly.</p>
        </div>
      )}

      <button
        type="submit"
        class="btn btn--quote btn--lg form-submit"
        disabled={status === 'submitting'}
        aria-busy={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <>
            <svg class="form-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
            Sending…
          </>
        ) : 'Submit Quote Request'}
      </button>

      <p class="form-note">We respond to all quote requests within 1 business day. Your details are kept private and never shared.</p>
    </form>
  );
}
