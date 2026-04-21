import { useState } from 'preact/hooks';
import { validateName, validateEmail, validatePhone, validateMessage } from '../../lib/validation';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', honeypot: '' });

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    const n = validateName(form.name); if (!n.valid) newErrors.name = n.error!;
    const e = validateEmail(form.email); if (!e.valid) newErrors.email = e.error!;
    const p = validatePhone(form.phone); if (!p.valid) newErrors.phone = p.error!;
    const m = validateMessage(form.message); if (!m.valid) newErrors.message = m.error!;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (form.honeypot) return;
    if (!validate()) return;

    setStatus('submitting');
    try {
      const res = await fetch('https://formspree.io/p/2984562134534323348/f/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message: form.message }),
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
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h2>Message Sent!</h2>
        <p>Thank you for reaching out. We'll be in touch within 1 business day.</p>
      </div>
    );
  }

  return (
    <form class="contact-form" onSubmit={handleSubmit} noValidate aria-label="Contact form">
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

      <div class="form-group">
        <label for="cf-name" class="form-label">Full Name <span aria-hidden="true" class="form-required">*</span></label>
        <input
          id="cf-name"
          type="text"
          class={`form-input ${errors.name ? 'form-input--error' : ''}`}
          value={form.name}
          onInput={(e: Event) => set('name', (e.target as HTMLInputElement).value)}
          autocomplete="name"
          aria-required="true"
          placeholder="Jane Smith"
        />
        {errors.name && <p class="form-error" role="alert">{errors.name}</p>}
      </div>

      <div class="form-group">
        <label for="cf-email" class="form-label">Email Address <span aria-hidden="true" class="form-required">*</span></label>
        <input
          id="cf-email"
          type="email"
          class={`form-input ${errors.email ? 'form-input--error' : ''}`}
          value={form.email}
          onInput={(e: Event) => set('email', (e.target as HTMLInputElement).value)}
          autocomplete="email"
          aria-required="true"
          placeholder="jane@example.com"
        />
        {errors.email && <p class="form-error" role="alert">{errors.email}</p>}
      </div>

      <div class="form-group">
        <label for="cf-phone" class="form-label">Phone Number <span aria-hidden="true" class="form-required">*</span></label>
        <input
          id="cf-phone"
          type="tel"
          class={`form-input ${errors.phone ? 'form-input--error' : ''}`}
          value={form.phone}
          onInput={(e: Event) => set('phone', (e.target as HTMLInputElement).value)}
          autocomplete="tel"
          aria-required="true"
          placeholder="0400 000 000"
        />
        {errors.phone && <p class="form-error" role="alert">{errors.phone}</p>}
      </div>

      <div class="form-group">
        <label for="cf-message" class="form-label">Message <span aria-hidden="true" class="form-required">*</span></label>
        <textarea
          id="cf-message"
          class={`form-input form-textarea ${errors.message ? 'form-input--error' : ''}`}
          rows={5}
          value={form.message}
          onInput={(e: Event) => set('message', (e.target as HTMLTextAreaElement).value)}
          aria-required="true"
          placeholder="How can we help you?"
        />
        {errors.message && <p class="form-error" role="alert">{errors.message}</p>}
      </div>

      {status === 'error' && (
        <div class="form-alert" role="alert">
          <p>Something went wrong. Please try again or call us directly.</p>
        </div>
      )}

      <button type="submit" class="btn btn--primary btn--lg form-submit" disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
