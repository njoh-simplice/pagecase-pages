const paths = {
  mountain: ['m3 20 6-11 4 7 3-5 5 9H3Z', 'm7.5 12 1.5 1.5 1.5-1.5'],
  tree: ['M12 21v-4', 'M12 3 6 11h3l-4 6h14l-4-6h3l-6-8Z'],
  sun: ['M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'],
  waves: ['M2 7c2-1.5 3.5-1.5 5 0s3 1.5 5 0 3.5-1.5 5 0 3 1.5 5 0', 'M2 12c2-1.5 3.5-1.5 5 0s3 1.5 5 0 3.5-1.5 5 0 3 1.5 5 0', 'M2 17c2-1.5 3.5-1.5 5 0s3 1.5 5 0 3.5-1.5 5 0 3 1.5 5 0'],
  landmark: ['M3 21h18', 'M5 21v-9M10 21v-9M14 21v-9M19 21v-9', 'M2 10 12 3l10 7H2Z'],
  pin: ['M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z', 'M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'],
  users: ['M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1', 'M16 3.1a4 4 0 0 1 0 7.8', 'M22 21v-1a6 6 0 0 0-4-5.6'],
  compass: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'm16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1Z'],
  sliders: ['M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3', 'M1 14h6M9 8h6M17 16h6'],
  heart: ['M19.5 13.6 12 21l-7.5-7.4A5 5 0 0 1 12 6.7a5 5 0 0 1 7.5 6.9Z'],
  arrowUp: ['M12 19V5', 'm5 12 7-7 7 7'],
  arrowDown: ['M12 5v14', 'm19 12-7 7-7-7'],
  arrowLeft: ['M19 12H5', 'm12 19-7-7 7-7'],
  arrowRight: ['M5 12h14', 'm12 5 7 7-7 7'],
  arrowUpRight: ['M7 17 17 7', 'M8 7h9v9'],
}

export function Icon({ name, className = 'size-6', strokeWidth = 1.5 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

// Small filled triangle used by dropdown toggles.
export function Caret({ className = '' }) {
  return (
    <svg viewBox="0 0 18 18" className={className} fill="currentColor" aria-hidden="true">
      <path d="M9 12.8c.4-.2.6-.8.9-1.2.8-1.4 1.2-2.1 2.1-3.4.3-.4.6-.9.8-1.3.2-.3.5-.7.1-.9-2.4-.3-4.8-.2-7.3 0-1.2.2.1 1.5.3 2 .9 1.6 1.5 2.6 2.4 4 .2.3.4.7.7.8Z" />
    </svg>
  )
}

export function Play({ className = 'size-8' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5Z" />
    </svg>
  )
}
