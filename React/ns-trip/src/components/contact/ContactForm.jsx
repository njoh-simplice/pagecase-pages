import { useState } from 'react'
import { contact } from '../../utils/content'
import Button from '../ui/Button'

const input =
  'block h-10 w-full rounded-none border-0 border-b-2 border-[#cad5e2] bg-transparent px-[15px] text-[16px] text-ink outline-none transition-colors duration-200 placeholder:text-[#a8a8a8] focus:border-ocean'

function Field({ label, required, className = '', children }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[14px] font-medium text-ink">
        {label}
        {required && <span className="text-accent">*</span>}
      </span>
      {children}
    </label>
  )
}

function Check({ name, required, children }) {
  return (
    <label className="flex items-start gap-3 text-[14px] leading-snug text-ink">
      <input type="checkbox" name={name} required={required} className="mt-0.5 size-4 shrink-0 accent-accent" />
      <span>
        {children}
        {required && <span className="text-accent">*</span>}
      </span>
    </label>
  )
}

// White card form, styled after the reference: underlined fields, small
// labels, an orange submit. It does not send anything yet: connect handleSubmit
// to a form service or backend before launch.
export default function ContactForm() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    // Bots fill every field, people never see this one: drop the submission quietly.
    if (event.currentTarget.elements.website.value) return setSent(true)
    // TODO: send Object.fromEntries(new FormData(event.currentTarget)) to the form service.
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex min-h-[28rem] flex-col items-start justify-center gap-6 rounded-[4px] bg-white p-8 text-ink lg:min-h-[36rem]" role="status">
        <h2 className="max-w-md text-h3">{contact.sent.title}</h2>
        <p className="max-w-md text-ink/70">{contact.sent.text}</p>
        <button type="button" onClick={() => setSent(false)} className="text-small font-semibold text-ocean underline underline-offset-4">
          {contact.sent.again}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[4px] bg-white p-6 text-ink sm:p-8">
      {/* Spam trap: hidden from people and screen readers, left empty by humans. */}
      <div className="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-x-[2.4rem] gap-y-[18px] sm:grid-cols-2">
        <Field label="First name" required>
          <input name="firstName" autoComplete="given-name" maxLength={60} required className={input} />
        </Field>
        <Field label="Last name" required>
          <input name="lastName" autoComplete="family-name" maxLength={60} required className={input} />
        </Field>
        <Field label="Email" required>
          <input type="email" name="email" autoComplete="email" maxLength={254} required className={input} />
        </Field>
        <Field label="Phone">
          <input type="tel" name="phone" autoComplete="tel" maxLength={30} className={input} />
        </Field>

        <Field label="What would you like to experience?" required className="sm:col-span-2">
          <span className="relative block">
            <select name="interest" required defaultValue="" className={`${input} cursor-pointer appearance-none pr-10 invalid:text-[#a8a8a8]`}>
              <option value="" disabled>
                Please select
              </option>
              {contact.interests.map((item) => (
                <option key={item} value={item} className="text-ink">
                  {item}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-ink/50" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Field>

        <Field label="When would you like to travel?">
          <input name="dates" placeholder="e.g. December 2026" maxLength={60} className={input} />
        </Field>
        <Field label="Number of travellers">
          <input type="number" name="travellers" min="1" max="99" inputMode="numeric" className={input} />
        </Field>

        <Field label="Message" required className="sm:col-span-2">
          <textarea name="message" rows={3} maxLength={2000} required className={`${input} h-[66px] min-h-[66px] resize-y py-2`} />
        </Field>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Check name="newsletter">{contact.newsletter}</Check>
        <Check name="consent" required>
          {contact.consent}
        </Check>
      </div>

      <Button type="submit" className="mt-9">
        {contact.submit}
      </Button>
    </form>
  )
}
