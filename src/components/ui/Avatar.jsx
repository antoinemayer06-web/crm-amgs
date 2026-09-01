import { getAvatarColor, getInitials } from '../../lib/constants'

export default function Avatar({ name, size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'h-5 w-5 text-[10px]' : 'h-8 w-8 text-xs'

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white ${sizeClass} ${getAvatarColor(name)}`}
      title={name}
    >
      {getInitials(name)}
    </span>
  )
}
