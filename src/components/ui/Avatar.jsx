import { getInitials } from '../../lib/constants'

export default function Avatar({ name, size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'h-5 w-5 text-[10px]' : 'h-8 w-8 text-xs'

  return (
    <span
      className={`chrome-droplet chrome-droplet-circle inline-flex shrink-0 items-center justify-center font-semibold text-ink ${sizeClass}`}
      title={name}
    >
      {getInitials(name)}
    </span>
  )
}
