const variants = {
  primary: 'border-accent bg-accent text-white',
  outline: 'border-navy bg-transparent text-navy',
  'outline-light': 'border-white bg-transparent text-white',
  navy: 'border-navy bg-navy text-white',
}

// Splits the label into characters so each one can roll up on hover
// with a small stagger (see [data-chars] in index.css).
function Chars({ text }) {
  return (
    <span data-chars aria-hidden="true" className="block">
      {[...text].map((ch, i) => (
        <span key={i} style={{ transitionDelay: `${i * 0.018}s` }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}

// Renders a link by default, or a <button> when a `type` is given (e.g. "submit").
export default function Button({ href = '#', variant = 'primary', size = 'narrow', className = '', children, ...props }) {
  const pad = size === 'narrow' ? 'py-[0.88rem]' : 'py-5'
  const Tag = props.type ? 'button' : 'a'
  return (
    <Tag
      href={Tag === 'a' ? href : undefined}
      aria-label={children}
      className={`group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[4px] border px-6 text-main font-semibold leading-none ${pad} ${variants[variant]} ${className}`}
      {...props}
    >
      <Chars text={children} />
    </Tag>
  )
}
